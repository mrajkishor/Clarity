import { useMemo } from 'react';
import { useProductivity } from '@/store/productivityStore';
import { parseISO, format } from 'date-fns';
import { FileText } from 'lucide-react';

export function ReflectionNotes() {
  const { state, getWaveStatus } = useProductivity();

  const wavesWithRetrospective = useMemo(() => {
    return state.waves
      .filter(wave => {
        const status = getWaveStatus(wave.id);
        // Only show completed waves with retrospective content
        const hasContent = wave.retrospective && 
          wave.retrospective.replace(/<[^>]*>/g, '').trim().length > 0;
        return status === 'completed' && hasContent;
      })
      .sort((a, b) => parseISO(b.endDate).getTime() - parseISO(a.endDate).getTime());
  }, [state.waves, getWaveStatus]);

  if (wavesWithRetrospective.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="w-8 h-8 mx-auto mb-3 opacity-50" />
        <p>No reflections yet.</p>
        <p className="text-sm mt-1">
          Add retrospective notes to completed waves to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {wavesWithRetrospective.map(wave => (
        <div 
          key={wave.id}
          className="p-5 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">{wave.name}</h4>
            <span className="text-xs text-muted-foreground">
              {format(parseISO(wave.endDate), 'MMM d, yyyy')}
            </span>
          </div>
          <div 
            className="text-sm text-muted-foreground prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: wave.retrospective }}
          />
        </div>
      ))}

      {/* Encouragement */}
      <p className="text-xs text-muted-foreground text-center italic">
        Reflection is a practice, not a metric.
      </p>
    </div>
  );
}
