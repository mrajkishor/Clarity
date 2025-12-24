import { Plus } from 'lucide-react';
import { useProductivity } from '@/store/productivityStore';
import { CategoryItem } from './CategoryItem';
import { Button } from '@/components/ui/button';

export function TaskManager() {
  const { state, dispatch } = useProductivity();

  const handleAddCategory = () => {
    dispatch({
      type: 'ADD_CATEGORY',
      payload: { name: '' },
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium">Task Manager</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">
            Your single source of truth for all tasks
          </p>
        </div>
        <Button onClick={handleAddCategory} variant="outline" size="sm" className="self-start sm:self-auto h-9 sm:h-8 touch-manipulation">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="space-y-2">
        {state.categories.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <p className="mb-4 text-sm sm:text-base">No categories yet</p>
            <Button onClick={handleAddCategory} variant="secondary" className="h-10 touch-manipulation">
              <Plus className="w-4 h-4 mr-2" />
              Create your first category
            </Button>
          </div>
        ) : (
          state.categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))
        )}
      </div>
    </div>
  );
}
