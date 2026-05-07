import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  LayoutDashboard, 
  Link as LinkIcon, 
  BookOpen, 
  BrainCircuit, 
  LogOut, 
  Sun, 
  Moon,
  Menu,
  X,
  User as UserIcon
} from 'lucide-react';
import { cn } from '../utils/cn';

const Layout = () => {
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Links Vault', path: '/links', icon: LinkIcon },
    { name: 'Answer Bank', path: '/answers', icon: BookOpen },
    { name: 'Revise Mode', path: '/revise', icon: BrainCircuit },
  ];

  // Map path to a title
  const getPageTitle = () => {
    const item = navItems.find(i => i.path === location.pathname);
    return item ? item.name : 'PrepVault';
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-brand-green/30 relative">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[5%] w-[40%] h-[40%] bg-brand-green/20 rounded-full blur-[120px]" />
        <div className="absolute top-[60%] -left-[10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity cursor-pointer"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-4 left-4 z-50 w-64 glass-panel rounded-3xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-[120%]"
        )}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-border/50 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-green to-teal-500 flex items-center justify-center text-white font-extrabold text-sm shadow-lg shadow-brand-green/20">
              P
            </div>
            <span className="text-lg font-extrabold text-foreground tracking-tight">PrepVault</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 lg:hidden text-foreground/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group relative overflow-hidden text-sm",
                  isActive 
                    ? "text-brand-green bg-brand-green/10 font-bold shadow-sm" 
                    : "text-foreground/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground font-medium"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-green rounded-r-full" />
                )}
                <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-brand-green" : "text-foreground/50")} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border/50 bg-background/50 rounded-b-3xl shrink-0">
          <div className="flex items-center gap-2.5 px-3 py-2 mb-2 bg-card/50 rounded-xl border border-border/50">
            <div className="w-8 h-8 rounded-full bg-background border border-border/50 flex items-center justify-center text-foreground/60 shrink-0">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-foreground truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-foreground/60 truncate font-medium">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-3 py-2.5 w-full rounded-xl text-sm font-bold text-foreground/70 hover:bg-red-500/10 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative lg:ml-[17rem] bg-transparent">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-6 lg:px-8 shrink-0 z-10 relative">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl glass hover:bg-white/50 lg:hidden text-foreground/80 transition-all shadow-sm"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h2 className="text-base font-bold text-foreground hidden sm:block tracking-tight">
              {getPageTitle()}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass hover:bg-white/50 text-foreground/80 transition-all shadow-sm hover:scale-105"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 custom-scrollbar relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
