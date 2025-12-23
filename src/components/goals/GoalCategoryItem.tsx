import { Plus, Trash2 } from 'lucide-react';
import { GoalCategory } from '@/types/productivity';
import { useProductivity } from '@/store/productivityStore';
import { TreeNode } from '@/components/ui/TreeNode';
import { EditableText } from '@/components/ui/EditableText';
import { GoalItemCard } from './GoalItemCard';
import { Button } from '@/components/ui/button';

interface GoalCategoryItemProps {
  category: GoalCategory;
}

export function GoalCategoryItem({ category }: GoalCategoryItemProps) {
  const { dispatch } = useProductivity();

  const handleAddGoal = () => {
    dispatch({
      type: 'ADD_GOAL_ITEM',
      payload: {
        categoryId: category.id,
        goal: { title: '', description: '' },
      },
    });
  };

  return (
    <TreeNode
      level={0}
      isExpanded={category.isExpanded}
      hasChildren={category.goals.length > 0}
      onToggle={() =>
        dispatch({ type: 'TOGGLE_GOAL_CATEGORY', payload: { id: category.id } })
      }
      header={
        <h3 className="text-lg font-serif font-medium">
          <EditableText
            value={category.name}
            onChange={(name) =>
              dispatch({
                type: 'UPDATE_GOAL_CATEGORY',
                payload: { id: category.id, name },
              })
            }
            placeholder="Category name..."
          />
        </h3>
      }
      actions={
        <>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleAddGoal}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() =>
              dispatch({ type: 'DELETE_GOAL_CATEGORY', payload: { id: category.id } })
            }
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </>
      }
    >
      <div className="space-y-3 mt-2 ml-8">
        {category.goals.map((goal, index) => (
          <GoalItemCard
            key={goal.id}
            goal={goal}
            categoryId={category.id}
            autoFocus={index === category.goals.length - 1 && !goal.title}
          />
        ))}
      </div>
    </TreeNode>
  );
}
