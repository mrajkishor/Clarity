import { useMemo } from 'react';
import { useProductivity } from '@/store/productivityStore';
import { Wave } from '@/types/productivity';
import { differenceInDays, parseISO, format } from 'date-fns';
import { cn } from '@/lib/utils';

interface WaveInsightCardProps {
  wave: Wave;
  status: 'planned' | 'in-progress' | 'completed';
}

function WaveInsightCard({ wave, status }: WaveInsightCardProps) {
  const plannedDuration = differenceInDays(parseISO(wave.endDate), parseISO(wave.startDate));
  
  // Count tasks based on data mode
  const taskCount = wave.dataMode === 'reference' 
    ? wave.subCategoryRefs.length 
    : wave.subCategorySnapshots.length;
  
  // Calculate completion ratio for snapshots
  const completionRatio = useMemo(() => {
    if (wave.dataMode === 'snapshot' && wave.subCategorySnapshots.length > 0) {
      const completed = wave.subCategorySnapshots.filter(s => s.status === 'done').length;
      return completed / wave.subCategorySnapshots.length;
    }
    return 0;
  }, [wave]);

  const statusColors = {
    'planned': 'bg-muted/50 text-muted-foreground',
    'in-progress': 'bg-primary/10 text-primary',
    'completed': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  };

  const statusLabels = {
    'planned': 'Planned',
    'in-progress': 'In Progress',
    'completed': 'Completed',
  };

  return (
    <div className="p-5 rounded-xl bg-card border border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-medium text-foreground">{wave.name}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            {format(parseISO(wave.startDate), 'MMM d')} — {format(parseISO(wave.endDate), 'MMM d, yyyy')}
          </p>
        </div>
        <span className={cn('text-xs px-2 py-1 rounded-full font-medium', statusColors[status])}>
          {statusLabels[status]}
        </span>
      </div>

      <div className="space-y-3">
        {/* Duration */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-medium">{plannedDuration} days</span>
        </div>

        {/* Tasks linked */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Tasks linked</span>
          <span className="font-medium">{taskCount}</span>
        </div>

        {/* Completion ratio - only for completed waves */}
        {status === 'completed' && wave.subCategorySnapshots.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{Math.round(completionRatio * 100)}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${completionRatio * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Timeline visualization */}
        <div className="pt-2">
          <div className="h-2 bg-muted/50 rounded-full overflow-hidden relative">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                status === 'completed' ? 'bg-emerald-500' : 
                status === 'in-progress' ? 'bg-primary' : 'bg-muted-foreground/30'
              )}
              style={{ 
                width: status === 'completed' ? '100%' : 
                       status === 'in-progress' ? '50%' : '0%' 
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-muted-foreground">
            <span>Start</span>
            <span>End</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WaveInsights() {
  const { state, getWaveStatus } = useProductivity();

  const categorizedWaves = useMemo(() => {
    const completed: Wave[] = [];
    const inProgress: Wave[] = [];
    const planned: Wave[] = [];

    state.waves.forEach(wave => {
      const status = getWaveStatus(wave.id);
      if (status === 'completed') completed.push(wave);
      else if (status === 'in-progress') inProgress.push(wave);
      else planned.push(wave);
    });

    return { completed, inProgress, planned };
  }, [state.waves, getWaveStatus]);

  if (state.waves.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No waves created yet.</p>
        <p className="text-sm mt-1">Create waves in Rolling Waves to see insights here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* In Progress Waves */}
      {categorizedWaves.inProgress.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Current Focus
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {categorizedWaves.inProgress.map(wave => (
              <WaveInsightCard key={wave.id} wave={wave} status="in-progress" />
            ))}
          </div>
        </div>
      )}

      {/* Completed Waves */}
      {categorizedWaves.completed.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Completed Waves
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {categorizedWaves.completed.map(wave => (
              <WaveInsightCard key={wave.id} wave={wave} status="completed" />
            ))}
          </div>
        </div>
      )}

      {/* Planned Waves */}
      {categorizedWaves.planned.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
            Upcoming
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {categorizedWaves.planned.map(wave => (
              <WaveInsightCard key={wave.id} wave={wave} status="planned" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
