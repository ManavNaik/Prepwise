import { GraduationCap, Calendar, Target, Trophy, Flame, BookOpen, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: Calendar,
      title: "Smart Timetable Builder",
      description: "Create personalized study schedules with auto-generated plans tailored to your CA exam preparation.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: Target,
      title: "Focus Sessions",
      description: "Stay distraction-free with animated focus timers and automatic tracking of your study sessions.",
      color: "from-primary to-primary-light",
    },
    {
      icon: Flame,
      title: "Streaks & Gamification",
      description: "Build consistency with daily streaks, achievement rings, and motivational rewards.",
      color: "from-accent to-accent-light",
    },
    {
      icon: TrendingUp,
      title: "Expert Sessions",
      description: "Access live sessions, recordings, and expert guidance from top CA professionals.",
      color: "from-purple-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navigation />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Your Personal Study Mentor</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-6">
            Master Your{" "}
            <span className="gradient-hero bg-clip-text text-transparent">
              CA Journey
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Stay focused, build streaks, and ace your exams with smart study planning, 
            distraction control, and personalized guidance designed for CA students.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button variant="gradient" size="lg" className="min-w-48">
                <GraduationCap className="w-5 h-5" />
                Get Started Free
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="min-w-48">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16 max-w-3xl mx-auto">
          <Card className="p-6 text-center shadow-medium hover:shadow-strong transition-all animate-float">
            <div className="text-4xl font-heading font-bold gradient-primary bg-clip-text text-transparent">
              10K+
            </div>
            <p className="text-sm text-muted-foreground mt-2">Active Students</p>
          </Card>
          <Card className="p-6 text-center shadow-medium hover:shadow-strong transition-all animate-float" style={{ animationDelay: "0.2s" }}>
            <div className="text-4xl font-heading font-bold gradient-accent bg-clip-text text-transparent">
              500K+
            </div>
            <p className="text-sm text-muted-foreground mt-2">Study Hours</p>
          </Card>
          <Card className="p-6 text-center shadow-medium hover:shadow-strong transition-all animate-float" style={{ animationDelay: "0.4s" }}>
            <div className="text-4xl font-heading font-bold text-primary">
              98%
            </div>
            <p className="text-sm text-muted-foreground mt-2">Success Rate</p>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed specifically for CA students to maximize productivity and maintain consistency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-6 hover:shadow-strong transition-all group border-none gradient-card"
            >
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-heading font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Simple, Yet Powerful
          </h2>
          <p className="text-muted-foreground">Get started in three easy steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { step: "01", title: "Create Your Plan", desc: "Build a personalized timetable with subjects and chapters" },
            { step: "02", title: "Stay Focused", desc: "Use focus sessions to eliminate distractions and track progress" },
            { step: "03", title: "Build Streaks", desc: "Maintain consistency and earn achievements as you progress" },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="text-6xl font-heading font-bold gradient-hero bg-clip-text text-transparent mb-4">
                {item.step}
              </div>
              <h3 className="text-xl font-heading font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="p-12 text-center gradient-hero border-none shadow-strong max-w-4xl mx-auto">
          <BookOpen className="w-16 h-16 mx-auto mb-6 text-white" />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Ready to Transform Your Study Habits?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of CA students who are already using our platform to stay motivated, 
            focused, and on track for exam success.
          </p>
          <Link to="/auth">
            <Button variant="secondary" size="lg" className="min-w-48">
              Start Your Journey
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-heading text-lg font-bold">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span>Prepwise </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Prepwise . All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;