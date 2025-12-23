import { useMemo } from 'react';
import { useProductivity } from '@/store/productivityStore';
import { normalizeColor } from '@/components/ui/ColorPicker';

interface CategoryDistribution {
  id: string;
  name: string;
  color: string;
  taskCount: number;
  percentage: number;
}

export function FocusDistribution() {
  const { state, getWaveStatus } = useProductivity();

  const distribution = useMemo(() => {
    const categoryMap = new Map<string, { name: string; color: string; count: number }>();

    // Count tasks from completed waves (snapshots)
    state.waves.forEach(wave => {
      const status = getWaveStatus(wave.id);
      if (status !== 'completed') return;

      wave.subCategorySnapshots.forEach(snapshot => {
        const existing = categoryMap.get(snapshot.categoryId);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(snapshot.categoryId, {
            name: snapshot.categoryName.replace(/<[^>]*>/g, ''), // Strip HTML
            color: normalizeColor(snapshot.categoryColor),
            count: 1,
          });
        }
      });
    });

    // Also include in-progress wave references for a fuller picture
    state.waves.forEach(wave => {
      const status = getWaveStatus(wave.id);
      if (status !== 'in-progress') return;

      wave.subCategoryRefs.forEach(ref => {
        const category = state.categories.find(c => c.id === ref.categoryId);
        if (!category) return;

        const existing = categoryMap.get(ref.categoryId);
        if (existing) {
          existing.count++;
        } else {
          categoryMap.set(ref.categoryId, {
            name: category.name.replace(/<[^>]*>/g, ''),
            color: normalizeColor(category.color),
            count: 1,
          });
        }
      });
    });

    const total = Array.from(categoryMap.values()).reduce((sum, cat) => sum + cat.count, 0);

    const result: CategoryDistribution[] = Array.from(categoryMap.entries())
      .map(([id, data]) => ({
        id,
        name: data.name,
        color: data.color,
        taskCount: data.count,
        percentage: total > 0 ? (data.count / total) * 100 : 0,
      }))
      .sort((a, b) => b.taskCount - a.taskCount);

    return { categories: result, total };
  }, [state.waves, state.categories, getWaveStatus]);

  if (distribution.total === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No focus data yet.</p>
        <p className="text-sm mt-1">Complete waves with tasks to see your focus distribution.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stacked bar visualization */}
      <div className="space-y-3">
        <div className="flex h-8 rounded-lg overflow-hidden">
          {distribution.categories.map((cat, idx) => (
            <div
              key={cat.id}
              className="h-full transition-all duration-500 first:rounded-l-lg last:rounded-r-lg"
              style={{ 
                width: `${cat.percentage}%`,
                backgroundColor: cat.color,
                opacity: 0.85,
              }}
              title={`${cat.name}: ${cat.taskCount} tasks (${Math.round(cat.percentage)}%)`}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground text-center">
          Where your energy went across {distribution.total} tasks
        </p>
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        {distribution.categories.map(cat => (
          <div key={cat.id} className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: cat.color }}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium truncate">{cat.name}</span>
                <span className="text-sm text-muted-foreground ml-2">
                  {cat.taskCount} task{cat.taskCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="h-1.5 bg-muted rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
