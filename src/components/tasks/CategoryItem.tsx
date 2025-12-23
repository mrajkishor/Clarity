import { useState } from 'react';
import { Plus, Trash2, FolderOpen } from 'lucide-react';
import { Category } from '@/types/productivity';
import { useProductivity } from '@/store/productivityStore';
import { TreeNode } from '@/components/ui/TreeNode';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { ColorPicker, normalizeColor } from '@/components/ui/ColorPicker';
import { SubCategoryItem } from './SubCategoryItem';
import { Button } from '@/components/ui/button';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';

interface CategoryItemProps {
  category: Category;
}

export function CategoryItem({ category }: CategoryItemProps) {
  const { dispatch } = useProductivity();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleAddSubCategory = () => {
    dispatch({
      type: 'ADD_SUBCATEGORY',
      payload: {
        categoryId: category.id,
        subCategory: { 
          title: '', 
          comments: '', 
          status: 'in-progress',
          completion: 0,
          importance: 'medium',
          isHighlighted: false,
        },
      },
    });
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_CATEGORY', payload: { id: category.id } });
    setShowDeleteConfirm(false);
  };

  // Strip HTML tags to get plain text for display
  const getPlainText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <>
      <TreeNode
        level={0}
        isExpanded={category.isExpanded}
        hasChildren={category.subCategories.length > 0}
        onToggle={() =>
          dispatch({ type: 'TOGGLE_CATEGORY', payload: { id: category.id } })
        }
        header={
          <div className="flex items-center gap-2 flex-1">
            <FolderOpen 
              className="w-4 h-4 flex-shrink-0" 
              style={{ 
                color: normalizeColor(category.color)
              }} 
            />
            <div className="flex-1 min-w-0">
              <RichTextEditor
                value={category.name}
                onChange={(name) =>
                  dispatch({
                    type: 'UPDATE_CATEGORY',
                    payload: { id: category.id, updates: { name } },
                  })
                }
                placeholder="Category name..."
                minHeight="32px"
                minimal
              />
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full flex-shrink-0">
              {category.subCategories.length}
            </span>
          </div>
        }
        actions={
          <>
            <div className="flex items-center gap-1 mr-2">
              <ColorPicker
                value={category.color}
                onChange={(color) =>
                  dispatch({
                    type: 'UPDATE_CATEGORY',
                    payload: { id: category.id, updates: { color } },
                  })
                }
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleAddSubCategory}
            >
              <Plus className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        }
      >
        <div className="mt-1">
          {category.subCategories.map((sub, index) => (
            <SubCategoryItem
              key={sub.id}
              subCategory={sub}
              categoryId={category.id}
              categoryColor={category.color}
              autoFocus={
                index === category.subCategories.length - 1 && !sub.title
              }
            />
          ))}
        </div>
      </TreeNode>

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure? This will delete all sub-categories within. This action cannot be undone."
      />
    </>
  );
}
