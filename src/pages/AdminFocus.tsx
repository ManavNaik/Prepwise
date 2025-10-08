// New AdminFocus.tsx (Admin-side)
import { useState } from "react";
import { Users, Clock, MessageSquare, BarChart2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AdminNavigation from "@/components/AdminNavigation";
import { Label } from "@/components/ui/label";

interface Student {
  id: string;
  name: string;
  level: string;
}

interface Session {
  id: string;
  date: Date;
  duration: number;
  completed: boolean;
  distractions: number;
}

interface Feedback {
  patterns: string;
  suggestions: string;
}

const mockStudents: Student[] = [
  { id: "1", name: "John Doe", level: "Intermediate" },
  { id: "2", name: "Jane Smith", level: "Final" },
];

const mockHistory: Record<string, Session[]> = {
  "1": [
    {
      id: "1",
      date: new Date(),
      duration: 45,
      completed: true,
      distractions: 0,
    },
    {
      id: "2",
      date: new Date(Date.now() - 86400000),
      duration: 30,
      completed: false,
      distractions: 3,
    },
    // Add more
  ],
  "2": [
    // Mock for other student
  ],
};

const mockFeedback: Record<string, Feedback> = {
  "1": { patterns: "", suggestions: "" },
  "2": { patterns: "", suggestions: "" },
};

const AdminFocus = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [history, setHistory] = useState<Session[]>([]);
  const [feedback, setFeedback] = useState<Feedback>({ patterns: "", suggestions: "" });
  const { toast } = useToast();

  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
    setHistory(mockHistory[value] || []);
    setFeedback(mockFeedback[value] || { patterns: "", suggestions: "" });
  };

  const saveFeedback = () => {
    // In real app, save to DB
    toast({ title: "Feedback Saved", description: "Your feedback has been submitted" });
  };

  // Calculate stats
  const totalSessions = history.length;
  const completedSessions = history.filter(s => s.completed).length;
  const averageDuration = totalSessions ? Math.round(history.reduce((sum, s) => sum + s.duration, 0) / totalSessions) : 0;
  const totalDistractions = history.reduce((sum, s) => sum + s.distractions, 0);
  const averageDistractions = totalSessions ? (totalDistractions / totalSessions).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AdminNavigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Admin Focus Management
            </h1>
            <p className="text-muted-foreground mt-2">View and provide feedback on student focus sessions</p>
          </div>
          
          <Select value={selectedStudent || ""} onValueChange={handleStudentChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Student" />
            </SelectTrigger>
            <SelectContent>
              {mockStudents.map(student => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name} ({student.level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedStudent && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 shadow-soft text-center">
                <div className="text-3xl font-heading font-bold text-primary">{totalSessions}</div>
                <p className="text-sm text-muted-foreground mt-1">Total Sessions</p>
              </Card>
              <Card className="p-5 shadow-soft text-center">
                <div className="text-3xl font-heading font-bold text-accent">{completedSessions}</div>
                <p className="text-sm text-muted-foreground mt-1">Completed</p>
              </Card>
              <Card className="p-5 shadow-soft text-center">
                <div className="text-3xl font-heading font-bold gradient-hero bg-clip-text text-transparent">{averageDuration}</div>
                <p className="text-sm text-muted-foreground mt-1">Avg Duration (min)</p>
              </Card>
              <Card className="p-5 shadow-soft text-center">
                <div className="text-3xl font-heading font-bold text-orange-600">{averageDistractions}</div>
                <p className="text-sm text-muted-foreground mt-1">Avg Distractions</p>
              </Card>
            </div>

            {/* Session History */}
            <Card className="p-6 shadow-medium">
              <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Focus Session History
              </h2>
              {history.length === 0 ? (
                <p className="text-center text-muted-foreground">No sessions recorded</p>
              ) : (
                <div className="space-y-3">
                  {history.slice().reverse().map(session => (
                    <div
                      key={session.id}
                      className="p-4 rounded-lg bg-secondary flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">{format(session.date, "MMM d, yyyy - h:mm a")}</p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {session.duration} min {session.completed ? "(Completed)" : "(Incomplete)"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{session.distractions}</p>
                        <p className="text-sm text-muted-foreground">Distractions</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Feedback Section */}
            <Card className="p-6 shadow-medium">
              <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                Feedback on Distraction Patterns
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patterns">Observed Patterns</Label>
                  <Textarea
                    id="patterns"
                    placeholder="Describe any patterns in distractions..."
                    value={feedback.patterns}
                    onChange={(e) => setFeedback({ ...feedback, patterns: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="suggestions">Suggestions</Label>
                  <Textarea
                    id="suggestions"
                    placeholder="Provide feedback and improvement suggestions..."
                    value={feedback.suggestions}
                    onChange={(e) => setFeedback({ ...feedback, suggestions: e.target.value })}
                  />
                </div>
                <Button variant="gradient" onClick={saveFeedback}>
                  Save Feedback
                </Button>
              </div>
            </Card>
          </>
        )}

        {!selectedStudent && (
          <Card className="p-12 text-center shadow-medium">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Select a student to view their focus sessions</p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminFocus;