import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ProductivityState,
  Goal,
  SubCategory,
  Wave,
  WaveSubCategoryRef,
  Category,
  SubCategorySnapshot,
  WaveStatus,
} from '@/types/productivity';

// Version for backup compatibility
export const STORE_VERSION = 2;

// Generate unique IDs
const generateId = () => crypto.randomUUID();

// Helper to compute wave status based on dates
export function computeWaveStatus(wave: Wave): WaveStatus {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(wave.startDate);
  start.setHours(0, 0, 0, 0);
  const end = new Date(wave.endDate);
  end.setHours(0, 0, 0, 0);

  if (now > end) return 'completed';
  if (now >= start && now <= end) return 'in-progress';
  return 'planned';
}

// Helper to validate wave date overlap
export function validateWaveDates(
  waves: Wave[],
  newStart: string,
  newEnd: string,
  excludeWaveId?: string
): { valid: boolean; error?: string } {
  const start = new Date(newStart);
  const end = new Date(newEnd);

  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' };
  }

  for (const wave of waves) {
    if (excludeWaveId && wave.id === excludeWaveId) continue;

    const waveStart = new Date(wave.startDate);
    const waveEnd = new Date(wave.endDate);

    // Check for overlap: ranges overlap if start1 <= end2 AND start2 <= end1
    if (start <= waveEnd && waveStart <= end) {
      return {
        valid: false,
        error: `Dates overlap with "${wave.name || 'Unnamed wave'}"`,
      };
    }
  }

  return { valid: true };
}

// Default initial state (empty, for fresh users)
const defaultState: ProductivityState = {
  activeTab: 'goals',
  goals: [],
  categories: [],
  waves: [],
  notes: '',
};

// Sample initial state for first-time users
const sampleState: ProductivityState = {
  activeTab: 'goals',
  goals: [
    {
      id: generateId(),
      content: '<h2>Read 24 books this year</h2><p>Focus on philosophy, productivity, and fiction. Expected outcomes:</p><ul><li>Broader perspective on life</li><li>Improved focus and attention</li></ul>',
    },
    {
      id: generateId(),
      content: '<h2>Health & Fitness</h2><p>Establish a sustainable morning exercise routine.</p>',
    },
  ],
  categories: [
    {
      id: 'cat-1',
      name: 'Work Projects',
      color: 'sage',
      isExpanded: true,
      subCategories: [
        {
          id: 'sub-1',
          title: 'Q1 Product Launch',
          comments: '<p>Coordinate with design and engineering teams</p>',
          isExpanded: false,
          status: 'in-progress',
          completion: 0.35,
          importance: 'high',
          isHighlighted: false,
        },
        {
          id: 'sub-2',
          title: 'Documentation Update',
          comments: '<p>Review all API docs before release</p>',
          isExpanded: false,
          status: 'on-hold',
          completion: 0.1,
          importance: 'medium',
          isHighlighted: false,
        },
      ],
    },
    {
      id: 'cat-2',
      name: 'Personal',
      color: 'amber',
      isExpanded: true,
      subCategories: [
        {
          id: 'sub-3',
          title: 'Morning Routine',
          comments: '<p>Wake at 6am, meditate, exercise</p>',
          isExpanded: false,
          status: 'in-progress',
          completion: 0.6,
          importance: 'high',
          isHighlighted: true,
        },
      ],
    },
  ],
  waves: [
    {
      id: generateId(),
      name: 'January Sprint',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      majorGoals: '<p>Focus on product launch preparation and establishing routines</p>',
      retrospective: '',
      isExpanded: true,
      dataMode: 'reference',
      subCategoryRefs: [
        { subCategoryId: 'sub-1', categoryId: 'cat-1' },
        { subCategoryId: 'sub-3', categoryId: 'cat-2' },
      ],
      subCategorySnapshots: [],
    },
  ],
  notes: '',
};

// Store actions interface
interface ProductivityActions {
  // Tab navigation
  setActiveTab: (tab: ProductivityState['activeTab']) => void;
  
