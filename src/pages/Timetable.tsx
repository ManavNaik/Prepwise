import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, BookOpen, Trash2, CheckCircle2, Circle, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import Navigation from "@/components/Navigation";

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  subject: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  time?: string;
}

const Timetable = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete AS-1 Chapter",
      description: "Study Disclosure of Accounting Policies",
      date: new Date(),
      subject: "Financial Accounting",
      priority: "high",
      completed: false,
      time: "9:00 AM - 11:00 AM"
    },
    {
      id: "2",
      title: "Practice Questions",
      description: "Solve 20 questions from Cost Accounting",
      date: new Date(),
      subject: "Cost Accounting",
      priority: "medium",
      completed: true,
      time: "2:00 PM - 4:00 PM"
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    date: selectedDate,
    priority: "medium",
    completed: false
  });
  const { toast } = useToast();

  // Mock timetable data
  const subjects = [
    { id: 1, name: "Financial Accounting", color: "from-blue-500 to-blue-600" },
    { id: 2, name: "Cost Accounting", color: "from-purple-500 to-purple-600" },
    { id: 3, name: "Taxation", color: "from-orange-500 to-orange-600" },
    { id: 4, name: "Auditing", color: "from-teal-500 to-teal-600" },
  ];

  const addTask = () => {
    if (!newTask.title || !newTask.subject) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title!,
      description: newTask.description || "",
      date: newTask.date || selectedDate,
      subject: newTask.subject!,
      priority: newTask.priority || "medium",
      completed: false,
      time: newTask.time
    };

    setTasks([...tasks, task]);
    setIsDialogOpen(false);
    setNewTask({
      date: selectedDate,
      priority: "medium",
      completed: false
    });
    
    toast({
      title: "Task Added",
      description: "Your study task has been added successfully"
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({
      title: "Task Deleted",
      description: "Task has been removed from your schedule"
    });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      format(task.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const getTasksForSelectedDate = () => getTasksForDate(selectedDate);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "low": return "text-green-500 bg-green-500/10 border-green-500/20";
      default: return "text-muted-foreground bg-secondary";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-primary" />
              Study Timetable
            </h1>
            <p className="text-muted-foreground mt-2">Plan your study schedule and track progress</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="lg">
                <Plus className="w-5 h-5" />
                Add New Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Study Task</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Complete Chapter 5"
                    value={newTask.title || ""}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={newTask.subject} onValueChange={(value) => setNewTask({ ...newTask, subject: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.name}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add notes or details about this task..."
                    value={newTask.description || ""}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value: any) => setNewTask({ ...newTask, priority: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time (Optional)</Label>
                    <Input
                      id="time"
                      placeholder="9:00 AM - 11:00 AM"
                      value={newTask.time || ""}
                      onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Selected Date: {format(newTask.date || selectedDate, "PPP")}</Label>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="gradient" onClick={addTask}>
                  Add Task
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Calendar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <Card className="p-6 shadow-medium lg:col-span-2">
            <h2 className="text-xl font-heading font-bold mb-4">Calendar</h2>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date) {
                    setSelectedDate(date);
                    setNewTask({ ...newTask, date });
                  }
                }}
                className="rounded-md border pointer-events-auto"
                modifiers={{
                  hasTask: tasks.map(task => task.date)
                }}
                modifiersClassNames={{
                  hasTask: "bg-primary/20 font-bold"
                }}
              />
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6 shadow-medium">
            <h2 className="text-xl font-heading font-bold mb-4">Overview</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Tasks</p>
                    <p className="text-2xl font-heading font-bold text-primary">{tasks.length}</p>
                  </div>
                  <Target className="w-8 h-8 text-primary opacity-50" />
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-2xl font-heading font-bold text-green-600">
                      {tasks.filter(t => t.completed).length}
                    </p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-green-600 opacity-50" />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-heading font-bold text-orange-600">
                      {tasks.filter(t => !t.completed).length}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600 opacity-50" />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gradient-card">
                <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-primary transition-all"
                      style={{ 
                        width: `${tasks.length ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold">
                    {tasks.length ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Subjects Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => (
            <Card
              key={subject.id}
              className="p-5 hover:shadow-strong transition-all cursor-pointer border-none overflow-hidden relative group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              <div className="relative">
                <BookOpen className="w-6 h-6 mb-3 text-primary" />
                <h3 className="font-heading font-semibold mb-1">{subject.name}</h3>
                <p className="text-sm text-muted-foreground">12 chapters</p>
                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${subject.color} w-2/3`}></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">67% complete</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Tasks for Selected Date */}
        <Card className="p-6 shadow-medium">
          <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Tasks for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          
          {getTasksForSelectedDate().length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground">No tasks scheduled for this date</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsDialogOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {getTasksForSelectedDate().map((task) => (
                <div
                  key={task.id}
                  className={`p-5 rounded-lg border transition-all ${
                    task.completed
                      ? "bg-primary/5 border-primary/20 opacity-75"
                      : "bg-gradient-to-r from-card to-secondary hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTaskComplete(task.id)}
                      className="mt-1 text-primary hover:scale-110 transition-transform"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className={`font-heading font-semibold ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteTask(task.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-sm">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <BookOpen className="w-4 h-4" />
                          {task.subject}
                        </span>
                        {task.time && (
                          <span className="inline-flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            {task.time}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* All Subjects Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => {
            const subjectTasks = tasks.filter(t => t.subject === subject.name);
            const completedTasks = subjectTasks.filter(t => t.completed).length;
            const completionRate = subjectTasks.length ? (completedTasks / subjectTasks.length) * 100 : 0;
            
            return (
              <Card
                key={subject.id}
                className="p-5 hover:shadow-strong transition-all cursor-pointer border-none overflow-hidden relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                <div className="relative">
                  <BookOpen className="w-6 h-6 mb-3 text-primary" />
                  <h3 className="font-heading font-semibold mb-1">{subject.name}</h3>
                  <p className="text-sm text-muted-foreground">{subjectTasks.length} tasks</p>
                  <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${subject.color} transition-all`}
                      style={{ width: `${completionRate}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{Math.round(completionRate)}% complete</p>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Timetable;
