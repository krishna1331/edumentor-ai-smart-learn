import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Doubt {
  id: string;
  title: string;
  description: string;
  subject: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string } | null;
}

const Community = () => {
  const { user } = useAuth();
  const [doubts, setDoubts] = useState<Doubt[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [reply, setReply] = useState('');
  const [selectedDoubt, setSelectedDoubt] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchDoubts();
  }, []);

  const fetchDoubts = async () => {
    const { data, error } = await supabase
      .from('doubts')
      .select(`
        *,
        profiles:user_id (
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching doubts:', error);
      toast.error('Failed to load doubts');
      return;
    }

    setDoubts(data || []);
  };

  const handlePostDoubt = async () => {
    if (!user || !title || !description || !subject) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const { error } = await supabase.from('doubts').insert({
        user_id: user.id,
        title,
        description,
        subject
      });

      if (error) throw error;

      toast.success('Doubt posted successfully!');
      setTitle('');
      setDescription('');
      setSubject('');
      setOpen(false);
      fetchDoubts();
    } catch (error) {
      console.error('Error posting doubt:', error);
      toast.error('Failed to post doubt');
    }
  };

  const handleReply = async (doubtId: string) => {
    if (!user || !reply) {
      toast.error('Please enter a reply');
      return;
    }

    try {
      const { error } = await supabase.from('doubt_replies').insert({
        doubt_id: doubtId,
        user_id: user.id,
        reply
      });

      if (error) throw error;

      toast.success('Reply posted!');
      setReply('');
      setSelectedDoubt(null);
    } catch (error) {
      console.error('Error posting reply:', error);
      toast.error('Failed to post reply');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Community Doubts</h1>
            <p className="text-muted-foreground">Ask questions and help others</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Post Doubt
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Post a New Doubt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Brief title of your doubt"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your doubt in detail"
                    rows={4}
                  />
                </div>
                <Button onClick={handlePostDoubt} className="w-full">
                  Post Doubt
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {doubts.map((doubt) => (
            <Card key={doubt.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{doubt.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{doubt.subject}</Badge>
                      <Badge variant={doubt.status === 'open' ? 'default' : 'secondary'}>
                        {doubt.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        by {doubt.profiles?.full_name || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{doubt.description}</p>
                
                {selectedDoubt === doubt.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      placeholder="Write your reply..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button onClick={() => handleReply(doubt.id)} size="sm">
                        <Send className="mr-2 h-4 w-4" />
                        Send Reply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedDoubt(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDoubt(doubt.id)}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Community;