  // Goal actions (simplified - flat list)
  addGoal: (content?: string) => void;
  updateGoal: (id: string, content: string) => void;
  deleteGoal: (id: string) => void;
  
  // Notes actions
  updateNotes: (content: string) => void;
  
  // Task Category actions
  addCategory: (name: string) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id' | 'subCategories'>>) => void;
  deleteCategory: (id: string) => void;
  toggleCategory: (id: string) => void;
  
  // Sub-Category actions
  addSubCategory: (categoryId: string, subCategory: Omit<SubCategory, 'id' | 'isExpanded'>) => void;
  updateSubCategory: (categoryId: string, subCategoryId: string, updates: Partial<SubCategory>) => void;
  deleteSubCategory: (categoryId: string, subCategoryId: string) => void;
  toggleSubCategory: (categoryId: string, subCategoryId: string) => void;
  
  // Wave actions
  addWave: (wave: Omit<Wave, 'id' | 'subCategoryRefs' | 'subCategorySnapshots' | 'isExpanded' | 'dataMode'>) => { success: boolean; error?: string };
  updateWave: (id: string, updates: Partial<Wave>) => { success: boolean; error?: string };
  deleteWave: (id: string) => void;
  toggleWave: (id: string) => void;
  addSubCategoryToWave: (waveId: string, ref: WaveSubCategoryRef) => void;
  removeSubCategoryFromWave: (waveId: string, subCategoryId: string) => void;
  
  // Wave status management
  refreshWaveStatuses: () => void;
  convertWaveToSnapshot: (waveId: string) => void;
  convertWaveToReference: (waveId: string) => void;
  
  // Helper functions
  getSubCategory: (categoryId: string, subCategoryId: string) => SubCategory | undefined;
  getCategory: (categoryId: string) => Category | undefined;
  getWaveStatus: (waveId: string) => WaveStatus | undefined;
  
  // Backup/Restore
  getSnapshot: () => ProductivityState;
  restoreFromBackup: (state: ProductivityState) => void;
  resetToDefault: () => void;
}

type ProductivityStore = ProductivityState & ProductivityActions;

