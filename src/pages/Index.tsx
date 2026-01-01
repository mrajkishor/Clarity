import { Link } from 'react-router-dom';
import { useProductivity } from '@/store/productivityStore';
import { TabNavigation } from '@/components/layout/TabNavigation';
import { MobileNavigation } from '@/components/layout/MobileNavigation';
import { LongTermGoals } from '@/components/goals/LongTermGoals';
import { TaskManager } from '@/components/tasks/TaskManager';
import { RollingWaves } from '@/components/waves/RollingWaves';
import { Notepad } from '@/components/notes/Notepad';
import { Analytics } from '@/components/analytics/Analytics';
import { BackupControls } from '@/components/backup/BackupControls';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ProductivityApp() {
  const { state } = useProductivity();

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-md border-b border-border/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Top bar with logo and actions */}
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Logo and title */}
            <div className="min-w-0">
              <h1 className="text-xl font-serif font-medium tracking-tight">
                Clarity
              </h1>
              <p className="text-[11px] sm:text-xs text-muted-foreground hidden sm:block">
                Intentional planning, focused execution
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              <BackupControls />
              <Button 
                variant="ghost" 
                size="icon" 
                asChild 
                className="h-9 w-9 sm:h-8 sm:w-8 text-muted-foreground hover:text-foreground touch-manipulation"
              >
                <Link to="/about" title="About Clarity">
                  <HelpCircle className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Desktop tab navigation - separate row */}
          <div className="hidden lg:block -mb-px">
            <TabNavigation />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-6 lg:py-8">
        {state.activeTab === 'goals' && <LongTermGoals />}
        {state.activeTab === 'tasks' && <TaskManager />}
        {state.activeTab === 'waves' && <RollingWaves />}
        {state.activeTab === 'notes' && <Notepad />}
        {state.activeTab === 'analytics' && <Analytics />}
      </main>

      {/* Footer - hidden on mobile */}
      <footer className="hidden lg:block border-t border-border mt-auto">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <p className="text-xs text-muted-foreground text-center">
            Focus on what matters. Reflect on what works.
          </p>
        </div>
      </footer>

      {/* Mobile bottom navigation */}
      <MobileNavigation />
    </div>
  );
}

const Index = () => {
  return <ProductivityApp />;
};

export default Index;
