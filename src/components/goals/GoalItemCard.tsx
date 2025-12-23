import { Plus, Trash2, Sparkles } from 'lucide-react';
import { GoalItem } from '@/types/productivity';
import { useProductivity } from '@/store/productivityStore';
import { EditableText } from '@/components/ui/EditableText';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface GoalItemCardProps {
  goal: GoalItem;
  categoryId: string;
  autoFocus?: boolean;
}

export function GoalItemCard({ goal, categoryId, autoFocus }: GoalItemCardProps) {
  const { dispatch } = useProductivity();

  const handleAddUpshot = () => {
    dispatch({
      type: 'ADD_UPSHOT',
      payload: { categoryId, goalId: goal.id, content: '' },
    });
  };

  return (
    <div className="group bg-card border border-border rounded-lg p-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <h4 className="font-sans font-medium text-foreground">
            <EditableText
              value={goal.title}
              onChange={(title) =>
                dispatch({
                  type: 'UPDATE_GOAL_ITEM',
                  payload: { categoryId, goalId: goal.id, updates: { title } },
                })
              }
              placeholder="Goal title..."
              autoFocus={autoFocus}
            />
          </h4>
          <div className="text-sm mt-2">
            <RichTextEditor
              value={goal.description}
              onChange={(description) =>
                dispatch({
                  type: 'UPDATE_GOAL_ITEM',
                  payload: { categoryId, goalId: goal.id, updates: { description } },
                })
              }
              placeholder="Add a description..."
              minHeight="60px"
            />
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onClick={() =>
            dispatch({
              type: 'DELETE_GOAL_ITEM',
              payload: { categoryId, goalId: goal.id },
            })
          }
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Upshots */}
      {(goal.upshots.length > 0 || true) && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-accent-foreground" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Expected Upshots
            </span>
          </div>
          <div className="space-y-1.5">
            {goal.upshots.map((upshot) => (
              <div
                key={upshot.id}
                className="group/upshot flex items-start gap-2 text-sm"
              >
                <span className="text-accent-foreground mt-1.5">•</span>
                <span className="flex-1">
                  <EditableText
                    value={upshot.content}
                    onChange={(content) =>
                      dispatch({
                        type: 'UPDATE_UPSHOT',
                        payload: {
                          categoryId,
                          goalId: goal.id,
                          upshotId: upshot.id,
                          content,
                        },
                      })
                    }
                    placeholder="Describe the expected outcome..."
                  />
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover/upshot:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    dispatch({
                      type: 'DELETE_UPSHOT',
                      payload: { categoryId, goalId: goal.id, upshotId: upshot.id },
                    })
                  }
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
            <button
              onClick={handleAddUpshot}
              className={cn(
                'flex items-center gap-1.5 text-sm text-muted-foreground',
                'hover:text-foreground transition-colors mt-1'
              )}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add upshot</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
