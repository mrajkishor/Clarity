import { useProductivity } from '@/store/productivityStore';
import { TabNavigation } from '@/components/layout/TabNavigation';
import { LongTermGoals } from '@/components/goals/LongTermGoals';
import { TaskManager } from '@/components/tasks/TaskManager';
import { RollingWaves } from '@/components/waves/RollingWaves';
import { Analytics } from '@/components/analytics/Analytics';
import { BackupControls } from '@/components/backup/BackupControls';

function ProductivityApp() {
  const { state } = useProductivity();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-serif font-medium tracking-tight">
                  Clarity
                </h1>
                <p className="text-xs text-muted-foreground">
                  Intentional planning, focused execution
                </p>
              </div>
              <BackupControls />
            </div>
            <TabNavigation />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {state.activeTab === 'goals' && <LongTermGoals />}
        {state.activeTab === 'tasks' && <TaskManager />}
        {state.activeTab === 'waves' && <RollingWaves />}
        {state.activeTab === 'analytics' && <Analytics />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            Focus on what matters. Reflect on what works.
          </p>
        </div>
      </footer>
    </div>
  );
}

const Index = () => {
  return <ProductivityApp />;
};

export default Index;
