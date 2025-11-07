import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const Pomodoro = () => {
  const { user } = useAuth();
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState('');
  const [totalTime, setTotalTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            handleComplete();
            return;
          }
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleComplete = async () => {
    if (!user) return;

    toast.success('Pomodoro session completed!', {
      description: 'Great work! Take a short break.'
    });

    try {
      await supabase.from('study_sessions').insert({
        user_id: user.id,
        duration: totalTime * 60,
        subject: subject || null
      });
    } catch (error) {
      console.error('Error saving session:', error);
    }
  };

  const toggleTimer = () => {
    if (!isActive && totalTime === 0) {
      setTotalTime(minutes);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(25);
    setSeconds(0);
    setTotalTime(0);
  };

  const progress = totalTime > 0 
    ? ((totalTime * 60 - (minutes * 60 + seconds)) / (totalTime * 60)) * 100 
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pomodoro Timer</h1>
          <p className="text-muted-foreground">Stay focused with the Pomodoro technique</p>
        </div>

        <Card className="shadow-card max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Focus Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
                    className="text-primary transition-all duration-1000"
                  />
                </svg>
                <div className="text-center z-10">
                  <div className="text-6xl font-bold">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </div>
                  <Timer className="w-8 h-8 mx-auto mt-2 text-muted-foreground" />
                </div>
              </div>

              <div className="w-full space-y-2">
                <Label htmlFor="subject">Subject (optional)</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What are you studying?"
                  disabled={isActive}
                />
              </div>

              <div className="flex gap-4">
                <Button size="lg" onClick={toggleTimer}>
                  {isActive ? (
                    <>
                      <Pause className="mr-2 h-5 w-5" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Start
                    </>
                  )}
                </Button>
                <Button size="lg" variant="outline" onClick={resetTimer}>
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card max-w-lg mx-auto">
          <CardHeader>
            <CardTitle>Tips for Effective Pomodoro</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Focus on a single task during the session</li>
              <li>• Take a 5-minute break after each session</li>
              <li>• Take a longer 15-30 minute break after 4 sessions</li>
              <li>• Eliminate all distractions before starting</li>
              <li>• Track your progress and celebrate wins</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Pomodoro;
