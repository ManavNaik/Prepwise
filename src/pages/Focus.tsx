// Updated Focus.tsx (Student-side)
import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Target, Settings, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";


interface Session {
  id: string;
  date: Date;
  duration: number; // minutes studied
  completed: boolean;
  distractions: number;
}

const Focus = () => {
  const [initialTime, setInitialTime] = useState(45); // minutes
  const [time, setTime] = useState(45 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [distractions, setDistractions] = useState(0);
  const [history, setHistory] = useState<Session[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      handleSessionEnd(true);
    }

    return () => clearInterval(interval);
  }, [isRunning, time]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        setIsRunning(false);
        setDistractions(prev => prev + 1);
        toast({
          title: "Session Paused",
          description: "Focus session paused due to tab switch",
          variant: "destructive"
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    handleSessionEnd(false);
  };

  const handleSessionEnd = (completed: boolean) => {
    const studiedSeconds = initialTime * 60 - time;
    const studiedMinutes = Math.round(studiedSeconds / 60);
    
    if (studiedMinutes > 0) { // Only save if some time was spent
      const newSession: Session = {
        id: Date.now().toString(),
        date: new Date(),
        duration: studiedMinutes,
        completed,
        distractions,
      };
      setHistory(prev => [...prev, newSession]);
    }

    setIsRunning(false);
    setTime(initialTime * 60);
    setDistractions(0);
    setSessions(prev => prev + (completed ? 1 : 0));
  };

  const updateDuration = (minutes: number) => {
    if (minutes > 0) {
      setInitialTime(minutes);
      setTime(minutes * 60);
      setIsSettingsOpen(false);
      toast({
        title: "Duration Updated",
        description: `Focus session set to ${minutes} minutes`
      });
    }
  };

  const progress = ((initialTime * 60 - time) / (initialTime * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center justify-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Focus Session
          </h1>
          <p className="text-muted-foreground mt-2">Stay focused and build your study streak</p>
        </div>

        {/* Timer Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 md:p-12 shadow-strong gradient-card border-none">
            {/* Settings Button */}
            <div className="flex justify-end mb-4">
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[400px]">
                  <DialogHeader>
                    <DialogTitle>Session Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Session Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        max="120"
                        defaultValue={initialTime}
                        onChange={(e) => updateDuration(parseInt(e.target.value))}
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* CA Logo Animation */}
            <div className="flex justify-center mb-8">
              <div className="relative w-48 h-48">
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="hsl(var(--muted))"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={552.64}
                    strokeDashoffset={552.64 - (552.64 * progress) / 100}
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" />
                      <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                  </defs>
                </svg>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`text-center ${isRunning ? "animate-pulse-glow" : ""}`}>
                    <div className="text-6xl font-heading font-bold gradient-hero bg-clip-text text-transparent mb-2">
                      CA
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {isRunning ? "Focusing..." : "Ready to start"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Display */}
            <div className="text-center mb-8">
              <div className="text-6xl md:text-7xl font-heading font-bold mb-4">
                {formatTime(time)}
              </div>
              <div className="text-muted-foreground">
                {isRunning ? "Keep your focus!" : "Press play to begin"}
              </div>
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              <Button
                onClick={handlePlayPause}
                variant={isRunning ? "secondary" : "gradient"}
                size="lg"
                className="min-w-32"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </Button>
              
              <Button onClick={handleReset} variant="outline" size="lg">
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </Card>
        </div>

        {/* Session Stats */}
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4">
          <Card className="p-5 shadow-soft text-center">
            <div className="text-3xl font-heading font-bold text-primary">{sessions}</div>
            <p className="text-sm text-muted-foreground mt-1">Completed Today</p>
          </Card>
          <Card className="p-5 shadow-soft text-center">
            <div className="text-3xl font-heading font-bold text-accent">12</div>
            <p className="text-sm text-muted-foreground mt-1">This Week</p>
          </Card>
          <Card className="p-5 shadow-soft text-center">
            <div className="text-3xl font-heading font-bold gradient-hero bg-clip-text text-transparent">45</div>
            <p className="text-sm text-muted-foreground mt-1">Total Completed</p>
          </Card>
        </div>

        {/* Session History */}
        <Card className="max-w-2xl mx-auto p-6 shadow-medium">
          <h2 className="text-xl font-heading font-bold mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Session History
          </h2>
          {history.length === 0 ? (
            <p className="text-center text-muted-foreground">No sessions completed yet</p>
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

        {/* Tips */}
        <Card className="max-w-2xl mx-auto p-6 bg-accent/10 border-accent/20">
          <h3 className="font-heading font-semibold mb-3 text-accent">💡 Focus Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Keep your phone in another room</li>
            <li>• Take a 5-minute break every 45 minutes</li>
            <li>• Stay hydrated during study sessions</li>
            <li>• Session will pause automatically if you switch tabs</li>
          </ul>
        </Card>
      </main>
    </div>
  );
};

export default Focus;