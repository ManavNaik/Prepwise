// New Sessions.tsx (Student-side)
import { useState } from "react";
import { Video, Calendar, Clock, User, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import { format } from "date-fns";

interface Session {
  id: string;
  title: string;
  instructor: string;
  date: Date;
  time: string;
  type: "live" | "recorded";
  link: string;
  description: string;
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
  },
  {
    id: "3",
    title: "Tax Planning Strategies",
    instructor: "CA Amit Kumar",
    date: new Date(Date.now() + 86400000),
    time: "4:00 PM - 5:30 PM",
    type: "live",
    link: "https://zoom.us/j/987654321",
    description: "Expert tips on tax planning",
  },
];

const Sessions = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const upcoming = mockSessions.filter(s => s.type === "live" && s.date >= new Date());
  const recorded = mockSessions.filter(s => s.type === "recorded");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center justify-center gap-3">
            <Video className="w-8 h-8 text-primary" />
            Expert Sessions
          </h1>
          <p className="text-muted-foreground mt-2">Access live and recorded sessions from top CA professionals</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="upcoming">Upcoming Live</TabsTrigger>
            <TabsTrigger value="recorded">Recorded</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4">
            {upcoming.length === 0 ? (
              <Card className="p-8 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No upcoming sessions scheduled</p>
              </Card>
            ) : (
              upcoming.map(session => (
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
                          <Calendar className="w-4 h-4" />
                          {format(session.date, "MMMM d, yyyy")}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {session.time}
                        </div>
                      </div>
                    </div>
                    <Button variant="gradient" asChild>
                      <a href={session.link} target="_blank" rel="noopener noreferrer">
                        Join Live
                      </a>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="recorded" className="space-y-4">
            {recorded.length === 0 ? (
              <Card className="p-8 text-center">
                <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No recorded sessions available</p>
              </Card>
            ) : (
              recorded.map(session => (
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
                          <Calendar className="w-4 h-4" />
                          {format(session.date, "MMMM d, yyyy")}
                        </div>
                      </div>
                    </div>
                    <Button variant="secondary" asChild>
                      <a href={session.link} target="_blank" rel="noopener noreferrer">
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Watch Recording
                      </a>
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Sessions;