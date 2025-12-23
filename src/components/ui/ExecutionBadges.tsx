import { useState, useRef, useEffect } from 'react';
import { TaskStatus, TaskImportance, CarryoverSuggestion } from '@/types/productivity';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatCompletion, normalizeCompletion, getCarryoverLabel } from '@/lib/carryover';

// Status Badge Component
interface StatusBadgeProps {
  status: TaskStatus;
  onChange?: (status: TaskStatus) => void;
  readonly?: boolean;
}

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  'in-progress': {
    label: 'In Progress',
    className: 'bg-status-in-progress-bg text-status-in-progress',
  },
  blocked: {
    label: 'Blocked',
    className: 'bg-status-blocked-bg text-status-blocked',
  },
  'on-hold': {
    label: 'On Hold',
    className: 'bg-status-on-hold-bg text-status-on-hold',
  },
  done: {
    label: 'Done',
    className: 'bg-status-done-bg text-status-done',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-status-cancelled-bg text-status-cancelled',
  },
};

export function StatusBadge({ status, onChange, readonly }: StatusBadgeProps) {
  const config = statusConfig[status];

  if (readonly || !onChange) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
          config.className
        )}
      >
        {config.label}
      </span>
    );
  }

  return (
    <Select value={status} onValueChange={(v) => onChange(v as TaskStatus)}>
      <SelectTrigger
        className={cn(
          'h-6 w-auto min-w-[90px] px-2 py-0 text-xs font-medium border-0 rounded-full',
          config.className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(statusConfig).map(([key, { label, className }]) => (
          <SelectItem key={key} value={key}>
            <span className={cn('px-1.5 py-0.5 rounded text-xs', className)}>
              {label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Importance Badge Component
interface ImportanceBadgeProps {
  importance: TaskImportance;
  onChange?: (importance: TaskImportance) => void;
  readonly?: boolean;
}

const importanceConfig: Record<TaskImportance, { label: string; className: string }> = {
  high: {
    label: 'High',
    className: 'bg-importance-high-bg text-importance-high',
  },
  medium: {
    label: 'Medium',
    className: 'bg-importance-medium-bg text-importance-medium',
  },
  low: {
    label: 'Low',
    className: 'bg-importance-low-bg text-importance-low',
  },
};

export function ImportanceBadge({ importance, onChange, readonly }: ImportanceBadgeProps) {
  const config = importanceConfig[importance];

  if (readonly || !onChange) {
    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
          config.className
        )}
      >
        {config.label}
      </span>
    );
  }

  return (
    <Select value={importance} onValueChange={(v) => onChange(v as TaskImportance)}>
      <SelectTrigger
        className={cn(
          'h-6 w-auto min-w-[70px] px-2 py-0 text-xs font-medium border-0 rounded-full',
          config.className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(importanceConfig).map(([key, { label, className }]) => (
          <SelectItem key={key} value={key}>
            <span className={cn('px-1.5 py-0.5 rounded text-xs', className)}>
              {label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Completion Input Component
interface CompletionInputProps {
  value: number; // 0.0 to 1.0
  onChange?: (value: number) => void;
  readonly?: boolean;
}

export function CompletionInput({ value, onChange, readonly }: CompletionInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(formatCompletion(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setInputValue(formatCompletion(value));
    }
  }, [value, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    if (onChange) {
      const normalized = normalizeCompletion(inputValue);
      onChange(normalized);
      setInputValue(formatCompletion(normalized));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue(formatCompletion(value));
    }
  };

  // Progress bar color based on completion
  const getProgressColor = () => {
    if (value >= 1) return 'bg-status-done';
    if (value >= 0.6) return 'bg-status-in-progress';
    if (value >= 0.2) return 'bg-status-on-hold';
    return 'bg-muted-foreground/40';
  };

  if (readonly) {
    return (
      <div className="flex items-center gap-2 min-w-[80px]">
        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all', getProgressColor())}
            style={{ width: `${value * 100}%` }}
          />
        </div>
        <span className="text-xs text-muted-foreground w-8">{formatCompletion(value)}</span>
      </div>
    );
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="w-14 h-6 px-1.5 text-xs text-center bg-secondary border border-border rounded focus:outline-none focus:ring-1 focus:ring-ring"
        placeholder="0%"
      />
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="flex items-center gap-2 min-w-[80px] group cursor-pointer"
    >
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all', getProgressColor())}
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors w-8">
        {formatCompletion(value)}
      </span>
    </button>
  );
}

// Carryover Badge Component
interface CarryoverBadgeProps {
  suggestion: CarryoverSuggestion;
}

const carryoverConfig: Record<CarryoverSuggestion, { className: string }> = {
  'yes-blocked': {
    className: 'bg-carryover-yes-bg text-carryover-yes border border-carryover-yes/20',
  },
  no: {
    className: 'bg-carryover-no-bg text-carryover-no border border-carryover-no/20',
  },
  split: {
    className: 'bg-carryover-split-bg text-carryover-split border border-carryover-split/20',
  },
  'yes-priority': {
    className: 'bg-carryover-yes-bg text-carryover-yes border border-carryover-yes/20',
  },
  'yes-deprioritized': {
    className: 'bg-muted text-muted-foreground border border-border',
  },
};

export function CarryoverBadge({ suggestion }: CarryoverBadgeProps) {
  const config = carryoverConfig[suggestion];
  const label = getCarryoverLabel(suggestion);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        config.className
      )}
      title="Suggested carryover to next wave"
    >
      {label}
    </span>
  );
}
