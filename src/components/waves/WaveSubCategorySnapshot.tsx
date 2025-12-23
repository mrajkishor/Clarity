import { SubCategorySnapshot } from '@/types/productivity';
import { ColorDot } from '@/components/ui/ColorPicker';
import {
  StatusBadge,
  ImportanceBadge,
  CarryoverBadge,
} from '@/components/ui/ExecutionBadges';
import { computeCarryoverSuggestion } from '@/lib/carryover';
import { formatCompletion } from '@/lib/carryover';
import { Lock } from 'lucide-react';

interface WaveSubCategorySnapshotProps {
  snapshot: SubCategorySnapshot;
}

export function WaveSubCategorySnapshot({ snapshot }: WaveSubCategorySnapshotProps) {
  const carryoverSuggestion = computeCarryoverSuggestion({
    status: snapshot.status,
    completion: snapshot.completion,
    importance: snapshot.importance,
  });

  // Strip HTML for display
  const getPlainText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  return (
    <div className="group bg-card/50 border border-border/50 rounded-lg p-4 opacity-80">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <ColorDot color={snapshot.categoryColor} />
            <span className="text-xs text-muted-foreground">{getPlainText(snapshot.categoryName)}</span>
            <Lock className="w-3 h-3 text-muted-foreground ml-auto" />
          </div>
          <h4 className="font-sans font-medium">{getPlainText(snapshot.title)}</h4>
        </div>
      </div>

      {/* Execution fields row (readonly) */}
      <div className="flex flex-wrap items-center gap-3 mt-3 pt-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Status:</span>
          <StatusBadge status={snapshot.status} readonly />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Progress:</span>
          <span className="text-xs font-mono">{formatCompletion(snapshot.completion)}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Priority:</span>
          <ImportanceBadge importance={snapshot.importance} readonly />
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Carryover:</span>
          <CarryoverBadge suggestion={carryoverSuggestion} />
        </div>
      </div>

      {/* Comments preview (readonly) */}
      {snapshot.comments && (
        <div className="mt-3 bg-secondary/20 rounded-lg p-3">
          <label className="text-xs text-muted-foreground block mb-1">
            Notes (at time of snapshot)
          </label>
          <div 
            className="text-sm prose prose-sm max-w-none text-muted-foreground"
            dangerouslySetInnerHTML={{ __html: snapshot.comments }}
          />
        </div>
      )}
    </div>
  );
}
