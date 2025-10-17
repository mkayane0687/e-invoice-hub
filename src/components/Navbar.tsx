import { Link, useLocation } from "react-router-dom";
import { FileText, Search, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/upload-invoice", label: "Upload Invoice", icon: FileText },
    { to: "/search-invoice", label: "Search Invoice", icon: Search },
  ];

  return (
    <nav className="border-b border-border bg-card shadow-soft">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="h-9 w-9 rounded-lg bg-gradient-primary flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              E-Invoice Portal
            </span>
          </Link>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to || 
                (item.to !== "/" && location.pathname.startsWith(item.to));
              
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
