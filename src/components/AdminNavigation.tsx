import { Link, useLocation } from "react-router-dom";
import { GraduationCap, Calendar, Target, Trophy, LogOut, Video } from "lucide-react";
import { Button } from "./ui/button";

const AdminNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: "/admindashboard", label: "Dashboard", icon: Trophy },
    { path: "/admintimetable", label: "Timetables", icon: Calendar },
    { path: "/adminfocus", label: "Focus", icon: Target },
    { path: "/adminsessions", label: "Sessions", icon: Video }
  ];

  return (
    <nav className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/admindashboard" className="flex items-center gap-2 font-heading text-xl font-bold">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Prepwise Admin
            </span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md transition-all flex items-center gap-2 ${
                  isActive(link.path)
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <link.icon className="w-4 h-4" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>

          <Link to="/">
            <Button variant="gradient" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-1 pb-3 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap text-sm ${
                isActive(link.path)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <link.icon className="w-3.5 h-3.5" />
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;



// import { Link } from "react-router-dom";
// import { LogOut, LayoutDashboard, Calendar, Target, Video, User } from "lucide-react";
// import { GraduationCap, Menu } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const AdminNavigation = () => {
//   return (
//     <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex h-16 items-center justify-between">
//           {/* Logo */}
//           <Link to="/admindashboard" className="flex items-center gap-2 font-heading text-lg font-bold">
//             <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
//               <GraduationCap className="w-5 h-5 text-white" />
//             </div>
//             <span>Prepwise Admin</span>
//           </Link>

//           {/* Desktop Nav */}
//           <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
//             <Link
//               to="/admindashboard"
//               className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
//             >
//               <LayoutDashboard className="w-4 h-4" />
//               Dashboard
//             </Link>
//             <Link
//               to="/admintimetable"
//               className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
//             >
//               <Calendar className="w-4 h-4" />
//               Timetables
//             </Link>
//             <Link
//               to="/adminfocus"
//               className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
//             >
//               <Target className="w-4 h-4" />
//               Focus Sessions
//             </Link>
//             <Link
//               to="/adminsessions"
//               className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
//             >
//               <Video className="w-4 h-4" />
//               Sessions
//             </Link>
//           </nav>

//           {/* User Menu */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="ghost" size="icon" className="rounded-full">
//                 <User className="w-5 h-5" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem>
//                 <LogOut className="w-4 h-4 mr-2" />
//                 Logout
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>

//           {/* Mobile Nav */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild className="md:hidden">
//               <Button variant="ghost" size="icon">
//                 <Menu className="w-5 h-5" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="md:hidden">
//               <Link to="/admindashboard">
//                 <DropdownMenuItem>
//                   <LayoutDashboard className="w-4 h-4 mr-2" />
//                   Dashboard
//                 </DropdownMenuItem>
//               </Link>
//               <Link to="/admintimetable">
//                 <DropdownMenuItem>
//                   <Calendar className="w-4 h-4 mr-2" />
//                   Timetables
//                 </DropdownMenuItem>
//               </Link>
//               <Link to="/adminfocus">
//                 <DropdownMenuItem>
//                   <Target className="w-4 h-4 mr-2" />
//                   Focus Sessions
//                 </DropdownMenuItem>
//               </Link>
//               <Link to="/adminsessions">
//                 <DropdownMenuItem>
//                   <Video className="w-4 h-4 mr-2" />
//                   Sessions
//                 </DropdownMenuItem>
//               </Link>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default AdminNavigation;