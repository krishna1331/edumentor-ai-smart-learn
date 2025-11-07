import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Brain, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

const MCQ = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});

  const generateQuestions = async () => {
    if (!subject || !user) {
      toast.error('Please enter a subject');
      return;
    }

    setLoading(true);
    setQuestions([]);
    setAnswers({});
    setResults({});

    try {
      const { data, error } = await supabase.functions.invoke('generate-mcq', {
        body: { subject }
      });

      if (error) throw error;
      
      const savedQuestions = await Promise.all(
        data.questions.map(async (q: any) => {
          const { data: saved } = await supabase
            .from('mcq_questions')
            .insert({
              user_id: user.id,
              subject,
              question: q.question,
              options: q.options,
              correct_answer: q.correct_answer
            })
            .select()
            .single();
          
          return saved;
        })
      );

      setQuestions(savedQuestions);
      toast.success('Questions generated successfully!');
    } catch (error: any) {
      console.error('Generation error:', error);
      toast.error('Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    const newResults: Record<string, boolean> = {};
    
    await Promise.all(
      questions.map(async (q) => {
        const isCorrect = answers[q.id] === q.correct_answer;
        newResults[q.id] = isCorrect;
        
        await supabase.from('mcq_attempts').insert({
          user_id: user.id,
          question_id: q.id,
          selected_answer: answers[q.id],
          is_correct: isCorrect
        });
      })
    );

    setResults(newResults);
    const correct = Object.values(newResults).filter(Boolean).length;
    toast.success(`You got ${correct} out of ${questions.length} correct!`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">MCQ Practice</h1>
          <p className="text-muted-foreground">Generate and practice MCQ questions</p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Generate Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics, Physics, History"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={generateQuestions} disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {questions.length > 0 && (
          <>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <Card key={q.id} className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="font-medium">{q.question}</p>
                    <RadioGroup
                      value={answers[q.id]}
                      onValueChange={(value) => setAnswers({ ...answers, [q.id]: value })}
                    >
                      {q.options.map((option, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`${q.id}-${i}`} />
                          <Label htmlFor={`${q.id}-${i}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                    {results[q.id] !== undefined && (
                      <div className={`p-2 rounded ${results[q.id] ? 'bg-secondary/20' : 'bg-destructive/20'}`}>
                        {results[q.id] ? 'Correct!' : `Incorrect. Answer: ${q.correct_answer}`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {Object.keys(results).length === 0 && (
              <Button onClick={handleSubmit} className="w-full" size="lg">
                Submit Answers
              </Button>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MCQ;
