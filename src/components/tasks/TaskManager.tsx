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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-serif font-medium">Task Manager</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Your single source of truth for all tasks
          </p>
        </div>
        <Button onClick={handleAddCategory} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="space-y-2">
        {state.categories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="mb-4">No categories yet</p>
            <Button onClick={handleAddCategory} variant="secondary">
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
