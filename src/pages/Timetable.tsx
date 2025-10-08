// Updated Timetable.tsx (Student-side)
import { useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock, BookOpen, Trash2, CheckCircle2, Circle, Target, Edit, Save, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { format, addDays } from "date-fns";
import Navigation from "@/components/Navigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

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
}

interface Chapter {
  id: string;
  name: string;
}

interface Subject {
  id: number;
  name: string;
  color: string;
  chapters: Chapter[];
}

const levels = ["Intermediate", "Final"];

const mockSubjects: Record<string, Subject[]> = {
  Intermediate: [
    { id: 1, name: "Financial Accounting", color: "from-blue-500 to-blue-600", chapters: [{ id: "1", name: "AS-1 Disclosure" }, { id: "2", name: "AS-2 Valuation" }] },
    { id: 2, name: "Cost Accounting", color: "from-purple-500 to-purple-600", chapters: [{ id: "1", name: "Process Costing" }, { id: "2", name: "Marginal Costing" }] },
    { id: 3, name: "Taxation", color: "from-orange-500 to-orange-600", chapters: [{ id: "1", name: "Income Tax" }, { id: "2", name: "GST Basics" }] },
    { id: 4, name: "Auditing", color: "from-teal-500 to-teal-600", chapters: [{ id: "1", name: "Internal Controls" }, { id: "2", name: "Audit Evidence" }] },
  ],
  Final: [
    { id: 5, name: "Advanced Accounting", color: "from-indigo-500 to-indigo-600", chapters: [{ id: "1", name: "Consolidation" }, { id: "2", name: "Amalgamation" }] },
    { id: 6, name: "Strategic Management", color: "from-green-500 to-green-600", chapters: [{ id: "1", name: "Business Strategy" }, { id: "2", name: "Corporate Strategy" }] },
  ],
};

