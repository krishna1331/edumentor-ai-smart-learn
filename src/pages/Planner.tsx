import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Planner = () => {
  const { user } = useAuth();
  const [goal, setGoal] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [subjects, setSubjects] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const generatePlan = async () => {
    if (!user || !goal || !timeframe) {
      toast.error('Please fill required fields');
      return;
    }

    setLoading(true);
    setPlan(null);

    try {
      const { data, error } = await supabase.functions.invoke('generate-study-plan', {
        body: { goal, timeframe, subjects }
      });

      if (error) throw error;

      await supabase.from('study_plans').insert({
        user_id: user.id,
        title: goal,
        description: `${timeframe} study plan`,
        plan_data: data.plan
      });

      setPlan(data.plan);
      toast.success('Study plan generated!');
    } catch (error: any) {
      console.error('Plan generation error:', error);
      toast.error('Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Smart Planner</h1>
          <p className="text-muted-foreground">AI-powered study planning</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Create Study Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goal">Study Goal *</Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Prepare for final exams"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe *</Label>
              <Input
                id="timeframe"
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                placeholder="e.g., 2 weeks, 1 month"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subjects">Subjects (optional)</Label>
              <Textarea
                id="subjects"
                value={subjects}
                onChange={(e) => setSubjects(e.target.value)}
                placeholder="List subjects to cover"
                rows={3}
              />
            </div>

            <Button onClick={generatePlan} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {plan && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Study Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap">{plan}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Planner;
