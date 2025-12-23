import { Plus } from 'lucide-react';
import { useProductivity } from '@/store/productivityStore';
import { GoalCard } from './GoalCard';
import { Button } from '@/components/ui/button';

export function LongTermGoals() {
  const { state, dispatch } = useProductivity();

  const handleAddGoal = () => {
    dispatch({ type: 'ADD_GOAL', payload: { content: '' } });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-medium">Long-Term Goals</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Define your vision and direction
          </p>
        </div>
        <Button onClick={handleAddGoal} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-4">
        {state.goals.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No goals yet</p>
            <Button onClick={handleAddGoal} variant="secondary">
              <Plus className="w-4 h-4 mr-2" />
              Create your first goal
            </Button>
          </div>
        ) : (
          state.goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} />
          ))
        )}
      </div>
    </div>
  );
}