const Timetable = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tasks, setTasks] = useState<Task[]>([
    // Initial mock tasks
    {
      id: "1",
      title: "Complete AS-1 Chapter",
      description: "Study Disclosure of Accounting Policies",
      date: new Date(),
      subject: "Financial Accounting",
      chapter: "AS-1 Disclosure",
      priority: "high",
      completed: false,
      time: "9:00 AM - 11:00 AM"
    },
    // ... (keep existing mock tasks)
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>({
    date: selectedDate,
    priority: "medium",
    completed: false
  });
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("Intermediate");
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedChapters, setSelectedChapters] = useState<Record<string, string[]>>({});
  const [studyTarget, setStudyTarget] = useState<{ type: "daily" | "weekly"; value: number }>({ type: "daily", value: 4 });
  const { toast } = useToast();

  const subjects = mockSubjects[selectedLevel] || [];

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
    setSelectedSubjects([]);
    setSelectedChapters({});
  };

  const toggleSubject = (subjectName: string) => {
    setSelectedSubjects(prev => 
      prev.includes(subjectName) ? prev.filter(s => s !== subjectName) : [...prev, subjectName]
    );
  };

  const toggleChapter = (subjectName: string, chapterId: string) => {
    setSelectedChapters(prev => {
      const chapters = prev[subjectName] || [];
      return {
        ...prev,
        [subjectName]: chapters.includes(chapterId) ? chapters.filter(c => c !== chapterId) : [...chapters, chapterId]
      };
    });
  };

  const generatePlan = () => {
    if (selectedSubjects.length === 0) {
      toast({ title: "Error", description: "Select at least one subject", variant: "destructive" });
      return;
    }

    const newTasks: Task[] = [];
    let currentDate = new Date();
    const chaptersToCover: { subject: string; chapter: string }[] = [];

    selectedSubjects.forEach(subject => {
      (selectedChapters[subject] || []).forEach(chapterId => {
        const chapter = subjects.find(s => s.name === subject)?.chapters.find(c => c.id === chapterId);
        if (chapter) chaptersToCover.push({ subject, chapter: chapter.name });
      });
    });

    // Simple mock generation: distribute chapters over days/weeks
    const days = studyTarget.type === "daily" ? studyTarget.value : studyTarget.value * 7;
    chaptersToCover.forEach((item, index) => {
      const taskDate = addDays(currentDate, index % days);
      newTasks.push({
        id: Date.now().toString() + index,
        title: `Study ${item.chapter}`,
        description: `Complete chapter in ${item.subject}`,
        date: taskDate,
        subject: item.subject,
        chapter: item.chapter,
        priority: "medium",
        completed: false,
        time: "9:00 AM - 11:00 AM"
      });
    });

    setTasks([...tasks, ...newTasks]);
    setIsGeneratorOpen(false);
    toast({ title: "Plan Generated", description: `${newTasks.length} tasks added to your timetable` });
  };

  const addOrUpdateTask = () => {
    if (!newTask.title || !newTask.subject) {
      toast({ title: "Missing Information", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...newTask } as Task : t));
      toast({ title: "Task Updated", description: "Your study task has been updated" });
    } else {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title!,
        description: newTask.description || "",
        date: newTask.date || selectedDate,
        subject: newTask.subject!,
        chapter: newTask.chapter,
        priority: newTask.priority || "medium",
        completed: false,
        time: newTask.time
      };
      setTasks([...tasks, task]);
      toast({ title: "Task Added", description: "Your study task has been added successfully" });
    }

    setIsDialogOpen(false);
    setNewTask({ date: selectedDate, priority: "medium", completed: false });
    setEditingTask(null);
  };

  const startEditing = (task: Task) => {
    setNewTask(task);
    setEditingTask(task);
    setIsDialogOpen(true);
  };

  const rescheduleTask = (taskId: string, newDate: Date) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, date: newDate } : task
    ));
    toast({ title: "Task Rescheduled", description: "Task date has been updated" });
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast({ title: "Task Deleted", description: "Task has been removed from your schedule" });
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      format(task.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500 bg-red-500/10 border-red-500/20";
      case "medium": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      case "low": return "text-green-500 bg-green-500/10 border-green-500/20";
      default: return "text-muted-foreground bg-secondary";
    }
  };

  // Calculate overall progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overallProgress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-primary" />
              Smart Timetable Builder
            </h1>
            <p className="text-muted-foreground mt-2">Create and manage your personalized study plan</p>
          </div>
          
          <div className="flex gap-3">
            <Dialog open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen}>
              <DialogTrigger asChild>
                <Button variant="gradient" size="lg">
                  <Target className="w-5 h-5 mr-2" />
                  Generate Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Auto-Generate Study Plan</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Level</Label>
                    <Select value={selectedLevel} onValueChange={handleLevelChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {levels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Subjects & Chapters</Label>
                    <div className="space-y-4">
                      {subjects.map(subject => (
                        <div key={subject.id}>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={selectedSubjects.includes(subject.name)}
                              onChange={() => toggleSubject(subject.name)}
                            />
                            {subject.name}
                          </label>
                          {selectedSubjects.includes(subject.name) && (
                            <div className="ml-4 space-y-2 mt-2">
                              {subject.chapters.map(chapter => (
                                <label key={chapter.id} className="flex items-center gap-2 cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    checked={(selectedChapters[subject.name] || []).includes(chapter.id)}
                                    onChange={() => toggleChapter(subject.name, chapter.id)}
                                  />
                                  {chapter.name}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Study Target</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Select value={studyTarget.type} onValueChange={(v: "daily" | "weekly") => setStudyTarget({ ...studyTarget, type: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input 
                        type="number" 
                        value={studyTarget.value} 
                        onChange={e => setStudyTarget({ ...studyTarget, value: parseInt(e.target.value) })} 
                        placeholder="Hours"
                      />
                    </div>
                  </div>

                  <Button variant="gradient" onClick={generatePlan} className="w-full">
                    Generate Plan
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg">
                  <Plus className="w-5 h-5" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingTask ? "Edit Task" : "Add Study Task"}</DialogTitle>
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

                  {newTask.subject && (
                    <div className="space-y-2">
                      <Label htmlFor="chapter">Chapter</Label>
                      <Select value={newTask.chapter} onValueChange={(value) => setNewTask({ ...newTask, chapter: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.find(s => s.name === newTask.subject)?.chapters.map(chapter => (
                            <SelectItem key={chapter.id} value={chapter.name}>
                              {chapter.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

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
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !newTask.date && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.date ? format(newTask.date, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={newTask.date}
                          onSelect={(date) => setNewTask({ ...newTask, date: date || new Date() })}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <Button variant="gradient" onClick={addOrUpdateTask} className="w-full">
                    {editingTask ? "Update Task" : "Add Task"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Calendar View */}
        {/* <Card className="p-6 shadow-medium">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => setSelectedDate(date || new Date())}
            className="rounded-md border"
          />
        </Card> */}
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


        {/* Progress Tracking */}
        <Card className="p-6 shadow-medium">
          <h2 className="text-xl font-heading font-bold mb-4">Overall Progress</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-4 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <span className="text-lg font-semibold">{overallProgress}% Complete</span>
          </div>
        </Card>

        {/* Tasks for Selected Date */}
        <Card className="p-6 shadow-medium">
          <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            Tasks for {format(selectedDate, "MMMM d, yyyy")}
          </h2>
          
          {getTasksForDate(selectedDate).length === 0 ? (
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
              {getTasksForDate(selectedDate).map((task) => (
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
                          {task.title} {task.chapter ? `- ${task.chapter}` : ""}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-secondary"
                            onClick={() => startEditing(task)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-secondary"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={task.date}
                                onSelect={(date) => rescheduleTask(task.id, date || new Date())}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
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

        {/* Subjects Overview with Progress */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjects.map((subject) => {
            const subjectTasks = tasks.filter(t => t.subject === subject.name);
            const completed = subjectTasks.filter(t => t.completed).length;
            const progress = subjectTasks.length ? Math.round((completed / subjectTasks.length) * 100) : 0;
            
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
                      className={`h-full bg-gradient-to-r ${subject.color}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">{progress}% complete</p>
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