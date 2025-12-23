import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeNodeProps {
  children: ReactNode;
  isExpanded?: boolean;
  onToggle?: () => void;
  hasChildren?: boolean;
  level?: number;
  className?: string;
  headerClassName?: string;
  header: ReactNode;
  actions?: ReactNode;
}

export function TreeNode({
  children,
  isExpanded = false,
  onToggle,
  hasChildren = false,
  level = 0,
  className,
  headerClassName,
  header,
  actions,
}: TreeNodeProps) {
  const indent = level * 24;

  return (
    <div className={cn('relative', className)}>
      {/* Tree connector line */}
      {level > 0 && (
        <div
          className="absolute top-0 bottom-0 w-px bg-tree-line"
          style={{ left: indent - 12 }}
        />
      )}

      {/* Node header */}
      <div
        className={cn(
          'group flex items-center gap-2 py-2 px-3 rounded-lg transition-colors',
          'hover:bg-secondary/60',
          headerClassName
        )}
        style={{ paddingLeft: indent + 12 }}
      >
        {/* Horizontal connector */}
        {level > 0 && (
          <div
            className="absolute h-px bg-tree-line"
            style={{
              left: indent - 12,
              width: 12,
              top: '50%',
            }}
          />
        )}

        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <button
            onClick={onToggle}
            className={cn(
              'flex items-center justify-center w-5 h-5 rounded transition-all',
              'hover:bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <ChevronRight
              className={cn(
                'w-4 h-4 transition-transform duration-200',
                isExpanded && 'rotate-90'
              )}
            />
          </button>
        ) : (
          <div className="w-5 h-5" />
        )}

        {/* Header content */}
        <div className="flex-1 min-w-0">{header}</div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {actions}
          </div>
        )}
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="animate-fade-in">{children}</div>
      )}
    </div>
  );
}
