import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import {
  ProductivityState,
  GoalCategory,
  GoalItem,
  Upshot,
  Category,
  SubCategory,
  Wave,
  WaveSubCategoryRef,
  TagColor,
} from '@/types/productivity';

// Generate unique IDs
const generateId = () => crypto.randomUUID();

// Initial state with sample data
const initialState: ProductivityState = {
  activeTab: 'goals',
  goalCategories: [
    {
      id: generateId(),
      name: 'Personal Growth',
      isExpanded: true,
      goals: [
        {
          id: generateId(),
          title: 'Read 24 books this year',
          description: 'Focus on philosophy, productivity, and fiction',
          upshots: [
            { id: generateId(), content: 'Broader perspective on life' },
            { id: generateId(), content: 'Improved focus and attention' },
          ],
        },
      ],
    },
  ],
  categories: [
    {
      id: 'cat-1',
      name: 'Work Projects',
      isExpanded: true,
      subCategories: [
        {
          id: 'sub-1',
          title: 'Q1 Product Launch',
          comments: 'Coordinate with design and engineering teams',
          color: 'sage',
          isExpanded: false,
          status: 'in-progress',
          completion: 0.35,
          importance: 'high',
        },
        {
          id: 'sub-2',
          title: 'Documentation Update',
          comments: 'Review all API docs before release',
          color: 'sky',
          isExpanded: false,
          status: 'on-hold',
          completion: 0.1,
          importance: 'medium',
        },
      ],
    },
    {
      id: 'cat-2',
      name: 'Personal',
      isExpanded: true,
      subCategories: [
        {
          id: 'sub-3',
          title: 'Morning Routine',
          comments: 'Wake at 6am, meditate, exercise',
          color: 'amber',
          isExpanded: false,
          status: 'in-progress',
          completion: 0.6,
          importance: 'high',
        },
      ],
    },
  ],
  waves: [
    {
      id: generateId(),
      name: 'January Sprint',
      startDate: '2025-01-01',
      durationDays: 14,
      majorGoals: 'Focus on product launch preparation and establishing routines',
      retrospective: '',
      subCategoryRefs: [
        { subCategoryId: 'sub-1', categoryId: 'cat-1' },
        { subCategoryId: 'sub-3', categoryId: 'cat-2' },
      ],
      isExpanded: true,
    },
  ],
};

// Action types
type Action =
  | { type: 'SET_ACTIVE_TAB'; payload: ProductivityState['activeTab'] }
  // Goal actions
  | { type: 'ADD_GOAL_CATEGORY'; payload: { name: string } }
  | { type: 'UPDATE_GOAL_CATEGORY'; payload: { id: string; name: string } }
  | { type: 'DELETE_GOAL_CATEGORY'; payload: { id: string } }
  | { type: 'TOGGLE_GOAL_CATEGORY'; payload: { id: string } }
  | { type: 'ADD_GOAL_ITEM'; payload: { categoryId: string; goal: Omit<GoalItem, 'id' | 'upshots'> } }
  | { type: 'UPDATE_GOAL_ITEM'; payload: { categoryId: string; goalId: string; updates: Partial<GoalItem> } }
  | { type: 'DELETE_GOAL_ITEM'; payload: { categoryId: string; goalId: string } }
  | { type: 'ADD_UPSHOT'; payload: { categoryId: string; goalId: string; content: string } }
  | { type: 'UPDATE_UPSHOT'; payload: { categoryId: string; goalId: string; upshotId: string; content: string } }
  | { type: 'DELETE_UPSHOT'; payload: { categoryId: string; goalId: string; upshotId: string } }
  // Task actions
  | { type: 'ADD_CATEGORY'; payload: { name: string } }
  | { type: 'UPDATE_CATEGORY'; payload: { id: string; name: string } }
  | { type: 'DELETE_CATEGORY'; payload: { id: string } }
  | { type: 'TOGGLE_CATEGORY'; payload: { id: string } }
  | { type: 'ADD_SUBCATEGORY'; payload: { categoryId: string; subCategory: Omit<SubCategory, 'id' | 'isExpanded'> } }
  | { type: 'UPDATE_SUBCATEGORY'; payload: { categoryId: string; subCategoryId: string; updates: Partial<SubCategory> } }
  | { type: 'DELETE_SUBCATEGORY'; payload: { categoryId: string; subCategoryId: string } }
  | { type: 'TOGGLE_SUBCATEGORY'; payload: { categoryId: string; subCategoryId: string } }
  // Wave actions
  | { type: 'ADD_WAVE'; payload: Omit<Wave, 'id' | 'subCategoryRefs' | 'isExpanded'> }
  | { type: 'UPDATE_WAVE'; payload: { id: string; updates: Partial<Wave> } }
  | { type: 'DELETE_WAVE'; payload: { id: string } }
  | { type: 'TOGGLE_WAVE'; payload: { id: string } }
  | { type: 'ADD_SUBCATEGORY_TO_WAVE'; payload: { waveId: string; ref: WaveSubCategoryRef } }
  | { type: 'REMOVE_SUBCATEGORY_FROM_WAVE'; payload: { waveId: string; subCategoryId: string } };

