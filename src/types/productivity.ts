// Core data models for the productivity system

// ============================================
// LONG-TERM GOALS (Simplified - No Categories)
// ============================================
export interface Goal {
  id: string;
  content: string; // Rich text HTML content
}

// Legacy type kept for migration
export interface Upshot {
  id: string;
  content: string;
}

// Legacy type kept for migration
export interface GoalItem {
  id: string;
  title: string;
  description: string;
  upshots: Upshot[];
}

// Legacy type kept for migration
export interface GoalCategory {
  id: string;
  name: string;
  goals: GoalItem[];
  isExpanded: boolean;
}

// ============================================
// TASK MANAGER TYPES
// ============================================
// TagColor now supports any hex color string, with legacy named colors for backward compatibility
export type TagColor = string;

// Execution tracking types
export type TaskStatus = 
  | 'in-progress' 
  | 'blocked' 
  | 'on-hold' 
  | 'done' 
  | 'cancelled';

export type TaskImportance = 'high' | 'medium' | 'low';

export type CarryoverSuggestion = 
  | 'yes-blocked' 
  | 'no' 
  | 'split' 
  | 'yes-priority' 
  | 'yes-deprioritized';

export interface SubCategory {
  id: string;
  title: string; // Rich text HTML content
  comments: string; // Rich text HTML content
  isExpanded: boolean;
  // Execution tracking fields
  status: TaskStatus;
  completion: number; // 0.0 to 1.0
  importance: TaskImportance;
  // Highlighting (visual emphasis, not color override)
  isHighlighted: boolean;
}

export interface Category {
  id: string;
  name: string; // Rich text HTML content
  color: TagColor; // Color is ONLY at category level
  subCategories: SubCategory[];
  isExpanded: boolean;
}

// ============================================
// ROLLING WAVES TYPES
// ============================================
export type WaveStatus = 'planned' | 'in-progress' | 'completed';
export type WaveDataMode = 'reference' | 'snapshot';

// Snapshot of a sub-category (frozen copy for completed/planned waves)
export interface SubCategorySnapshot {
  id: string;
  title: string;
  comments: string;
  status: TaskStatus;
  completion: number;
  importance: TaskImportance;
  isHighlighted: boolean;
  // Parent category info at time of snapshot
  categoryId: string;
  categoryName: string;
  categoryColor: TagColor;
}

// Reference to a live sub-category (for in-progress waves only)
export interface WaveSubCategoryRef {
  subCategoryId: string;
  categoryId: string;
}

export interface Wave {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string (replaces durationDays)
  majorGoals: string; // Rich text
  retrospective: string; // Rich text
  isExpanded: boolean;
  // Data mode determines how sub-categories are stored
  dataMode: WaveDataMode;
  // Only one of these should be populated based on dataMode
  subCategoryRefs: WaveSubCategoryRef[]; // Used when dataMode === 'reference'
  subCategorySnapshots: SubCategorySnapshot[]; // Used when dataMode === 'snapshot'
}

// ============================================
// STATE TYPES
// ============================================
export interface ProductivityState {
  // Flat list of goals (no categories)
  goals: Goal[];
  // Task categories with sub-categories
  categories: Category[];
  // Rolling waves
  waves: Wave[];
  // Notepad content (rich text)
  notes: string;
  // Active tab
  activeTab: 'goals' | 'tasks' | 'waves' | 'notes' | 'analytics';
  // Legacy: kept for migration
  goalCategories?: GoalCategory[];
}
