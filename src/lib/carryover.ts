import { CarryoverSuggestion, TaskStatus, TaskImportance } from '@/types/productivity';

interface CarryoverInput {
  status: TaskStatus;
  completion: number;
  importance: TaskImportance;
}

/**
 * Computes the carryover suggestion for a sub-category based on:
 * 1. Status (blocked tasks always carry over)
 * 2. Completion percentage
 * 3. Importance level
 * 
 * Decision rules (applied in order):
 * - If status is 'blocked' → 'yes-blocked'
 * - Else if completion ≥ 100% → 'no'
 * - Else if completion ≥ 20% → 'split' (partial work done, split into next wave)
 * - Else if importance is 'high' → 'yes-priority'
 * - Else → 'yes-deprioritized'
 */
export function computeCarryoverSuggestion(input: CarryoverInput): CarryoverSuggestion {
  const { status, completion, importance } = input;

  // Rule 1: Blocked tasks always carry over
  if (status === 'blocked') {
    return 'yes-blocked';
  }

  // Rule 2: Completed tasks don't carry over
  if (completion >= 1.0) {
    return 'no';
  }

  // Rule 3: Partial progress suggests splitting
  if (completion >= 0.2) {
    return 'split';
  }

  // Rule 4: High importance gets priority
  if (importance === 'high') {
    return 'yes-priority';
  }

  // Rule 5: Everything else is deprioritized
  return 'yes-deprioritized';
}

/**
 * Normalizes various completion input formats to a 0.0-1.0 range
 * Accepts: 0-100, 0-1, "20%", "75%", etc.
 */
export function normalizeCompletion(value: string | number): number {
  if (typeof value === 'number') {
    // If > 1, assume it's a percentage (0-100)
    return value > 1 ? Math.min(value / 100, 1) : Math.max(0, Math.min(value, 1));
  }

  // Handle string input
  const trimmed = value.trim();
  
  // Remove % sign if present
  const numericStr = trimmed.replace('%', '').trim();
  const num = parseFloat(numericStr);

  if (isNaN(num)) {
    return 0;
  }

  // If original had % or value > 1, treat as percentage
  if (trimmed.includes('%') || num > 1) {
    return Math.min(num / 100, 1);
  }

  return Math.max(0, Math.min(num, 1));
}

/**
 * Formats completion as a percentage string for display
 */
export function formatCompletion(completion: number): string {
  return `${Math.round(completion * 100)}%`;
}

/**
 * Get display label for carryover suggestion
 */
export function getCarryoverLabel(suggestion: CarryoverSuggestion): string {
  switch (suggestion) {
    case 'yes-blocked':
      return 'Yes – Blocked';
    case 'no':
      return 'No';
    case 'split':
      return 'Split';
    case 'yes-priority':
      return 'Yes – Priority';
    case 'yes-deprioritized':
      return 'Yes – Deprioritized';
  }
}