function reducer(state: ProductivityState, action: Action): ProductivityState {
  switch (action.type) {
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };

    // Goal Category actions
    case 'ADD_GOAL_CATEGORY':
      return {
        ...state,
        goalCategories: [
          ...state.goalCategories,
          { id: generateId(), name: action.payload.name, goals: [], isExpanded: true },
        ],
      };

    case 'UPDATE_GOAL_CATEGORY':
      return {
        ...state,
        goalCategories: state.goalCategories.map((cat) =>
          cat.id === action.payload.id ? { ...cat, name: action.payload.name } : cat
        ),
      };

    case 'DELETE_GOAL_CATEGORY':
      return {
        ...state,
        goalCategories: state.goalCategories.filter((cat) => cat.id !== action.payload.id),
      };

    case 'TOGGLE_GOAL_CATEGORY':
      return {
        ...state,
        goalCategories: state.goalCategories.map((cat) =>
          cat.id === action.payload.id ? { ...cat, isExpanded: !cat.isExpanded } : cat
        ),
      };

    case 'ADD_GOAL_ITEM':
      return {
        ...state,
        goalCategories: state.goalCategories.map((cat) =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                goals: [
                  ...cat.goals,
                  { id: generateId(), ...action.payload.goal, upshots: [] },
                ],
              }
            : cat
        ),
      };

    case 'UPDATE_GOAL_ITEM':
      return {
        ...state,
        goalCategories: state.goalCategories.map((cat) =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                goals: cat.goals.map((goal) =>
                  goal.id === action.payload.goalId
                    ? { ...goal, ...action.payload.updates }
                    : goal
                ),
              }
            : cat
        ),
      };

    case 'DELETE_GOAL_ITEM':
      return {
        ...state,
        goalCategories: state.goalCategories.map((cat) =>
          cat.id === action.payload.categoryId
            ? { ...cat, goals: cat.goals.filter((g) => g.id !== action.payload.goalId) }
            : cat
        ),
      };

    case 'ADD_UPSHOT':
      return {
        ...state,
        goalCategories: state.goalCategories.map((cat) =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                goals: cat.goals.map((goal) =>
                  goal.id === action.payload.goalId
                    ? {
                        ...goal,
                        upshots: [
                          ...goal.upshots,
                          { id: generateId(), content: action.payload.content },
                        ],
                      }
                    : goal
                ),
              }
            : cat
        ),
      };

    case 'UPDATE_UPSHOT':
      return {
        ...state,
        goalCategories: state.goalCategories.map((cat) =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                goals: cat.goals.map((goal) =>
                  goal.id === action.payload.goalId
                    ? {
                        ...goal,
                        upshots: goal.upshots.map((u) =>
                          u.id === action.payload.upshotId
                            ? { ...u, content: action.payload.content }
                            : u
                        ),
                      }
                    : goal
                ),
              }
            : cat
        ),
      };

    case 'DELETE_UPSHOT':
      return {
        ...state,
        goalCategories: state.goalCategories.map((cat) =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                goals: cat.goals.map((goal) =>
                  goal.id === action.payload.goalId
                    ? {
                        ...goal,
                        upshots: goal.upshots.filter((u) => u.id !== action.payload.upshotId),
                      }
                    : goal
                ),
              }
            : cat
        ),
      };

    // Task Category actions
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [
          ...state.categories,
          { id: generateId(), name: action.payload.name, subCategories: [], isExpanded: true },
        ],
      };

    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? { ...cat, name: action.payload.name } : cat
        ),
      };

    case 'DELETE_CATEGORY': {
      const categoryToDelete = state.categories.find((c) => c.id === action.payload.id);
      const subCategoryIds = categoryToDelete?.subCategories.map((s) => s.id) || [];
      
      return {
        ...state,
        categories: state.categories.filter((cat) => cat.id !== action.payload.id),
        waves: state.waves.map((wave) => ({
          ...wave,
          subCategoryRefs: wave.subCategoryRefs.filter(
            (ref) => !subCategoryIds.includes(ref.subCategoryId)
          ),
        })),
      };
    }

    case 'TOGGLE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.id ? { ...cat, isExpanded: !cat.isExpanded } : cat
        ),
      };

    case 'ADD_SUBCATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                subCategories: [
                  ...cat.subCategories,
                  { id: generateId(), ...action.payload.subCategory, isExpanded: false },
                ],
              }
            : cat
        ),
      };

    case 'UPDATE_SUBCATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.map((sub) =>
                  sub.id === action.payload.subCategoryId
                    ? { ...sub, ...action.payload.updates }
                    : sub
                ),
              }
            : cat
        ),
      };

    case 'DELETE_SUBCATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.filter(
                  (s) => s.id !== action.payload.subCategoryId
                ),
              }
            : cat
        ),
        waves: state.waves.map((wave) => ({
          ...wave,
          subCategoryRefs: wave.subCategoryRefs.filter(
            (ref) => ref.subCategoryId !== action.payload.subCategoryId
          ),
        })),
      };

    case 'TOGGLE_SUBCATEGORY':
      return {
        ...state,
        categories: state.categories.map((cat) =>
          cat.id === action.payload.categoryId
            ? {
                ...cat,
                subCategories: cat.subCategories.map((sub) =>
                  sub.id === action.payload.subCategoryId
                    ? { ...sub, isExpanded: !sub.isExpanded }
                    : sub
                ),
              }
            : cat
        ),
      };

    // Wave actions
    case 'ADD_WAVE':
      return {
        ...state,
        waves: [
          ...state.waves,
          { id: generateId(), ...action.payload, subCategoryRefs: [], isExpanded: true },
        ],
      };

    case 'UPDATE_WAVE':
      return {
        ...state,
        waves: state.waves.map((wave) =>
          wave.id === action.payload.id ? { ...wave, ...action.payload.updates } : wave
        ),
      };

    case 'DELETE_WAVE':
      return {
        ...state,
        waves: state.waves.filter((wave) => wave.id !== action.payload.id),
      };

    case 'TOGGLE_WAVE':
      return {
        ...state,
        waves: state.waves.map((wave) =>
          wave.id === action.payload.id ? { ...wave, isExpanded: !wave.isExpanded } : wave
        ),
      };

    case 'ADD_SUBCATEGORY_TO_WAVE':
      return {
        ...state,
        waves: state.waves.map((wave) =>
          wave.id === action.payload.waveId
            ? {
                ...wave,
                subCategoryRefs: [...wave.subCategoryRefs, action.payload.ref],
              }
            : wave
        ),
      };

    case 'REMOVE_SUBCATEGORY_FROM_WAVE':
      return {
        ...state,
        waves: state.waves.map((wave) =>
          wave.id === action.payload.waveId
            ? {
                ...wave,
                subCategoryRefs: wave.subCategoryRefs.filter(
                  (ref) => ref.subCategoryId !== action.payload.subCategoryId
                ),
              }
            : wave
        ),
      };

    default:
      return state;
  }
}

interface ProductivityContextType {
  state: ProductivityState;
  dispatch: React.Dispatch<Action>;
  getSubCategory: (categoryId: string, subCategoryId: string) => SubCategory | undefined;
  getCategory: (categoryId: string) => Category | undefined;
}

const ProductivityContext = createContext<ProductivityContextType | undefined>(undefined);

export function ProductivityProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getSubCategory = (categoryId: string, subCategoryId: string): SubCategory | undefined => {
    const category = state.categories.find((c) => c.id === categoryId);
    return category?.subCategories.find((s) => s.id === subCategoryId);
  };

  const getCategory = (categoryId: string): Category | undefined => {
    return state.categories.find((c) => c.id === categoryId);
  };

  return (
    <ProductivityContext.Provider value={{ state, dispatch, getSubCategory, getCategory }}>
      {children}
    </ProductivityContext.Provider>
  );
}

export function useProductivity() {
  const context = useContext(ProductivityContext);
  if (context === undefined) {
    throw new Error('useProductivity must be used within a ProductivityProvider');
  }
  return context;
}
