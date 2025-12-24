import { Target, ListTree, Waves, BarChart3 } from 'lucide-react';
import { useProductivity } from '@/store/productivityStore';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'goals' as const, label: 'Goals', icon: Target },
  { id: 'tasks' as const, label: 'Tasks', icon: ListTree },
  { id: 'waves' as const, label: 'Waves', icon: Waves },
  { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
];

export function MobileNavigation() {
  const { state, dispatch } = useProductivity();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border safe-area-bottom lg:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = state.activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] touch-manipulation',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive && 'scale-110')} />
              <span className="text-[10px] font-medium leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
