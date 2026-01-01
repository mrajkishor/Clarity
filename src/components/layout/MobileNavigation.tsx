import { Target, ListTree, Waves, BarChart3, StickyNote } from 'lucide-react';
import { useProductivity } from '@/store/productivityStore';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'goals' as const, label: 'Goals', icon: Target },
  { id: 'tasks' as const, label: 'Tasks', icon: ListTree },
  { id: 'waves' as const, label: 'Waves', icon: Waves },
  { id: 'notes' as const, label: 'Notes', icon: StickyNote },
  { id: 'analytics' as const, label: 'Stats', icon: BarChart3 },
];

export function MobileNavigation() {
  const { state, dispatch } = useProductivity();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/98 backdrop-blur-lg border-t border-border/50 safe-area-bottom lg:hidden shadow-[0_-4px_20px_-4px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-around h-[68px] px-1 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = state.activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-300 min-w-[56px] touch-manipulation active:scale-95',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground active:text-foreground'
              )}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
              <div className={cn(
                'p-1.5 rounded-lg transition-all duration-300',
                isActive ? 'bg-primary/10' : ''
              )}>
                <Icon className={cn(
                  'w-5 h-5 transition-transform duration-300',
                  isActive && 'scale-110'
                )} />
              </div>
              <span className={cn(
                'text-[10px] font-medium leading-none transition-all duration-300',
                isActive ? 'opacity-100' : 'opacity-70'
              )}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
