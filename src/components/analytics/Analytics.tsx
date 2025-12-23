import { WaveInsights } from './WaveInsights';
import { FocusDistribution } from './FocusDistribution';
import { ExecutionRhythm } from './ExecutionRhythm';
import { ReflectionNotes } from './ReflectionNotes';

export function Analytics() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-serif font-medium tracking-tight">
          Analytics
        </h2>
        <p className="text-muted-foreground mt-1">
          Understand your patterns. Reflect, don't obsess.
        </p>
      </div>

      {/* Wave Insights */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium border-b border-border pb-2">
          Wave Insights
        </h3>
        <WaveInsights />
      </section>

      {/* Focus Distribution */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium border-b border-border pb-2">
          Focus Distribution
        </h3>
        <p className="text-sm text-muted-foreground">
          Where did your energy actually go?
        </p>
        <FocusDistribution />
      </section>

      {/* Execution Rhythm */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium border-b border-border pb-2">
          Execution Rhythm
        </h3>
        <p className="text-sm text-muted-foreground">
          High-level patterns, not daily pressure.
        </p>
        <ExecutionRhythm />
      </section>

      {/* Reflection Notes */}
      <section className="space-y-4">
        <h3 className="text-lg font-medium border-b border-border pb-2">
          Reflections
        </h3>
        <p className="text-sm text-muted-foreground">
          Your qualitative notes from completed waves.
        </p>
        <ReflectionNotes />
      </section>
    </div>
  );
}
