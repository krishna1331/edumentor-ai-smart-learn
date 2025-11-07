import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { FileText, Brain, MessageSquare, Clock, TrendingUp, Award } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    notesCount: 0,
    mcqAttempts: 0,
    mcqAccuracy: 0,
    doubtsPosted: 0,
    studyTime: 0,
    streak: 0
  });
  const [quote, setQuote] = useState('');
  const [loading, setLoading] = useState(true);

  const motivationalQuotes = [
    "The expert in anything was once a beginner.",
    "Education is the passport to the future.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Learning is a treasure that will follow its owner everywhere.",
    "The beautiful thing about learning is that no one can take it away from you."
  ];

  useEffect(() => {
    const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
    setQuote(randomQuote);

    const fetchStats = async () => {
      if (!user) return;

      try {
        const [notesRes, attemptsRes, doubtsRes, sessionsRes] = await Promise.all([
          supabase.from('notes').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('mcq_attempts').select('*').eq('user_id', user.id),
          supabase.from('doubts').select('id', { count: 'exact' }).eq('user_id', user.id),
          supabase.from('study_sessions').select('duration').eq('user_id', user.id)
        ]);

        const totalAttempts = attemptsRes.data?.length || 0;
        const correctAttempts = attemptsRes.data?.filter(a => a.is_correct).length || 0;
        const totalStudyTime = sessionsRes.data?.reduce((acc, s) => acc + s.duration, 0) || 0;

        setStats({
          notesCount: notesRes.count || 0,
          mcqAttempts: totalAttempts,
          mcqAccuracy: totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0,
          doubtsPosted: doubtsRes.count || 0,
          studyTime: Math.floor(totalStudyTime / 60),
          streak: 5
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  const statCards = [
    { icon: FileText, label: 'Notes Uploaded', value: stats.notesCount, color: 'text-primary' },
    { icon: Brain, label: 'MCQ Attempts', value: stats.mcqAttempts, color: 'text-secondary' },
    { icon: TrendingUp, label: 'Accuracy', value: `${stats.mcqAccuracy}%`, color: 'text-accent' },
    { icon: MessageSquare, label: 'Doubts Posted', value: stats.doubtsPosted, color: 'text-destructive' },
    { icon: Clock, label: 'Study Time (mins)', value: stats.studyTime, color: 'text-primary' },
    { icon: Award, label: 'Day Streak', value: stats.streak, color: 'text-secondary' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-hero rounded-lg p-8 text-primary-foreground shadow-elevated">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.user_metadata?.full_name || 'Student'}!
          </h1>
          <p className="text-lg opacity-90">&quot;{quote}&quot;</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-all">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Section */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Today&apos;s Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Study Goal</span>
                <span>{stats.studyTime}/120 mins</span>
              </div>
              <Progress value={(stats.studyTime / 120) * 100} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>MCQ Practice</span>
                <span>{stats.mcqAttempts}/10 questions</span>
              </div>
              <Progress value={(stats.mcqAttempts / 10) * 100} className="bg-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
