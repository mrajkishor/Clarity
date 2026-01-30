import { useProductivityStore } from '@/store/productivityStore';
import { RichTextEditor } from '@/components/ui/RichTextEditor';
import { StickyNote, Download, FileText, FileType, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

// Helper to strip HTML and get plain text
function htmlToPlainText(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

// Helper to check if content is empty
function isContentEmpty(html: string): boolean {
  const text = htmlToPlainText(html).trim();
  return text.length === 0;
}

// Generate filename with date
function generateFilename(ext: string): string {
  const date = new Date().toISOString().split('T')[0];
  return `Clarity-Note-Notepad-${date}.${ext}`;
}

// Download blob helper
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function Notepad() {
  const notes = useProductivityStore((state) => state.notes);
  const updateNotes = useProductivityStore((state) => state.updateNotes);
  const { toast } = useToast();

  const handleExportTxt = () => {
    if (isContentEmpty(notes)) {
      toast({ title: 'Nothing to export yet', variant: 'destructive' });
      return;
    }
    const plainText = `Notepad\n\n${htmlToPlainText(notes)}`;
    const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, generateFilename('txt'));
    toast({ title: 'Downloaded as TXT' });
  };

  const handleExportDoc = () => {
    if (isContentEmpty(notes)) {
      toast({ title: 'Nothing to export yet', variant: 'destructive' });
      return;
    }
    // UTF-8 BOM for proper encoding in Word
    const bom = '\uFEFF';
    const htmlContent = `${bom}<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Notepad</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12pt; line-height: 1.5; }
  h1 { font-size: 18pt; margin-bottom: 12pt; }
  p { margin: 0 0 6pt 0; }
  ul, ol { margin: 0 0 6pt 0; padding-left: 18pt; }
</style>
</head>
<body>
<h1>Notepad</h1>
${notes}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    downloadBlob(blob, generateFilename('doc'));
    toast({ title: 'Downloaded as DOC' });
  };

  const handleExportPdf = async () => {
    if (isContentEmpty(notes)) {
      toast({ title: 'Nothing to export yet', variant: 'destructive' });
      return;
    }
    
    // Create a printable HTML document and trigger print dialog for PDF
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({ title: 'Please allow popups to export as PDF', variant: 'destructive' });
      return;
    }
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Clarity - Notepad</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              line-height: 1.6;
              color: #333;
            }
            h1 { font-size: 24px; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            p { margin: 0 0 1em; }
            ul, ol { margin: 0 0 1em; padding-left: 1.5em; }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>Notepad</h1>
          ${notes}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    toast({ title: 'Print dialog opened for PDF' });
  };

  return (
    <div className="animate-fade-in space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
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

        {/* Download dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9 sm:h-8 touch-manipulation">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer">
              <FileText className="w-4 h-4 mr-2" />
              Download as PDF
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportTxt} className="cursor-pointer">
              <File className="w-4 h-4 mr-2" />
              Download as TXT
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExportDoc} className="cursor-pointer">
              <FileType className="w-4 h-4 mr-2" />
              Download as DOC
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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