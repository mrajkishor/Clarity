import { Target, ListTree, Waves, BarChart3 } from 'lucide-react';
import { useProductivity } from '@/store/productivityStore';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'goals' as const, label: 'Long-Term Goals', icon: Target },
  { id: 'tasks' as const, label: 'Task Manager', icon: ListTree },
  { id: 'waves' as const, label: 'Rolling Waves', icon: Waves },
  { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
];

export function TabNavigation() {
  const { state, dispatch } = useProductivity();

  return (
    <nav className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = state.activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-lg font-sans text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
