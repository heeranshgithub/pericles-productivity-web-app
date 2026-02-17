'use client';

import { useState } from 'react';
import { useExportPdfMutation } from '@/store/api/notesApi';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Copy } from 'lucide-react';
import { SAMPLE_HTML } from './sample-html';
import { KICKBOXING_HTML } from './kickboxing-html';

export default function TestPdfPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const [exportPdf, { isLoading }] = useExportPdfMutation();

  const handleExport = async () => {
    if (!htmlContent.trim()) return;

    try {
      const blob = await exportPdf({
        htmlContent,
        filename: 'test-export.pdf',
      }).unwrap();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'test-export.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export PDF:', error);
    }
  };

  const handleLoadSample = () => {
    setHtmlContent(SAMPLE_HTML);
  };

  const handleLoadKickboxingSample = () => {
    setHtmlContent(KICKBOXING_HTML);
  };

  return (
    <div className="min-h-screen w-full p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Test PDF Export</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter HTML content and export it as a PDF.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            HTML Content
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-7 text-xs"
              onClick={handleLoadSample}
            >
              <Copy className="h-3 w-3" />
              Load Sample
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-7 text-xs"
              onClick={handleLoadKickboxingSample}
            >
              <Copy className="h-3 w-3" />
              Load Kickboxing
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <textarea
            value={htmlContent}
            onChange={e => setHtmlContent(e.target.value)}
            placeholder="Paste your HTML content here..."
            className="w-full h-80 p-3 rounded-lg border border-border bg-background font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleExport}
              disabled={isLoading || !htmlContent.trim()}
              className="gap-2"
            >
              <FileDown className="h-4 w-4" />
              {isLoading ? 'Generating...' : 'Export PDF'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
