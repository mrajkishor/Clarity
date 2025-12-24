import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useProductivity } from '@/store/productivityStore';
import { WaveItem } from './WaveItem';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function RollingWaves() {
  const { state, dispatch } = useProductivity();
  const { toast } = useToast();

  const handleAddWave = () => {
    let startDate: Date;
    
    // Find the latest wave end date to avoid overlap
    if (state.waves.length > 0) {
      const latestEndDate = state.waves.reduce((latest, wave) => {
        const waveEnd = new Date(wave.endDate);
        return waveEnd > latest ? waveEnd : latest;
      }, new Date(0));
      
      // Start from the day after the latest wave ends
      startDate = new Date(latestEndDate);
      startDate.setDate(startDate.getDate() + 1);
    } else {
      startDate = new Date();
    }
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 14);

    const result = dispatch({
      type: 'ADD_WAVE',
      payload: {
        name: '',
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        majorGoals: '',
        retrospective: '',
      },
    }) as { success: boolean; error?: string } | undefined;

    if (result && !result.success && result.error) {
      toast({
        variant: 'destructive',
        title: 'Cannot create wave',
        description: result.error,
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif font-medium">Rolling Waves</h2>
          <p className="text-muted-foreground text-xs sm:text-sm mt-0.5 sm:mt-1">
            Time-boxed execution cycles for focused work
          </p>
        </div>
        <Button onClick={handleAddWave} variant="outline" size="sm" className="self-start sm:self-auto h-9 sm:h-8 touch-manipulation">
          <Plus className="w-4 h-4 mr-2" />
          New Wave
        </Button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {state.waves.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-muted-foreground">
            <p className="mb-4 text-sm sm:text-base">No waves yet</p>
            <Button onClick={handleAddWave} variant="secondary" className="h-10 touch-manipulation">
              <Plus className="w-4 h-4 mr-2" />
              Start your first wave
            </Button>
          </div>
        ) : (
          state.waves.map((wave) => <WaveItem key={wave.id} wave={wave} />)
        )}
      </div>
    </div>
  );
}
