
import { ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { 
  Clock, 
  Calendar, 
  ClipboardList, 
  UserCog, 
  LogOut, 
  BarChart2, 
  Settings,
  Menu, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
  to, 
  icon: Icon, 
  label, 
  active = false,
  onClick 
}) => {
  return (
    <li>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link 
              to={to} 
              onClick={onClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                active 
                  ? "bg-sidebar-accent text-white" 
                  : "text-gray-300 hover:bg-sidebar-accent/50 hover:text-white"
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </li>
  );
};

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = window.location.pathname;

  if (!user) {
    navigate("/login");
    return null;
  }

  const navItems = [
    { to: "/dashboard", icon: Clock, label: "Ponto" },
    { to: "/history", icon: Calendar, label: "Histórico" },
  ];

  if (isAdmin()) {
    navItems.push(
      { to: "/approve-edits", icon: ClipboardList, label: "Aprovações" },
      { to: "/users", icon: UserCog, label: "Usuários" },
      { to: "/reports", icon: BarChart2, label: "Relatórios" }
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const renderNav = () => (
    <nav className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      <div className="p-4 border-b border-sidebar-border">
        <h1 className="text-xl font-bold text-white">Ponto Digital</h1>
      </div>
      
      <div className="flex-grow p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem 
              key={item.to} 
              to={item.to} 
              icon={item.icon} 
              label={item.label}
              active={currentPath === item.to} 
              onClick={isMobile ? () => setIsOpen(false) : undefined}
            />
          ))}
        </ul>
      </div>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user?.name ? getInitials(user.name) : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">
                {user?.role === "admin" ? "Administrador" : "Funcionário"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-sidebar-accent text-white border-sidebar-border hover:bg-sidebar-accent/80"
            onClick={() => navigate("/settings")}
          >
            <Settings size={16} className="mr-2" />
            Perfil
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 bg-sidebar-accent text-white border-sidebar-border hover:bg-sidebar-accent/80"
            onClick={logout}
          >
            <LogOut size={16} className="mr-2" />
            Sair
          </Button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      {isMobile ? (
        <>
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="fixed top-4 left-4 z-50"
              >
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64 bg-sidebar">
              {renderNav()}
            </SheetContent>
          </Sheet>
        </>
      ) : (
        // Desktop sidebar
        <div className="w-64 h-screen hidden md:block">
          {renderNav()}
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="container py-6 px-4 md:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}
