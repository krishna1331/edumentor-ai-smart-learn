import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Notes = () => {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleSummarize = async () => {
    if (!file || !user) {
      toast.error('Please select a file first');
      return;
    }

    setLoading(true);
    setSummary('');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        
        const { data, error } = await supabase.functions.invoke('summarize-notes', {
          body: { content: content.substring(0, 10000), title }
        });

        if (error) throw error;
        
        const noteId = crypto.randomUUID();
        await supabase.from('notes').insert({
          id: noteId,
          user_id: user.id,
          title,
          file_type: file.type
        });

        await supabase.from('note_summaries').insert({
          note_id: noteId,
          user_id: user.id,
          summary: data.summary
        });

        setSummary(data.summary);
        toast.success('Notes summarized successfully!');
      };

      reader.readAsText(file);
    } catch (error: any) {
      console.error('Summarization error:', error);
      toast.error('Failed to summarize notes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Notes Summarizer</h1>
          <p className="text-muted-foreground">Upload your notes and get AI-powered summaries</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Upload Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="file">Upload File (PDF or Text)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button onClick={handleSummarize} disabled={loading || !file}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Summarize
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {summary && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{summary}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notes;
