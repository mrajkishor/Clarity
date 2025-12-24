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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium">Long-Term Goals</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">
            Define your vision and direction
          </p>
        </div>
        <Button onClick={handleAddGoal} variant="outline" size="sm" className="self-start sm:self-auto h-9 sm:h-8 touch-manipulation">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {state.goals.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <p className="mb-4 text-sm sm:text-base">No goals yet</p>
            <Button onClick={handleAddGoal} variant="secondary" className="h-10 touch-manipulation">
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
