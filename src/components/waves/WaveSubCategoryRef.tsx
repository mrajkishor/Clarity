import { X } from 'lucide-react';
import { WaveSubCategoryRef as WaveSubCategoryRefType } from '@/types/productivity';
import { useProductivity } from '@/store/productivityStore';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { ColorDot } from '@/components/ui/ColorPicker';
import { Button } from '@/components/ui/button';
import {
  StatusBadge,
  ImportanceBadge,
  CompletionInput,
  CarryoverBadge,
} from '@/components/ui/ExecutionBadges';
import { computeCarryoverSuggestion } from '@/lib/carryover';

interface WaveSubCategoryRefProps {
  waveId: string;
  reference: WaveSubCategoryRefType;
}

export function WaveSubCategoryRef({ waveId, reference }: WaveSubCategoryRefProps) {
  const { dispatch, getSubCategory, getCategory } = useProductivity();

  const subCategory = getSubCategory(reference.categoryId, reference.subCategoryId);
  const category = getCategory(reference.categoryId);

  if (!subCategory || !category) {
    return null;
  }

  const carryoverSuggestion = computeCarryoverSuggestion(subCategory);

  // Strip HTML for display
  const getPlainText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  const handleUpdateComments = (comments: string) => {
    dispatch({
      type: 'UPDATE_SUBCATEGORY',
      payload: {
        categoryId: reference.categoryId,
        subCategoryId: reference.subCategoryId,
        updates: { comments },
      },
    });
  };

  const handleRemove = () => {
    dispatch({
      type: 'REMOVE_SUBCATEGORY_FROM_WAVE',
      payload: { waveId, subCategoryId: reference.subCategoryId },
    });
  };

  const handleUpdateField = (updates: Partial<typeof subCategory>) => {
    dispatch({
      type: 'UPDATE_SUBCATEGORY',
      payload: {
        categoryId: reference.categoryId,
        subCategoryId: reference.subCategoryId,
        updates,
      },
    });
  };

  return (
    <div className="group bg-card border border-border rounded-lg p-4 animate-fade-in">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <ColorDot color={category.color} />
            <span className="text-xs text-muted-foreground">{getPlainText(category.name)}</span>
          </div>
          <h4 className="font-sans font-medium">{getPlainText(subCategory.title)}</h4>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
          onClick={handleRemove}
          title="Remove from wave"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Execution fields row */}
      <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <StatusBadge
            status={subCategory.status}
            onChange={(status) => handleUpdateField({ status })}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Progress:</span>
          <CompletionInput
            value={subCategory.completion}
            onChange={(completion) => handleUpdateField({ completion })}
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Priority:</span>
          <ImportanceBadge
            importance={subCategory.importance}
            onChange={(importance) => handleUpdateField({ importance })}
          />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Carryover:</span>
          <CarryoverBadge suggestion={carryoverSuggestion} />
        </div>
      </div>

      {/* Comments - editable and synced */}
      <div className="mt-3 bg-secondary/30 rounded-lg p-3">
        <label className="text-xs text-muted-foreground block mb-2">
          Notes & Comments
        </label>
        <RichTextEditor
          value={subCategory.comments}
          onChange={handleUpdateComments}
          placeholder="Add notes..."
          minHeight="60px"
        />
      </div>
    </div>
  );
}
