import { useState } from "react";
import { Calendar, Plus, Clock, BookOpen } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";

const Timetable = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock timetable data
  const subjects = [
    { id: 1, name: "Financial Accounting", color: "from-blue-500 to-blue-600" },
    { id: 2, name: "Cost Accounting", color: "from-purple-500 to-purple-600" },
    { id: 3, name: "Taxation", color: "from-orange-500 to-orange-600" },
    { id: 4, name: "Auditing", color: "from-teal-500 to-teal-600" },
  ];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const schedule = [
    { day: "Mon", subject: "Financial Accounting", chapter: "AS-1: Disclosure of Accounting Policies", time: "9:00 AM - 11:00 AM", completed: true },
    { day: "Mon", subject: "Cost Accounting", chapter: "Absorption Costing", time: "2:00 PM - 4:00 PM", completed: true },
    { day: "Tue", subject: "Taxation", chapter: "Income Tax Act Sections", time: "9:00 AM - 11:00 AM", completed: false },
    { day: "Tue", subject: "Auditing", chapter: "Audit Planning", time: "2:00 PM - 4:00 PM", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary" />
              Study Timetable
            </h1>
            <p className="text-muted-foreground mt-2">Plan your study schedule and track progress</p>
          </div>
          <Button variant="gradient" size="lg">
            <Plus className="w-5 h-5" />
            Add New Task
          </Button>
        </div>

        {/* Weekly Overview */}
        <Card className="p-6 shadow-medium">
          <h2 className="text-xl font-heading font-bold mb-4">This Week</h2>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={`p-3 rounded-lg text-center cursor-pointer transition-all ${
                  index === 0
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-secondary hover:bg-secondary/80"
                }`}
              >
                <div className="text-xs font-medium mb-1">{day}</div>
                <div className="text-lg font-heading font-bold">
                  {new Date(Date.now() + index * 86400000).getDate()}
                </div>
              </div>
            ))}
          </div>
        </Card>

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

        {/* Today's Schedule */}
        <Card className="p-6 shadow-medium">
          <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Today's Schedule
          </h2>
          
          <div className="space-y-4">
            {schedule.filter(s => s.day === "Mon").map((item, index) => (
              <div
                key={index}
                className={`p-5 rounded-lg border transition-all ${
                  item.completed
                    ? "bg-primary/5 border-primary/20"
                    : "bg-gradient-to-r from-card to-secondary hover:shadow-md"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`font-heading font-semibold ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                      {item.subject}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{item.chapter}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.completed 
                      ? "bg-primary/20 text-primary" 
                      : "bg-accent/20 text-accent"
                  }`}>
                    {item.completed ? "Completed" : "Pending"}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-5 shadow-soft">
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-primary">24</div>
              <p className="text-sm text-muted-foreground mt-1">Tasks This Week</p>
            </div>
          </Card>
          <Card className="p-5 shadow-soft">
            <div className="text-center">
              <div className="text-3xl font-heading font-bold text-accent">18</div>
              <p className="text-sm text-muted-foreground mt-1">Completed</p>
            </div>
          </Card>
          <Card className="p-5 shadow-soft">
            <div className="text-center">
              <div className="text-3xl font-heading font-bold gradient-hero bg-clip-text text-transparent">75%</div>
              <p className="text-sm text-muted-foreground mt-1">Completion Rate</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Timetable;
