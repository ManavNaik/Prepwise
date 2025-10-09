import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import Focus from "./pages/Focus";
import Auth from "./pages/Auth";
import Sessions from "./pages/Sessions";
import AdminTimetable from "./pages/AdminTimetable";
import AdminFocus from "./pages/AdminFocus";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSessions from "./pages/AdminSessions";
import AdminAuth from "./pages/AdminAuth";
import NotFound from "./pages/NotFound";

import AdminMasters from "./pages/AdminMasters";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/admintimetable" element={<AdminTimetable />} />
          <Route path="/adminfocus" element={<AdminFocus />} />
          <Route path="/admindashboard" element={<AdminDashboard />} />
          <Route path="/adminsessions" element={<AdminSessions />} />
          <Route path="/adminauth" element={<AdminAuth />} />
          
          <Route path="/adminmasters" element={<AdminMasters />} />
          
          <Route path="*" element={<NotFound />} />          
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;