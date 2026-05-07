import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import { Link as RouterLink } from 'react-router-dom';
import { LinkIcon, BookOpen, BrainCircuit, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const { data: links = [], isLoading: loadingLinks } = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const res = await axiosInstance.get('/links');
      return res.data;
    },
  });

  const { data: qnas = [], isLoading: loadingQnas } = useQuery({
    queryKey: ['qnas'],
    queryFn: async () => {
      const res = await axiosInstance.get('/qna');
      return res.data;
    },
  });

  const isLoading = loadingLinks || loadingQnas;
  const needsRevisionCount = qnas.filter(q => q.confidence === 'needs-revision').length;

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Overview</h1>
          <p className="text-foreground/60 mt-1 text-sm">Welcome back! Here's a snapshot of your preparation progress.</p>
        </div>
        <div className="flex items-center gap-2 bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full text-sm font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse"></span>
          Ready to interview
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-green/10 via-purple-500/10 to-orange-500/10 rounded-3xl blur-3xl -z-10" />
        
        <div className="glass rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
                <LinkIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Saved Links</p>
                <h3 className="text-xl font-bold text-foreground">{links.length}</h3>
              </div>
            </div>
            <RouterLink to="/links" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors mt-auto pt-4 border-t border-border/50">
              Manage links <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </RouterLink>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Answer Bank</p>
                <h3 className="text-xl font-bold text-foreground">{qnas.length}</h3>
              </div>
            </div>
            <RouterLink to="/answers" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-500 hover:text-purple-600 transition-colors mt-auto pt-4 border-t border-border/50">
              View Q&As <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </RouterLink>
          </div>
        </div>

        <div className="glass rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">Needs Revision</p>
                <h3 className="text-xl font-bold text-foreground">{needsRevisionCount}</h3>
              </div>
            </div>
            <RouterLink to="/revise" className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors mt-auto pt-4 border-t border-border/50">
              Start revising <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </RouterLink>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-foreground mb-4 pl-1 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <RouterLink 
            to="/links" 
            className="glass-panel p-5 rounded-2xl flex items-center group hover:bg-white/50 dark:hover:bg-black/40 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 group-hover:text-foreground group-hover:scale-110 mr-4 transition-all shadow-sm">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground text-base">Save a new link</h4>
              <p className="text-foreground/60 text-xs mt-0.5">Bookmark important resources</p>
            </div>
            <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </RouterLink>

          <RouterLink 
            to="/answers" 
            className="glass-panel p-5 rounded-2xl flex items-center group hover:bg-white/50 dark:hover:bg-black/40 transition-colors cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 group-hover:text-foreground group-hover:scale-110 mr-4 transition-all shadow-sm">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-foreground text-base">Add to Answer Bank</h4>
              <p className="text-foreground/60 text-xs mt-0.5">Expand your knowledge base</p>
            </div>
            <ArrowRight className="w-4 h-4 text-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
          </RouterLink>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
