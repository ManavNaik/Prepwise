// New AdminDashboard.tsx (Admin-side)
import { useState } from "react";
import { Users, Flame, Trophy, MessageSquare, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import AdminNavigation from "@/components/AdminNavigation";
import Navigation from "@/components/Navigation";
import ProgressRing from "@/components/ProgressRing";

interface Student {
  id: string;
  name: string;
  level: string;
}

interface StreakData {
  current: number;
  longest: number;
  targetCompletion: number;
  focusSessions: number;
  consistency: number;
}

interface Badge {
  id: string;
  name: string;
}

const mockStudents: Student[] = [
  { id: "1", name: "John Doe", level: "Intermediate" },
  { id: "2", name: "Jane Smith", level: "Final" },
];

const mockStreakData: Record<string, StreakData> = {
  "1": {
    current: 7,
    longest: 12,
    targetCompletion: 85,
    focusSessions: 75,
    consistency: 90,
  },
  "2": {
    current: 5,
    longest: 8,
    targetCompletion: 70,
    focusSessions: 60,
    consistency: 80,
  },
};

const mockBadges: Badge[] = [
  { id: "1", name: "Streak Starter" },
  { id: "2", name: "Focus Champion" },
  { id: "3", name: "Consistency King" },
];

const AdminDashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  const [comments, setComments] = useState("");
  const [selectedBadge, setSelectedBadge] = useState<string>("");
  const { toast } = useToast();

  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
    setStreakData(mockStreakData[value] || null);
    setComments("");
    setSelectedBadge("");
  };

  const saveComments = () => {
    // In real app, save to DB
    toast({ title: "Comments Saved", description: "Your encouragement has been sent" });
  };

  const awardBadge = () => {
    if (!selectedBadge) return;
    // In real app, award to student
    toast({ title: "Badge Awarded", description: `Awarded ${mockBadges.find(b => b.id === selectedBadge)?.name} to student` });
    setSelectedBadge("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AdminNavigation />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3">
              <Users className="w-8 h-8 text-primary" />
              Admin Streaks Management
            </h1>
            <p className="text-muted-foreground mt-2">View and encourage student streaks</p>
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

        {selectedStudent && streakData && (
          <>
            {/* Streak Report */}
            <Card className="p-6 shadow-medium">
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                Streak Report
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-around gap-8 mb-8">
                <div className="text-center">
                  <div className="text-5xl font-heading font-bold gradient-hero bg-clip-text text-transparent">
                    {streakData.current}
                  </div>
                  <p className="text-muted-foreground mt-2">Current Streak</p>
                </div>
                
                <div className="w-px h-24 bg-border hidden md:block"></div>
                
                <div className="text-center">
                  <div className="text-3xl font-heading font-bold text-accent">
                    {streakData.longest}
                  </div>
                  <p className="text-muted-foreground mt-2">Longest Streak</p>
                </div>
              </div>
            </Card>

            {/* Progress Rings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-medium">
                <div className="flex flex-col items-center">
                  <ProgressRing
                    progress={streakData.targetCompletion}
                    color="hsl(var(--primary))"
                    label="Target"
                  />
                  <h3 className="font-heading font-semibold mt-4">Target Completion</h3>
                </div>
              </Card>

              <Card className="p-6 shadow-medium">
                <div className="flex flex-col items-center">
                  <ProgressRing
                    progress={streakData.focusSessions}
                    color="hsl(var(--accent))"
                    label="Focus"
                  />
                  <h3 className="font-heading font-semibold mt-4">Focus Sessions</h3>
                </div>
              </Card>

              <Card className="p-6 shadow-medium">
                <div className="flex flex-col items-center">
                  <ProgressRing
                    progress={streakData.consistency}
                    color="hsl(174 65% 55%)"
                    label="Streak"
                  />
                  <h3 className="font-heading font-semibold mt-4">Consistency</h3>
                </div>
              </Card>
            </div>

            {/* Encouragement Section */}
            <Card className="p-6 shadow-medium">
              <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-accent" />
                Encourage Student
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="comments">Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Add encouraging comments..."
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                  />
                </div>
                <Button variant="gradient" onClick={saveComments}>
                  Send Comments
                </Button>
              </div>
            </Card>

            {/* Reward Badges */}
            <Card className="p-6 shadow-medium">
              <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                Award Badge
              </h2>
              <div className="space-y-4">
                <Select value={selectedBadge} onValueChange={setSelectedBadge}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a badge" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBadges.map(badge => (
                      <SelectItem key={badge.id} value={badge.id}>
                        {badge.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="gradient" onClick={awardBadge} disabled={!selectedBadge}>
                  Award Badge
                </Button>
              </div>
            </Card>
          </>
        )}

        {!selectedStudent && (
          <Card className="p-12 text-center shadow-medium">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Select a student to view their streak reports</p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;