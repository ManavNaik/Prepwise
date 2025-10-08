// Updated Dashboard.tsx (Student-side)
import { Target, Calendar, Flame, Trophy, TrendingUp, Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProgressRing from "@/components/ProgressRing";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const Dashboard = () => {
  // Mock data
  const streakData = {
    current: 7,
    longest: 12,
    targetCompletion: 85,
    focusSessions: 75,
    consistency: 90,
  };

  const todayTasks = [
    { id: 1, subject: "Financial Accounting", chapter: "Accounting Standards", completed: true },
    { id: 2, subject: "Cost Accounting", chapter: "Process Costing", completed: true },
    { id: 3, subject: "Taxation", chapter: "Income Tax Basics", completed: false },
    { id: 4, subject: "Auditing", chapter: "Internal Controls", completed: false },
  ];

  const upcomingSessions = [
    { id: 1, title: "GST Live Session", time: "Today, 6:00 PM", instructor: "CA Rahul Sharma" },
    { id: 2, title: "Audit Q&A", time: "Tomorrow, 4:00 PM", instructor: "CA Priya Patel" },
  ];

  const achievements = [
    { id: 1, name: "7-Day Streak", unlocked: true },
    { id: 2, name: "Focus Master", unlocked: false },
  ];

  const mockNotifications = [
    { id: 1, type: "motivational", message: "Great job on your 7-day streak! Keep it up!", date: "Now" },
    { id: 2, type: "session", message: "New live session: GST Updates starting in 1 hour", date: "1h ago" },
    { id: 3, type: "motivational", message: "You've completed 85% of your targets this week. Almost there!", date: "2h ago" },
    { id: 4, type: "session", message: "New recorded session available: Advanced Auditing", date: "Yesterday" },
  ];

  const { toast } = useToast();

  useEffect(() => {
    // Show motivational toasts based on activity
    if (streakData.current > 0) {
      toast({
        title: "Streak Alert",
        description: `You're on a ${streakData.current}-day streak! Keep going!`,
      });
    }

    // Show session notifications
    mockNotifications.filter(n => n.type === "session").forEach(n => {
      toast({
        title: "New Session",
        description: n.message,
      });
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">Welcome back, Student! 👋</h1>
            <p className="text-muted-foreground mt-2">Here's your progress summary for today</p>
          </div>
          <div className="flex gap-3">
            <Link to="/timetable">
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Timetable
              </Button>
            </Link>
            <Link to="/focus">
              <Button variant="gradient">
                <Target className="w-4 h-4 mr-2" />
                Start Focus
              </Button>
            </Link>
          </div>
        </div>

        {/* Notifications */}
        <Card className="p-6 shadow-medium">
          <h3 className="text-xl font-heading font-bold flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h3>
          <ScrollArea className="h-[200px]">
            <div className="space-y-3">
              {mockNotifications.map(notif => (
                <div key={notif.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary">
                  <Bell className="w-5 h-5 mt-1 text-accent" />
                  <div className="flex-1">
                    <p className="text-sm">{notif.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notif.date}</p>
                  </div>
                  <Badge variant={notif.type === "motivational" ? "default" : "secondary"}>
                    {notif.type.charAt(0).toUpperCase() + notif.type.slice(1)}
                  </Badge>
                </div>
              ))}
            </div>
          </ScrollArea>
          <Button variant="outline" className="w-full mt-4">
            View All Notifications
          </Button>
        </Card>

        {/* Streak Card */}
        <Card className="p-6 md:p-8 shadow-strong gradient-card border-none">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold">Current Streak</h2>
              <p className="text-muted-foreground">Keep it going!</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-around gap-8">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-heading font-bold gradient-hero bg-clip-text text-transparent">
                {streakData.current}
              </div>
              <p className="text-muted-foreground mt-2">Days Streak</p>
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
          <Card className="p-6 shadow-medium hover:shadow-strong transition-shadow">
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={streakData.targetCompletion}
                color="hsl(var(--primary))"
                label="Target"
              />
              <h3 className="font-heading font-semibold mt-4">Target Completion</h3>
              <p className="text-sm text-muted-foreground mt-1">Daily goals achieved</p>
            </div>
          </Card>

          <Card className="p-6 shadow-medium hover:shadow-strong transition-shadow">
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={streakData.focusSessions}
                color="hsl(var(--accent))"
                label="Focus"
              />
              <h3 className="font-heading font-semibold mt-4">Focus Sessions</h3>
              <p className="text-sm text-muted-foreground mt-1">Time spent studying</p>
            </div>
          </Card>

          <Card className="p-6 shadow-medium hover:shadow-strong transition-shadow">
            <div className="flex flex-col items-center">
              <ProgressRing
                progress={streakData.consistency}
                color="hsl(174 65% 55%)"
                label="Streak"
              />
              <h3 className="font-heading font-semibold mt-4">Consistency</h3>
              <p className="text-sm text-muted-foreground mt-1">Weekly consistency</p>
            </div>
          </Card>
        </div>

        {/* Today's Tasks & Upcoming Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Tasks */}
          <Card className="p-6 shadow-medium">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Today's Tasks
              </h3>
              <span className="text-sm text-muted-foreground">
                {todayTasks.filter(t => t.completed).length}/{todayTasks.length} completed
              </span>
            </div>
            
            <div className="space-y-3">
              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border transition-all ${
                    task.completed
                      ? "bg-primary/5 border-primary/20"
                      : "bg-secondary hover:bg-secondary/80"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      task.completed 
                        ? "bg-primary border-primary" 
                        : "border-muted-foreground"
                    }`}>
                      {task.completed && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.subject}
                      </p>
                      <p className="text-sm text-muted-foreground">{task.chapter}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="p-6 shadow-medium">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                Upcoming Sessions
              </h3>
              <Link to="/sessions">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {upcomingSessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 hover:border-accent/40 transition-all"
                >
                  <h4 className="font-semibold">{session.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{session.time}</p>
                  <p className="text-sm text-accent mt-2">By {session.instructor}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="p-6 shadow-medium">
          <h3 className="text-xl font-heading font-bold flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-primary" />
            Achievements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {achievements.map(ach => (
              <div 
                key={ach.id} 
                className={`p-4 rounded-lg border ${ach.unlocked ? "bg-primary/10 border-primary/20" : "bg-secondary"}`}
              >
                <h4 className={`font-semibold ${ach.unlocked ? "" : "text-muted-foreground"}`}>
                  {ach.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {ach.unlocked ? "Unlocked" : "Locked"}
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-6 bg-accent/10 border-accent/20">
          <h3 className="font-heading font-semibold mb-3 text-accent">💡 Study Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Maintain your streak by completing daily tasks</li>
            <li>• Aim for 100% in all rings for bonus achievements</li>
            <li>• Take short breaks to maintain focus</li>
            <li>• Review weak areas regularly</li>
          </ul>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;