export const useProductivityStore = create<ProductivityStore>()(
  persist(
    (set, get) => ({
      ...sampleState,
      
      // Tab navigation
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      // Goal actions (flat list)
      addGoal: (content = '') => set((state) => ({
        goals: [
          ...state.goals,
          { id: generateId(), content },
        ],
      })),
      
      updateGoal: (id, content) => set((state) => ({
        goals: state.goals.map((goal) =>
          goal.id === id ? { ...goal, content } : goal
        ),
      })),
      
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter((goal) => goal.id !== id),
      })),
      
      // Notes actions
      updateNotes: (content) => set({ notes: content }),
      
      // Task Category actions
      addCategory: (name) => set((state) => ({
        categories: [
          ...state.categories,
          { id: generateId(), name, color: 'neutral', subCategories: [], isExpanded: true },
        ],
      })),
      
      updateCategory: (id, updates) => set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, ...updates } : cat
        ),
      })),
      
      deleteCategory: (id) => set((state) => {
        const categoryToDelete = state.categories.find((c) => c.id === id);
        const subCategoryIds = categoryToDelete?.subCategories.map((s) => s.id) || [];
        
        return {
          categories: state.categories.filter((cat) => cat.id !== id),
          waves: state.waves.map((wave) => ({
            ...wave,
            subCategoryRefs: wave.subCategoryRefs.filter(
              (ref) => !subCategoryIds.includes(ref.subCategoryId)
            ),
          })),
        };
      }),
      
      toggleCategory: (id) => set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === id ? { ...cat, isExpanded: !cat.isExpanded } : cat
        ),
      })),
      
      // Sub-Category actions
      addSubCategory: (categoryId, subCategory) => set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                subCategories: [
                  ...cat.subCategories,
                  { id: generateId(), ...subCategory, isExpanded: false },
                ],
              }
            : cat
        ),
      })),
      
      updateSubCategory: (categoryId, subCategoryId, updates) => set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.map((sub) =>
                  sub.id === subCategoryId ? { ...sub, ...updates } : sub
                ),
              }
            : cat
        ),
      })),
      
      deleteSubCategory: (categoryId, subCategoryId) => set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.filter((s) => s.id !== subCategoryId),
              }
            : cat
        ),
        waves: state.waves.map((wave) => ({
          ...wave,
          subCategoryRefs: wave.subCategoryRefs.filter(
            (ref) => ref.subCategoryId !== subCategoryId
          ),
        })),
      })),
      
      toggleSubCategory: (categoryId, subCategoryId) => set((state) => ({
        categories: state.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.map((sub) =>
                  sub.id === subCategoryId ? { ...sub, isExpanded: !sub.isExpanded } : sub
                ),
              }
            : cat
        ),
      })),
      
      // Wave actions
      addWave: (wave) => {
        const state = get();
        const validation = validateWaveDates(state.waves, wave.startDate, wave.endDate);
        
        if (!validation.valid) {
          return { success: false, error: validation.error };
        }

        const newWave: Wave = {
          id: generateId(),
          ...wave,
          isExpanded: true,
          dataMode: computeWaveStatus({ ...wave, id: '', isExpanded: true, dataMode: 'reference', subCategoryRefs: [], subCategorySnapshots: [] }) === 'in-progress' ? 'reference' : 'snapshot',
          subCategoryRefs: [],
          subCategorySnapshots: [],
        };

        set((state) => ({
          waves: [...state.waves, newWave],
        }));

        return { success: true };
      },
      
      updateWave: (id, updates) => {
        const state = get();
        const wave = state.waves.find((w) => w.id === id);
        
        if (!wave) return { success: false, error: 'Wave not found' };
        
        // If dates are being updated, validate them
        if (updates.startDate !== undefined || updates.endDate !== undefined) {
          const newStart = updates.startDate ?? wave.startDate;
          const newEnd = updates.endDate ?? wave.endDate;
          const validation = validateWaveDates(state.waves, newStart, newEnd, id);
          
          if (!validation.valid) {
            return { success: false, error: validation.error };
          }
        }

        set((state) => ({
          waves: state.waves.map((w) =>
            w.id === id ? { ...w, ...updates } : w
          ),
        }));

        // Refresh statuses after update
        get().refreshWaveStatuses();

        return { success: true };
      },
      
      deleteWave: (id) => set((state) => ({
        waves: state.waves.filter((wave) => wave.id !== id),
      })),
      
      toggleWave: (id) => set((state) => ({
        waves: state.waves.map((wave) =>
          wave.id === id ? { ...wave, isExpanded: !wave.isExpanded } : wave
        ),
      })),
      
      addSubCategoryToWave: (waveId, ref) => {
        const state = get();
        const wave = state.waves.find((w) => w.id === waveId);
        
        if (!wave) return;
        
        const status = computeWaveStatus(wave);
        
        if (status !== 'in-progress') {
          // Can't add references to non-in-progress waves
          return;
        }

        set((state) => ({
          waves: state.waves.map((w) =>
            w.id === waveId
              ? { ...w, subCategoryRefs: [...w.subCategoryRefs, ref] }
              : w
          ),
        }));
      },
      
      removeSubCategoryFromWave: (waveId, subCategoryId) => set((state) => ({
        waves: state.waves.map((wave) =>
          wave.id === waveId
            ? {
                ...wave,
                subCategoryRefs: wave.subCategoryRefs.filter(
                  (ref) => ref.subCategoryId !== subCategoryId
                ),
                subCategorySnapshots: wave.subCategorySnapshots.filter(
                  (snap) => snap.id !== subCategoryId
                ),
              }
            : wave
        ),
      })),

      // Wave status management
      refreshWaveStatuses: () => {
        const state = get();
        const store = get();
        
        set({
          waves: state.waves.map((wave) => {
            const newStatus = computeWaveStatus(wave);
            const currentMode = wave.dataMode;
            
            // If becoming completed or planned and currently reference mode, convert to snapshot
            if (newStatus !== 'in-progress' && currentMode === 'reference') {
              const snapshots = wave.subCategoryRefs.map((ref): SubCategorySnapshot | null => {
                const category = store.getCategory(ref.categoryId);
                const subCat = store.getSubCategory(ref.categoryId, ref.subCategoryId);
                
                if (!category || !subCat) return null;
                
                return {
                  id: subCat.id,
                  title: subCat.title,
                  comments: subCat.comments,
                  status: subCat.status,
                  completion: subCat.completion,
                  importance: subCat.importance,
                  isHighlighted: subCat.isHighlighted,
                  categoryId: category.id,
                  categoryName: category.name,
                  categoryColor: category.color,
                };
              }).filter((s): s is SubCategorySnapshot => s !== null);

              return {
                ...wave,
                dataMode: 'snapshot' as const,
                subCategoryRefs: [],
                subCategorySnapshots: snapshots,
              };
            }
            
            // If becoming in-progress and currently snapshot mode, convert to reference
            if (newStatus === 'in-progress' && currentMode === 'snapshot') {
              const refs = wave.subCategorySnapshots
                .map((snap): WaveSubCategoryRef | null => {
                  // Only create reference if the sub-category still exists
                  const exists = store.getSubCategory(snap.categoryId, snap.id);
                  if (!exists) return null;
                  
                  return {
                    subCategoryId: snap.id,
                    categoryId: snap.categoryId,
                  };
                })
                .filter((r): r is WaveSubCategoryRef => r !== null);

              return {
                ...wave,
                dataMode: 'reference' as const,
                subCategoryRefs: refs,
                subCategorySnapshots: [],
              };
            }
            
            return wave;
          }),
        });
      },

      convertWaveToSnapshot: (waveId) => {
        const store = get();
        
        set((state) => ({
          waves: state.waves.map((wave) => {
            if (wave.id !== waveId) return wave;
            
            const snapshots = wave.subCategoryRefs.map((ref): SubCategorySnapshot | null => {
              const category = store.getCategory(ref.categoryId);
              const subCat = store.getSubCategory(ref.categoryId, ref.subCategoryId);
              
              if (!category || !subCat) return null;
              
              return {
                id: subCat.id,
                title: subCat.title,
                comments: subCat.comments,
                status: subCat.status,
                completion: subCat.completion,
                importance: subCat.importance,
                isHighlighted: subCat.isHighlighted,
                categoryId: category.id,
                categoryName: category.name,
                categoryColor: category.color,
              };
            }).filter((s): s is SubCategorySnapshot => s !== null);

            return {
              ...wave,
              dataMode: 'snapshot' as const,
              subCategoryRefs: [],
              subCategorySnapshots: snapshots,
            };
          }),
        }));
      },

      convertWaveToReference: (waveId) => {
        const store = get();
        
        set((state) => ({
          waves: state.waves.map((wave) => {
            if (wave.id !== waveId) return wave;
            
            const refs = wave.subCategorySnapshots
              .map((snap): WaveSubCategoryRef | null => {
                const exists = store.getSubCategory(snap.categoryId, snap.id);
                if (!exists) return null;
                
                return {
                  subCategoryId: snap.id,
                  categoryId: snap.categoryId,
                };
              })
              .filter((r): r is WaveSubCategoryRef => r !== null);

            return {
              ...wave,
              dataMode: 'reference' as const,
              subCategoryRefs: refs,
              subCategorySnapshots: [],
            };
          }),
        }));
      },
      
      // Helper functions
      getSubCategory: (categoryId, subCategoryId) => {
        const state = get();
        const category = state.categories.find((c) => c.id === categoryId);
        return category?.subCategories.find((s) => s.id === subCategoryId);
      },
      
      getCategory: (categoryId) => {
        const state = get();
        return state.categories.find((c) => c.id === categoryId);
      },

      getWaveStatus: (waveId) => {
        const state = get();
        const wave = state.waves.find((w) => w.id === waveId);
        if (!wave) return undefined;
        return computeWaveStatus(wave);
      },
      
      // Backup/Restore
      getSnapshot: () => {
        const state = get();
        return {
          activeTab: state.activeTab,
          goals: state.goals,
          categories: state.categories,
          waves: state.waves,
          notes: state.notes,
        };
      },
      
      restoreFromBackup: (newState) => set({
        activeTab: newState.activeTab,
        goals: newState.goals || [],
        categories: newState.categories,
        waves: newState.waves,
        notes: newState.notes || '',
      }),
      
      resetToDefault: () => set(defaultState),
    }),
    {
      name: 'rolling-waves-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        activeTab: state.activeTab,
        goals: state.goals,
        categories: state.categories,
        waves: state.waves,
        notes: state.notes,
      }),
    }
  )
);

