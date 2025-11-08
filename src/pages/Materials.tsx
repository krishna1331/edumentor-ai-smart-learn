import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Material {
  id: string;
  title: string;
  description: string;
  file_url: string;
  subject: string;
  downloads: number;
  created_at: string;
  user_id: string;
}

const Materials = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    const { data, error } = await supabase
      .from('materials')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching materials:', error);
      toast.error('Failed to load materials');
      return;
    }

    setMaterials(data || []);
  };

  const handleUpload = async () => {
    if (!user || !title || !file || !subject) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      const fileUrl = `https://example.com/files/${file.name}`;

      const { error } = await supabase.from('materials').insert({
        user_id: user.id,
        title,
        description,
        file_url: fileUrl,
        file_type: file.type,
        subject
      });

      if (error) throw error;

      toast.success('Material uploaded successfully!');
      setTitle('');
      setDescription('');
      setSubject('');
      setFile(null);
      setOpen(false);
      fetchMaterials();
    } catch (error) {
      console.error('Error uploading material:', error);
      toast.error('Failed to upload material');
    }
  };

  const handleDownload = async (materialId: string, fileUrl: string) => {
    await supabase
      .from('materials')
      .update({ downloads: materials.find(m => m.id === materialId)!.downloads + 1 })
      .eq('id', materialId);

    toast.success('Downloaded!');
    fetchMaterials();
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Study Materials</h1>
            <p className="text-muted-foreground">Share and download study materials</p>
          </div>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Upload Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Study Material</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mat-subject">Subject</Label>
                  <Input
                    id="mat-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mat-title">Title</Label>
                  <Input
                    id="mat-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Material title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mat-description">Description</Label>
                  <Textarea
                    id="mat-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mat-file">File</Label>
                  <Input
                    id="mat-file"
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </div>
                <Button onClick={handleUpload} className="w-full">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <Card key={material.id} className="shadow-card hover:shadow-elevated transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="h-8 w-8 text-primary" />
                  <Badge variant="outline">{material.subject}</Badge>
                </div>
                <CardTitle className="text-lg mt-2">{material.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {material.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{new Date(material.created_at).toLocaleDateString()}</span>
                  <span>{material.downloads} downloads</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleDownload(material.id, material.file_url)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Materials;
