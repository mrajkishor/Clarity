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
      {/* Header section */}
      <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl sm:text-2xl font-serif font-medium leading-tight">Long-Term Goals</h2>
          <p className="text-muted-foreground text-sm sm:text-sm mt-1">
            Define your vision and direction
          </p>
        </div>
        <Button 
          onClick={handleAddGoal} 
          variant="outline" 
          size="sm" 
          className="h-10 sm:h-8 px-4 touch-manipulation shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          <span>Add Goal</span>
        </Button>
      </div>

      {/* Goals list */}
      <div className="space-y-4">
        {state.goals.length === 0 ? (
          <div className="text-center py-12 sm:py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed border-border">
            <p className="mb-4 text-base">No goals yet</p>
            <Button onClick={handleAddGoal} variant="secondary" className="h-11 touch-manipulation">
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
