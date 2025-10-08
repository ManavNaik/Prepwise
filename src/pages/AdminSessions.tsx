// New AdminSessions.tsx (Admin-side)
import { useState } from "react";

// import { Video, Plus, Edit, Trash2, Clock, Link as LinkIcon, User } from "lucide-react";
import { Video, Plus, Edit, Trash2, Calendar as CalendarIcon, Clock, Link as LinkIcon, User } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import AdminNavigation from "@/components/AdminNavigation";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Session {
  id: string;
  title: string;
  instructor: string;
  date: Date;
  time: string;
  type: "live" | "recorded";
  link: string;
  description: string;
  platform: "zoom" | "youtube";
}

const mockSessions: Session[] = [
  {
    id: "1",
    title: "GST Updates and Compliance",
    instructor: "CA Rahul Sharma",
    date: new Date(),
    time: "6:00 PM - 7:30 PM",
    type: "live",
    link: "https://zoom.us/j/123456789",
    description: "Live session on latest GST changes",
    platform: "zoom",
  },
  {
    id: "2",
    title: "Advanced Auditing Techniques",
    instructor: "CA Priya Patel",
    date: new Date(Date.now() - 86400000),
    time: "Recorded",
    type: "recorded",
    link: "https://youtube.com/watch?v=abc123",
    description: "In-depth look at auditing standards",
    platform: "youtube",
  },
];

const AdminSessions = () => {
  const [sessions, setSessions] = useState<Session[]>(mockSessions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [newSession, setNewSession] = useState<Partial<Session>>({
    date: new Date(),
    type: "live",
    platform: "zoom",
  });
  const { toast } = useToast();

  const addOrUpdateSession = () => {
    if (!newSession.title || !newSession.instructor || !newSession.link) {
      toast({ title: "Missing Information", description: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    const session: Session = {
      id: editingSession ? editingSession.id : Date.now().toString(),
      title: newSession.title!,
      instructor: newSession.instructor!,
      date: newSession.date!,
      time: newSession.time || "",
      type: newSession.type!,
      link: newSession.link!,
      description: newSession.description || "",
      platform: newSession.platform!,
    };

    if (editingSession) {
      setSessions(sessions.map(s => s.id === session.id ? session : s));
      toast({ title: "Session Updated", description: "Session has been updated successfully" });
    } else {
      setSessions([...sessions, session]);
      toast({ title: "Session Added", description: "New session has been scheduled" });
    }

    setIsDialogOpen(false);
    setNewSession({ date: new Date(), type: "live", platform: "zoom" });
    setEditingSession(null);
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    toast({ title: "Session Deleted", description: "Session has been removed" });
  };

  const startEditing = (session: Session) => {
    setNewSession(session);
    setEditingSession(session);
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AdminNavigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3">
              <Video className="w-8 h-8 text-primary" />
              Manage Expert Sessions
            </h1>
            <p className="text-muted-foreground mt-2">Schedule and manage live and recorded sessions</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (open) {
              setEditingSession(null);
              setNewSession({ date: new Date(), type: "live", platform: "zoom" });
            }
          }}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add New Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSession ? "Edit Session" : "Add New Session"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newSession.title || ""}
                    onChange={e => setNewSession({ ...newSession, title: e.target.value })}
                    placeholder="e.g., GST Updates"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor *</Label>
                  <Input
                    id="instructor"
                    value={newSession.instructor || ""}
                    onChange={e => setNewSession({ ...newSession, instructor: e.target.value })}
                    placeholder="e.g., CA Rahul Sharma"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newSession.date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newSession.date ? format(newSession.date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newSession.date}
                        onSelect={date => setNewSession({ ...newSession, date: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time (for live) / Duration (for recorded)</Label>
                  <Input
                    id="time"
                    value={newSession.time || ""}
                    onChange={e => setNewSession({ ...newSession, time: e.target.value })}
                    placeholder="e.g., 6:00 PM - 7:30 PM"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select 
                    value={newSession.type} 
                    onValueChange={(value: "live" | "recorded") => setNewSession({ ...newSession, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="live">Live</SelectItem>
                      <SelectItem value="recorded">Recorded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Platform</Label>
                  <Select 
                    value={newSession.platform} 
                    onValueChange={(value: "zoom" | "youtube") => setNewSession({ ...newSession, platform: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zoom">Zoom</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="link">Link / Upload *</Label>
                  {newSession.type === "recorded" ? (
                    <Input
                      id="link"
                      type="file"
                      onChange={e => setNewSession({ ...newSession, link: e.target.files?.[0]?.name || "" })}
                    />
                  ) : (
                    <Input
                      id="link"
                      value={newSession.link || ""}
                      onChange={e => setNewSession({ ...newSession, link: e.target.value })}
                      placeholder="e.g., https://zoom.us/j/123456789"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newSession.description || ""}
                    onChange={e => setNewSession({ ...newSession, description: e.target.value })}
                    placeholder="Session details..."
                  />
                </div>

                <Button variant="gradient" onClick={addOrUpdateSession} className="w-full">
                  {editingSession ? "Update Session" : "Add Session"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {sessions.map(session => (
            <Card key={session.id} className="p-6 shadow-medium">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-heading font-bold mb-2">{session.title}</h3>
                  <p className="text-muted-foreground mb-4">{session.description}</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {session.instructor}
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      {format(session.date, "MMMM d, yyyy")}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {session.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      {session.platform.charAt(0).toUpperCase() + session.platform.slice(1)}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 self-stretch md:self-auto">
                  <Button variant="outline" onClick={() => startEditing(session)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => deleteSession(session.id)}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {sessions.length === 0 && (
          <Card className="p-8 text-center">
            <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No sessions scheduled yet</p>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminSessions;