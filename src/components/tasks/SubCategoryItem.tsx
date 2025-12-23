import { useState } from 'react';
import { Trash2, Sparkles } from 'lucide-react';
import { SubCategory, TagColor } from '@/types/productivity';
import { useProductivity } from '@/store/productivityStore';
import { TreeNode } from '@/components/ui/TreeNode';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { ColorDot } from '@/components/ui/ColorPicker';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import {
  StatusBadge,
  ImportanceBadge,
  CompletionInput,
} from '@/components/ui/ExecutionBadges';
import { cn } from '@/lib/utils';

interface SubCategoryItemProps {
  subCategory: SubCategory;
  categoryId: string;
  categoryColor: TagColor;
  autoFocus?: boolean;
}

export function SubCategoryItem({
  subCategory,
  categoryId,
  categoryColor,
  autoFocus,
}: SubCategoryItemProps) {
  const { dispatch } = useProductivity();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateField = (updates: Partial<SubCategory>) => {
    dispatch({
      type: 'UPDATE_SUBCATEGORY',
      payload: {
        categoryId,
        subCategoryId: subCategory.id,
        updates,
      },
    });
  };

  const handleDelete = () => {
    dispatch({
      type: 'DELETE_SUBCATEGORY',
      payload: { categoryId, subCategoryId: subCategory.id },
    });
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <TreeNode
        level={1}
        isExpanded={subCategory.isExpanded}
        hasChildren={true}
        onToggle={() =>
          dispatch({
            type: 'TOGGLE_SUBCATEGORY',
            payload: { categoryId, subCategoryId: subCategory.id },
          })
        }
        className={cn(
          subCategory.isHighlighted && 'ring-2 ring-accent ring-offset-2 ring-offset-background rounded-lg'
        )}
        header={
          <div className="flex items-center gap-2 flex-wrap flex-1">
            <ColorDot color={categoryColor} />
            <div className="flex-1 min-w-0">
              <RichTextEditor
                value={subCategory.title}
                onChange={(title) => handleUpdateField({ title })}
                placeholder="Sub-category title..."
                minHeight="28px"
                minimal
              />
            </div>
            {/* Compact execution badges in header */}
            <div className="flex items-center gap-2 ml-2">
              <StatusBadge status={subCategory.status} readonly />
              <span className="text-xs text-muted-foreground">
                {Math.round(subCategory.completion * 100)}%
              </span>
              {subCategory.isHighlighted && (
                <Sparkles className="w-3.5 h-3.5 text-accent" />
              )}
            </div>
          </div>
        }
        actions={
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        }
      >
        <div className="ml-12 mt-2 space-y-3 animate-fade-in">
          {/* Execution fields row */}
          <div className="flex flex-wrap items-center gap-4 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Status:</span>
              <StatusBadge
                status={subCategory.status}
                onChange={(status) => handleUpdateField({ status })}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Progress:</span>
              <CompletionInput
                value={subCategory.completion}
                onChange={(completion) => handleUpdateField({ completion })}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Priority:</span>
              <ImportanceBadge
                importance={subCategory.importance}
                onChange={(importance) => handleUpdateField({ importance })}
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Highlight:</span>
              <Button
                variant={subCategory.isHighlighted ? 'secondary' : 'ghost'}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => handleUpdateField({ isHighlighted: !subCategory.isHighlighted })}
              >
                <Sparkles className={cn(
                  'w-3 h-3 mr-1',
                  subCategory.isHighlighted && 'text-accent'
                )} />
                {subCategory.isHighlighted ? 'On' : 'Off'}
              </Button>
            </div>
          </div>

          {/* Comments section */}
          <div className="bg-secondary/30 rounded-lg p-3">
            <label className="text-xs text-muted-foreground block mb-2">
              Notes & Comments
            </label>
            <RichTextEditor
              value={subCategory.comments}
              onChange={(comments) => handleUpdateField({ comments })}
              placeholder="Add notes, context, or details..."
              minHeight="80px"
            />
          </div>
        </div>
      </TreeNode>

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Sub-Category"
        description="Are you sure? This action cannot be undone."
      />
    </>
  );
}
