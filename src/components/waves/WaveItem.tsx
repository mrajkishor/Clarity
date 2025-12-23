import { useState } from 'react';
import { Trash2, Calendar, Lock, Unlock } from 'lucide-react';
import { Wave } from '@/types/productivity';
import { useProductivity } from '@/store/productivityStore';
import { computeWaveStatus } from '@/store/productivityStore';
import { TreeNode } from '@/components/ui/TreeNode';
import { EditableText } from '@/components/ui/EditableText';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { WaveSubCategoryRef } from './WaveSubCategoryRef';
import { WaveSubCategorySnapshot } from './WaveSubCategorySnapshot';
import { SubCategorySelector } from './SubCategorySelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DeleteConfirmDialog } from '@/components/ui/DeleteConfirmDialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface WaveItemProps {
  wave: Wave;
}

const statusColors = {
  'planned': 'bg-muted text-muted-foreground',
  'in-progress': 'bg-status-in-progress/20 text-status-in-progress',
  'completed': 'bg-status-done/20 text-status-done',
};

const statusLabels = {
  'planned': 'Planned',
  'in-progress': 'In Progress',
  'completed': 'Completed',
};

export function WaveItem({ wave }: WaveItemProps) {
  const { dispatch } = useProductivity();
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const status = computeWaveStatus(wave);

  const handleUpdateDates = (field: 'startDate' | 'endDate', value: string) => {
    const result = dispatch({
      type: 'UPDATE_WAVE',
      payload: { id: wave.id, updates: { [field]: value } },
    }) as { success: boolean; error?: string } | undefined;

    if (result && !result.success && result.error) {
      toast({
        variant: 'destructive',
        title: 'Invalid date range',
        description: result.error,
      });
    }
  };

  const handleDelete = () => {
    dispatch({ type: 'DELETE_WAVE', payload: { id: wave.id } });
    setShowDeleteConfirm(false);
  };

  const isEditable = status === 'in-progress';

  return (
    <>
      <TreeNode
        level={0}
        isExpanded={wave.isExpanded}
        hasChildren={true}
        onToggle={() => dispatch({ type: 'TOGGLE_WAVE', payload: { id: wave.id } })}
        header={
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-serif font-medium">
              <EditableText
                value={wave.name}
                onChange={(name) =>
                  dispatch({
                    type: 'UPDATE_WAVE',
                    payload: { id: wave.id, updates: { name } },
                  })
                }
                placeholder="Wave name..."
              />
            </h3>
            <Badge variant="outline" className={cn('text-xs', statusColors[status])}>
              {statusLabels[status]}
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {isEditable ? (
                <Unlock className="w-3 h-3" />
              ) : (
                <Lock className="w-3 h-3" />
              )}
              <span>{wave.dataMode === 'reference' ? 'Live' : 'Snapshot'}</span>
            </div>
            <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
              {wave.dataMode === 'reference' 
                ? wave.subCategoryRefs.length 
                : wave.subCategorySnapshots.length} tasks
            </span>
          </div>
        }
        actions={
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        }
      >
        <div className="ml-8 mt-3 space-y-4 animate-fade-in">
          {/* Date range */}
          <div className="flex flex-wrap items-center gap-4 p-3 bg-secondary/30 rounded-lg">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Start:</span>
              <Input
                type="date"
                value={wave.startDate}
                onChange={(e) => handleUpdateDates('startDate', e.target.value)}
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">End:</span>
              <Input
                type="date"
                value={wave.endDate}
                onChange={(e) => handleUpdateDates('endDate', e.target.value)}
                className="h-8 w-auto"
              />
            </div>
          </div>

          {/* Wave metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/30 rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-2">
                Major Goals
              </label>
              <RichTextEditor
                value={wave.majorGoals}
                onChange={(majorGoals) =>
                  dispatch({
                    type: 'UPDATE_WAVE',
                    payload: { id: wave.id, updates: { majorGoals } },
                  })
                }
                placeholder="What do you want to achieve this wave?"
                minHeight="80px"
              />
            </div>

            <div className="bg-secondary/30 rounded-lg p-3">
              <label className="text-xs text-muted-foreground block mb-2">
                Retrospective
              </label>
              <RichTextEditor
                value={wave.retrospective}
                onChange={(retrospective) =>
                  dispatch({
                    type: 'UPDATE_WAVE',
                    payload: { id: wave.id, updates: { retrospective } },
                  })
                }
                placeholder="Reflect on what worked and what didn't..."
                minHeight="80px"
              />
            </div>
          </div>

          {/* Sub-categories */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-muted-foreground">
                Focus Tasks
                {!isEditable && (
                  <span className="ml-2 text-xs opacity-70">
                    (Readonly - {status === 'planned' ? 'wave not started' : 'wave completed'})
                  </span>
                )}
              </h4>
              {isEditable && (
                <SubCategorySelector
                  waveId={wave.id}
                  existingRefs={wave.subCategoryRefs.map((r) => r.subCategoryId)}
                />
              )}
            </div>

            {wave.dataMode === 'reference' ? (
              // In-progress wave: live references
              wave.subCategoryRefs.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                  No tasks added yet. Select tasks from Task Manager.
                </div>
              ) : (
                <div className="grid gap-3">
                  {wave.subCategoryRefs.map((ref) => (
                    <WaveSubCategoryRef
                      key={ref.subCategoryId}
                      waveId={wave.id}
                      reference={ref}
                    />
                  ))}
                </div>
              )
            ) : (
              // Planned/Completed wave: snapshots
              wave.subCategorySnapshots.length === 0 ? (
                <div className="text-center py-6 text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                  No tasks in this wave.
                </div>
              ) : (
                <div className="grid gap-3">
                  {wave.subCategorySnapshots.map((snapshot) => (
                    <WaveSubCategorySnapshot
                      key={snapshot.id}
                      snapshot={snapshot}
                    />
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </TreeNode>

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        title="Delete Wave"
        description="Are you sure? This action cannot be undone."
      />
    </>
  );
}
