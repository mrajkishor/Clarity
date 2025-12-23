import { useRef, useState } from 'react';
import { Download, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportBackup, importBackup } from '@/lib/backup';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function BackupControls() {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleExport = () => {
    try {
      exportBackup();
      toast({
        title: 'Backup exported',
        description: 'Your data has been downloaded as a JSON file.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Could not export backup. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.name.endsWith('.json')) {
      toast({
        title: 'Invalid file',
        description: 'Please select a JSON backup file.',
        variant: 'destructive',
      });
      return;
    }

    // Store file and show confirmation
    setPendingFile(file);
    setIsConfirmOpen(true);

    // Reset input
    event.target.value = '';
  };

  const handleConfirmImport = async () => {
    if (!pendingFile) return;

    const result = await importBackup(pendingFile);

    if (result.success) {
      toast({
        title: 'Backup restored',
        description: result.message,
      });
    } else {
      toast({
        title: 'Import failed',
        description: result.message,
        variant: 'destructive',
      });
    }

    setPendingFile(null);
    setIsConfirmOpen(false);
  };

  const handleCancelImport = () => {
    setPendingFile(null);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={handleImportClick}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Import</span>
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Restore from backup?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This will <strong>completely replace</strong> all your current data
                with the backup file contents.
              </p>
              <p className="text-muted-foreground">
                File: {pendingFile?.name}
              </p>
              <p className="text-amber-600 dark:text-amber-400">
                This action cannot be undone. Consider exporting your current data first.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelImport}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>
              Restore backup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
