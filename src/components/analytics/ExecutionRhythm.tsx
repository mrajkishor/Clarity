import { useMemo } from 'react';
import { useProductivity } from '@/store/productivityStore';
import { parseISO, format, startOfMonth, isSameMonth } from 'date-fns';

interface MonthlyStats {
  month: string;
  wavesCompleted: number;
  tasksCompleted: number;
}

export function ExecutionRhythm() {
  const { state, getWaveStatus } = useProductivity();

  const stats = useMemo(() => {
    const completedWaves = state.waves.filter(w => getWaveStatus(w.id) === 'completed');
    
    // Calculate average tasks per wave
    const totalTasks = completedWaves.reduce((sum, wave) => {
      return sum + wave.subCategorySnapshots.filter(s => s.status === 'done').length;
    }, 0);
    const avgTasksPerWave = completedWaves.length > 0 
      ? Math.round(totalTasks / completedWaves.length * 10) / 10 
      : 0;

    // Group waves by month
    const monthlyMap = new Map<string, MonthlyStats>();
    
    completedWaves.forEach(wave => {
      const endDate = parseISO(wave.endDate);
      const monthKey = format(startOfMonth(endDate), 'yyyy-MM');
      const monthLabel = format(endDate, 'MMM yyyy');
      
      const existing = monthlyMap.get(monthKey);
      const tasksCompleted = wave.subCategorySnapshots.filter(s => s.status === 'done').length;
      
      if (existing) {
        existing.wavesCompleted++;
        existing.tasksCompleted += tasksCompleted;
      } else {
        monthlyMap.set(monthKey, {
          month: monthLabel,
          wavesCompleted: 1,
          tasksCompleted,
        });
      }
    });

    // Sort by date and get last 6 months
    const monthlyStats = Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([, stats]) => stats);

    return {
      totalWaves: completedWaves.length,
      totalTasksCompleted: totalTasks,
      avgTasksPerWave,
      monthlyStats,
    };
  }, [state.waves, getWaveStatus]);

  if (stats.totalWaves === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No execution history yet.</p>
        <p className="text-sm mt-1">Complete waves to see your rhythm patterns.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* High-level stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
          <p className="text-2xl font-semibold text-foreground">{stats.totalWaves}</p>
          <p className="text-xs text-muted-foreground mt-1">Waves completed</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
          <p className="text-2xl font-semibold text-foreground">{stats.totalTasksCompleted}</p>
          <p className="text-xs text-muted-foreground mt-1">Tasks done</p>
        </div>
        <div className="text-center p-4 rounded-xl bg-card border border-border/50">
          <p className="text-2xl font-semibold text-foreground">{stats.avgTasksPerWave}</p>
          <p className="text-xs text-muted-foreground mt-1">Avg per wave</p>
        </div>
      </div>

      {/* Monthly breakdown */}
      {stats.monthlyStats.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-muted-foreground">Monthly Overview</h4>
          <div className="space-y-3">
            {stats.monthlyStats.map((month, idx) => (
              <div key={month.month} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-20 flex-shrink-0">
                  {month.month}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  {/* Wave blocks */}
                  <div className="flex gap-1">
                    {Array.from({ length: month.wavesCompleted }).map((_, i) => (
                      <div 
                        key={i}
                        className="w-4 h-4 rounded bg-primary/80"
                        title={`Wave ${i + 1}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {month.wavesCompleted} wave{month.wavesCompleted !== 1 ? 's' : ''}, {month.tasksCompleted} tasks
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Observational note */}
      <p className="text-xs text-muted-foreground text-center italic">
        This view is observational — not a performance score.
      </p>
    </div>
  );
}
