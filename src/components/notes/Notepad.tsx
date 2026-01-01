import { useProductivityStore } from '@/store/productivityStore';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { StickyNote } from 'lucide-react';

export function Notepad() {
  const notes = useProductivityStore((state) => state.notes);
  const updateNotes = useProductivityStore((state) => state.updateNotes);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <StickyNote className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Notepad</h2>
          <p className="text-sm text-muted-foreground">
            Capture thoughts, daily progress, and quick notes
          </p>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
        <RichTextEditor
          value={notes}
          onChange={updateNotes}
          placeholder="Start writing your notes here... Use the toolbar to format text, add colors, and create lists."
          minHeight="400px"
          className="border-0"
        />
      </div>

      {/* Helper text */}
      <p className="text-xs text-muted-foreground text-center">
        Your notes are saved automatically as you type
      </p>
    </div>
  );
}