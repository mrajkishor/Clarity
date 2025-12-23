import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import { useProductivity } from '@/store/productivityStore';
import { ColorDot } from '@/components/ui/ColorPicker';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface SubCategorySelectorProps {
  waveId: string;
  existingRefs: string[];
}

export function SubCategorySelector({
  waveId,
  existingRefs,
}: SubCategorySelectorProps) {
  const { state, dispatch } = useProductivity();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (categoryId: string, subCategoryId: string) => {
    if (existingRefs.includes(subCategoryId)) {
      dispatch({
        type: 'REMOVE_SUBCATEGORY_FROM_WAVE',
        payload: { waveId, subCategoryId },
      });
    } else {
      dispatch({
        type: 'ADD_SUBCATEGORY_TO_WAVE',
        payload: { waveId, ref: { categoryId, subCategoryId } },
      });
    }
  };

  // Strip HTML for display
  const getPlainText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const allSubCategories = state.categories.flatMap((cat) =>
    cat.subCategories.map((sub) => ({
      ...sub,
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
    }))
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Add Tasks
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-3 border-b border-border">
          <h4 className="font-medium text-sm">Select tasks for this wave</h4>
          <p className="text-xs text-muted-foreground mt-1">
            Tasks from Task Manager
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto scrollbar-thin">
          {allSubCategories.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No tasks available. Create tasks in Task Manager first.
            </div>
          ) : (
            <div className="p-2">
              {state.categories.map((category) => (
                <div key={category.id} className="mb-3 last:mb-0">
                  <div className="text-xs font-medium text-muted-foreground px-2 mb-1 flex items-center gap-2">
                    <ColorDot color={category.color} />
                    {getPlainText(category.name)}
                  </div>
                  {category.subCategories.map((sub) => {
                    const isSelected = existingRefs.includes(sub.id);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => handleSelect(category.id, sub.id)}
                        className={cn(
                          'w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left text-sm transition-colors',
                          isSelected
                            ? 'bg-accent text-accent-foreground'
                            : 'hover:bg-secondary'
                        )}
                      >
                        <ColorDot color={category.color} />
                        <span className="flex-1 truncate">{getPlainText(sub.title)}</span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-accent-foreground" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
