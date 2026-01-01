import { Target, ListTree, Waves, BarChart3, StickyNote } from 'lucide-react';
import { useProductivity } from '@/store/productivityStore';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'goals' as const, label: 'Goals', icon: Target },
  { id: 'tasks' as const, label: 'Tasks', icon: ListTree },
  { id: 'waves' as const, label: 'Waves', icon: Waves },
  { id: 'notes' as const, label: 'Notes', icon: StickyNote },
  { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
];

export function TabNavigation() {
  const { state, dispatch } = useProductivity();

  return (
    <nav className="flex items-center gap-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = state.activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
            className={cn(
              'relative flex items-center gap-2 pb-3 font-sans text-sm font-medium transition-colors duration-200',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
