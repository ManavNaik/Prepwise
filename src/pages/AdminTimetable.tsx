// New AdminTimetable.tsx (Admin-side)
import { useState } from "react";
import { Users, Calendar, MessageSquare, Check, X, BarChart2, AlertTriangle } from "lucide-react";
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

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  subject: string;
  chapter?: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  time?: string;
  status: "pending" | "approved" | "disapproved";
  comments?: string;
}

interface Report {
  progress: number;
  weakAreas: string[];
}

const mockStudents: Student[] = [
  { id: "1", name: "John Doe", level: "Intermediate" },
  { id: "2", name: "Jane Smith", level: "Final" },
];

const mockTasks: Record<string, Task[]> = {
  "1": [
    {
      id: "1",
      title: "Complete AS-1 Chapter",
      description: "Study Disclosure of Accounting Policies",
      date: new Date(),
      subject: "Financial Accounting",
      chapter: "AS-1 Disclosure",
      priority: "high",
      completed: false,
      time: "9:00 AM - 11:00 AM",
      status: "pending",
    },
    // Add more mock tasks
  ],
  "2": [
    // Mock tasks for other students
  ],
};

const mockReports: Record<string, Report> = {
  "1": { progress: 65, weakAreas: ["Cost Accounting", "Taxation"] },
  "2": { progress: 85, weakAreas: ["Strategic Management"] },
};

const AdminTimetable = () => {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleStudentChange = (value: string) => {
    setSelectedStudent(value);
    setTasks(mockTasks[value] || []);
    setComments({});
  };

  const approveTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: "approved" } : t));
    toast({ title: "Schedule Approved", description: "Task has been approved" });
  };

  const disapproveTask = (taskId: string) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: "disapproved" } : t));
    toast({ title: "Schedule Disapproved", description: "Task has been disapproved" });
  };

  const saveComment = (taskId: string) => {
    // In real app, save to DB
    toast({ title: "Comment Saved", description: "Your comment has been added" });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-green-500 bg-green-500/10 border-green-500/20";
      case "disapproved": return "text-red-500 bg-red-500/10 border-red-500/20";
      default: return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    }
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
              Admin Timetable Management
            </h1>
            <p className="text-muted-foreground mt-2">View and manage student timetables</p>
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
            {/* Aggregated Reports */}
            <Card className="p-6 shadow-medium">
              <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-primary" />
                Student Reports
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="font-semibold">Overall Progress</p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-primary transition-all"
                        style={{ width: `${mockReports[selectedStudent].progress}%` }}
                      />
                    </div>
                    <span className="text-lg font-semibold">{mockReports[selectedStudent].progress}%</span>
                  </div>
                </div>
                <div>
                  <p className="font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    Weak Areas
                  </p>
                  <ul className="list-disc pl-5 text-muted-foreground">
                    {mockReports[selectedStudent].weakAreas.map(area => (
                      <li key={area}>{area}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Student Timetable */}
            <Card className="p-6 shadow-medium">
              <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Student's Timetable
              </h2>
              
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 rounded-lg border bg-gradient-to-r from-card to-secondary"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-heading font-semibold">
                            {task.title} {task.chapter ? `- ${task.chapter}` : ""}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                            {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                          <span>{task.subject}</span>
                          <span>{format(task.date, "MMMM d, yyyy")}</span>
                          {task.time && <span>{task.time}</span>}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`comment-${task.id}`}>Comments / Suggestions</Label>
                          <Textarea
                            id={`comment-${task.id}`}
                            placeholder="Add comments or suggestions..."
                            value={comments[task.id] || task.comments || ""}
                            onChange={(e) => setComments({ ...comments, [task.id]: e.target.value })}
                          />
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Button variant="gradient" onClick={() => saveComment(task.id)}>
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Save Comment
                          </Button>
                          <Button variant="outline" onClick={() => approveTask(task.id)}>
                            <Check className="w-4 h-4 mr-2" />
                            Approve
                          </Button>
                          <Button variant="destructive" onClick={() => disapproveTask(task.id)}>
                            <X className="w-4 h-4 mr-2" />
                            Disapprove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {!selectedStudent && (
          <Card className="p-12 text-center shadow-medium">
            <Users className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">Select a student to view their timetable and reports</p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminTimetable;