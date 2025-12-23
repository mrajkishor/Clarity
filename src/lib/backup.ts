import { ProductivityState } from '@/types/productivity';
import { useProductivityStore, STORE_VERSION } from '@/store/productivityStore';

// Backup file structure
export interface BackupFile {
  version: number;
  timestamp: string;
  data: ProductivityState;
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Normalizes backup data to handle legacy formats and missing fields
 */
function normalizeBackupData(data: Record<string, unknown>): Record<string, unknown> {
  const normalized = { ...data };

  // Normalize goalCategories - handle null, undefined, object, or missing
  if (normalized.goalCategories === null || normalized.goalCategories === undefined) {
    normalized.goalCategories = [];
  } else if (typeof normalized.goalCategories === 'object' && !Array.isArray(normalized.goalCategories)) {
    // If it's an object (not array), wrap it in an array
    normalized.goalCategories = [normalized.goalCategories];
  }

  // Normalize goals - handle null, undefined, or missing
  if (normalized.goals === null || normalized.goals === undefined) {
    normalized.goals = [];
  } else if (!Array.isArray(normalized.goals)) {
    normalized.goals = [];
  }

  // Normalize categories - handle null, undefined, or missing
  if (normalized.categories === null || normalized.categories === undefined) {
    normalized.categories = [];
  } else if (!Array.isArray(normalized.categories)) {
    normalized.categories = [];
  }

  // Normalize waves - handle null, undefined, or missing
  if (normalized.waves === null || normalized.waves === undefined) {
    normalized.waves = [];
  } else if (!Array.isArray(normalized.waves)) {
    normalized.waves = [];
  }

  // Default activeTab if missing
  if (!normalized.activeTab || !['goals', 'tasks', 'waves'].includes(normalized.activeTab as string)) {
    normalized.activeTab = 'goals';
  }

  return normalized;
}

/**
 * Validates the structure of a backup file
 */
export function validateBackup(backup: unknown): ValidationResult {
  if (!backup || typeof backup !== 'object') {
    return { valid: false, error: 'Invalid backup file format' };
  }

  const file = backup as BackupFile;

  // Check version
  if (typeof file.version !== 'number') {
    return { valid: false, error: 'Missing or invalid version number' };
  }

  if (file.version > STORE_VERSION) {
    return { 
      valid: false, 
      error: `Backup version ${file.version} is newer than app version ${STORE_VERSION}` 
    };
  }

  // Check timestamp
  if (typeof file.timestamp !== 'string') {
    return { valid: false, error: 'Missing or invalid timestamp' };
  }

  // Check data structure exists
  if (!file.data || typeof file.data !== 'object') {
    return { valid: false, error: 'Missing or invalid data' };
  }

  // Normalize the data before validation
  const normalizedData = normalizeBackupData(file.data as unknown as Record<string, unknown>);
  
  // Update the file data with normalized version
  file.data = normalizedData as unknown as ProductivityState;

  // Validate arrays exist (after normalization, they should all be arrays)
  if (!Array.isArray(normalizedData.goalCategories)) {
    return { valid: false, error: 'goalCategories must be an array' };
  }

  if (!Array.isArray(normalizedData.categories)) {
    return { valid: false, error: 'categories must be an array' };
  }

  if (!Array.isArray(normalizedData.waves)) {
    return { valid: false, error: 'waves must be an array' };
  }

  if (!Array.isArray(normalizedData.goals)) {
    return { valid: false, error: 'goals must be an array' };
  }

  return { valid: true };
}

/**
 * Exports the current state as a downloadable JSON file
 */
export function exportBackup(): void {
  const store = useProductivityStore.getState();
  const snapshot = store.getSnapshot();

  const backup: BackupFile = {
    version: STORE_VERSION,
    timestamp: new Date().toISOString(),
    data: snapshot,
  };

  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  // Format date for filename
  const date = new Date().toISOString().split('T')[0];
  const filename = `rolling-waves-backup-${date}.json`;

  // Create download link and trigger
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup
  URL.revokeObjectURL(url);
}

/**
 * Reads and parses a backup file
 */
export function readBackupFile(file: File): Promise<BackupFile> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        resolve(parsed);
      } catch (error) {
        reject(new Error('Failed to parse backup file'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read backup file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Imports a backup file and replaces current state
 * Returns success/error message
 */
export async function importBackup(file: File): Promise<{ success: boolean; message: string }> {
  try {
    // Read and parse file
    const backup = await readBackupFile(file);

    // Validate structure
    const validation = validateBackup(backup);
    if (!validation.valid) {
      return { success: false, message: validation.error || 'Invalid backup' };
    }

    // Restore state
    const store = useProductivityStore.getState();
    store.restoreFromBackup(backup.data);

    const date = new Date(backup.timestamp).toLocaleDateString();
    return { 
      success: true, 
      message: `Restored backup from ${date}` 
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to import backup';
    return { success: false, message };
  }
}

/**
 * Gets backup file info without importing
 */
export async function getBackupInfo(file: File): Promise<{ 
  valid: boolean; 
  version?: number; 
  timestamp?: string; 
  error?: string 
}> {
  try {
    const backup = await readBackupFile(file);
    const validation = validateBackup(backup);

    if (!validation.valid) {
      return { valid: false, error: validation.error };
    }

    return {
      valid: true,
      version: backup.version,
      timestamp: backup.timestamp,
    };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Failed to read file' 
    };
  }
}