// Compatibility hook for existing components that use dispatch pattern
export function useProductivity() {
  const store = useProductivityStore();
  
  // Create a dispatch-like interface for backward compatibility
  const dispatch = (action: { type: string; payload?: any }) => {
    switch (action.type) {
      case 'SET_ACTIVE_TAB':
        store.setActiveTab(action.payload);
        break;
      // Goal actions (new simplified)
      case 'ADD_GOAL':
        store.addGoal(action.payload?.content);
        break;
      case 'UPDATE_GOAL':
        store.updateGoal(action.payload.id, action.payload.content);
        break;
      case 'DELETE_GOAL':
        store.deleteGoal(action.payload.id);
        break;
      // Task Category actions
      case 'ADD_CATEGORY':
        store.addCategory(action.payload.name);
        break;
      case 'UPDATE_CATEGORY':
        store.updateCategory(action.payload.id, action.payload.updates || { name: action.payload.name });
        break;
      case 'DELETE_CATEGORY':
        store.deleteCategory(action.payload.id);
        break;
      case 'TOGGLE_CATEGORY':
        store.toggleCategory(action.payload.id);
        break;
      case 'ADD_SUBCATEGORY':
        store.addSubCategory(action.payload.categoryId, action.payload.subCategory);
        break;
      case 'UPDATE_SUBCATEGORY':
        store.updateSubCategory(action.payload.categoryId, action.payload.subCategoryId, action.payload.updates);
        break;
      case 'DELETE_SUBCATEGORY':
        store.deleteSubCategory(action.payload.categoryId, action.payload.subCategoryId);
        break;
      case 'TOGGLE_SUBCATEGORY':
        store.toggleSubCategory(action.payload.categoryId, action.payload.subCategoryId);
        break;
      case 'ADD_WAVE':
        return store.addWave(action.payload);
      case 'UPDATE_WAVE':
        return store.updateWave(action.payload.id, action.payload.updates);
      case 'DELETE_WAVE':
        store.deleteWave(action.payload.id);
        break;
      case 'TOGGLE_WAVE':
        store.toggleWave(action.payload.id);
        break;
      case 'ADD_SUBCATEGORY_TO_WAVE':
        store.addSubCategoryToWave(action.payload.waveId, action.payload.ref);
        break;
      case 'REMOVE_SUBCATEGORY_FROM_WAVE':
        store.removeSubCategoryFromWave(action.payload.waveId, action.payload.subCategoryId);
        break;
      case 'REFRESH_WAVE_STATUSES':
        store.refreshWaveStatuses();
        break;
    }
  };
  
  return {
    state: {
      activeTab: store.activeTab,
      goals: store.goals,
      categories: store.categories,
      waves: store.waves,
      notes: store.notes,
    },
    dispatch,
    getSubCategory: store.getSubCategory,
    getCategory: store.getCategory,
    getWaveStatus: store.getWaveStatus,
  };
}
