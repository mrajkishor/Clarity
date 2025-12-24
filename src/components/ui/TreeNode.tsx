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
  // Reduce indent on mobile
  const baseIndent = 24;
  const mobileIndent = 16;
  const indent = level * baseIndent;
  const mobileIndentValue = level * mobileIndent;

  return (
    <div className={cn('relative', className)}>
      {/* Tree connector line */}
      {level > 0 && (
        <>
          {/* Desktop connector */}
          <div
            className="absolute top-0 bottom-0 w-px bg-tree-line hidden sm:block"
            style={{ left: indent - 12 }}
          />
          {/* Mobile connector */}
          <div
            className="absolute top-0 bottom-0 w-px bg-tree-line sm:hidden"
            style={{ left: mobileIndentValue - 8 }}
          />
        </>
      )}

      {/* Node header */}
      <div
        className={cn(
          'group flex items-center gap-1.5 sm:gap-2 py-2 px-2 sm:px-3 rounded-lg transition-colors',
          'hover:bg-secondary/60 active:bg-secondary/80',
          headerClassName
        )}
        style={{ 
          paddingLeft: `max(${mobileIndentValue + 8}px, calc(${indent + 12}px * var(--desktop-scale, 0) + ${mobileIndentValue + 8}px * var(--mobile-scale, 1)))` 
        }}
      >
        {/* Horizontal connector */}
        {level > 0 && (
          <>
            {/* Desktop horizontal line */}
            <div
              className="absolute h-px bg-tree-line hidden sm:block"
              style={{
                left: indent - 12,
                width: 12,
                top: '50%',
              }}
            />
            {/* Mobile horizontal line */}
            <div
              className="absolute h-px bg-tree-line sm:hidden"
              style={{
                left: mobileIndentValue - 8,
                width: 8,
                top: '50%',
              }}
            />
          </>
        )}

        {/* Expand/collapse toggle */}
        {hasChildren ? (
          <button
            onClick={onToggle}
            className={cn(
              'flex items-center justify-center w-6 h-6 sm:w-5 sm:h-5 rounded transition-all touch-manipulation',
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
          <div className="w-6 h-6 sm:w-5 sm:h-5" />
        )}

        {/* Header content */}
        <div className="flex-1 min-w-0">{header}</div>

        {/* Actions - always visible on mobile for touch */}
        {actions && (
          <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
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
