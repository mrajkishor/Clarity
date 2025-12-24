import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Goal } from '@/types/productivity';
import { useProductivity } from '@/store/productivityStore';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';

interface GoalCardProps {
  goal: Goal;
}

export function GoalCard({ goal }: GoalCardProps) {
  const { dispatch } = useProductivity();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    dispatch({ type: 'DELETE_GOAL', payload: { id: goal.id } });
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="group bg-card border border-border rounded-lg p-3 sm:p-4 animate-fade-in">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <div className="flex-1 min-w-0">
            <RichTextEditor
              value={goal.content}
              onChange={(content) =>
                dispatch({
                  type: 'UPDATE_GOAL',
                  payload: { id: goal.id, content },
                })
              }
              placeholder="Write your goal here... Use headings, lists, and formatting to express your vision."
              minHeight="100px"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-7 sm:w-7 flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive touch-manipulation"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Goal"
        description="Are you sure? This action cannot be undone."
      />
    </>
  );
}
