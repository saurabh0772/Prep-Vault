import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import DefaultEditor from 'react-simple-wysiwyg';
import { Plus, Edit2, Trash2, ChevronDown, BrainCircuit, X, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { TOPICS } from '../constants/topics';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

const Answers = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQna, setEditingQna] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  
  // Filters
  const [topicFilter, setTopicFilter] = useState('All');
  const [confidenceFilter, setConfidenceFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [confidence, setConfidence] = useState('needs-revision');

  const { data: qnas = [], isLoading } = useQuery({
    queryKey: ['qnas'],
    queryFn: async () => {
      const res = await axiosInstance.get('/qna');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newQna) => axiosInstance.post('/qna', newQna),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qnas'] });
      toast.success('Q&A saved!');
      closeModal();
    },
    onError: () => toast.error('Failed to save Q&A')
  });

  const updateMutation = useMutation({
    mutationFn: (data) => axiosInstance.put(`/qna/${data.id}`, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qnas'] });
      toast.success('Q&A updated!');
      closeModal();
    },
    onError: () => toast.error('Failed to update Q&A')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/qna/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qnas'] });
      toast.success('Q&A deleted!');
    },
    onError: () => toast.error('Failed to delete Q&A')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer || answer.trim() === '') {
      toast.error('Answer is required');
      return;
    }

    if (editingQna) {
      updateMutation.mutate({
        id: editingQna._id,
        payload: { question, answer, topic, confidence }
      });
    } else {
      createMutation.mutate({ question, answer, topic, confidence });
    }
  };

  const openModal = (qna = null) => {
    if (qna) {
      setEditingQna(qna);
      setQuestion(qna.question);
      setAnswer(qna.answer);
      setTopic(qna.topic);
      setConfidence(qna.confidence);
    } else {
      setEditingQna(null);
      setQuestion('');
      setAnswer('');
      setTopic(TOPICS[0]);
      setConfidence('needs-revision');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingQna(null);
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredQnas = useMemo(() => {
    return qnas.filter((q) => {
      const matchTopic = topicFilter === 'All' || q.topic === topicFilter;
      const matchConfidence = confidenceFilter === 'All' || q.confidence === confidenceFilter;
      const matchSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
      return matchTopic && matchConfidence && matchSearch;
    });
  }, [qnas, topicFilter, confidenceFilter, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Answer Bank</h1>
          <p className="text-foreground/60 mt-1 text-sm">Your personal vault of interview answers.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/revise"
            className="px-5 py-2.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2 text-sm"
          >
            <BrainCircuit className="w-4 h-4" />
            Revise Mode
          </Link>
          <button
            onClick={() => openModal()}
            className="px-5 py-2.5 bg-brand-green hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Q&A
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-5 shadow-sm border border-border/50">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <label className="block text-xs font-bold mb-1.5 text-foreground/80 pl-1 uppercase tracking-wider">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-foreground/40">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-9 pr-4 py-2.5 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="md:w-48">
            <label className="block text-xs font-bold mb-1.5 text-foreground/80 pl-1 uppercase tracking-wider">Topic</label>
            <select
              className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm font-medium cursor-pointer"
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
            >
              <option value="All">All Topics</option>
              {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="md:w-48">
            <label className="block text-xs font-bold mb-1.5 text-foreground/80 pl-1 uppercase tracking-wider">Confidence Filter</label>
            <select
              className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm font-medium cursor-pointer"
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
            >
              <option value="All">All Levels</option>
              <option value="confident">Confident</option>
              <option value="needs-revision">Needs Revision</option>
            </select>
          </div>
        </div>
      </div>

      {filteredQnas.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border-dashed border-2 border-border/50 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-green">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">No Q&As found</h3>
          <p className="text-foreground/60 mb-6 text-sm max-w-sm mx-auto">Try adjusting your filters or add a new question to your bank.</p>
          {qnas.length === 0 && (
            <button
              onClick={() => openModal()}
              className="text-brand-green font-bold text-sm hover:text-teal-500 transition-colors"
            >
              + Add your first Q&A
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredQnas.map((qna) => (
            <div 
              key={qna._id} 
              className={cn(
                "glass rounded-2xl overflow-hidden transition-all duration-300",
                expandedId === qna._id ? "shadow-md border-brand-green/30" : "hover:shadow-sm hover:border-foreground/20"
              )}
            >
              <div 
                className="p-5 cursor-pointer flex items-start justify-between group"
                onClick={() => toggleExpand(qna._id)}
              >
                <div className="flex-1 pr-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                      {qna.topic}
                    </span>
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                      qna.confidence === 'confident' 
                        ? "bg-brand-green/10 text-brand-green" 
                        : "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    )}>
                      {qna.confidence === 'confident' ? 'Confident' : 'Needs Revision'}
                    </span>
                  </div>
                  <h3 className="font-bold text-foreground text-base leading-snug group-hover:text-brand-green transition-colors">{qna.question}</h3>
                </div>
                <div className="flex items-center gap-2 shrink-0 pt-1">
                  <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mr-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); openModal(qna); }}
                      className="p-2 text-foreground/50 hover:text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation();
                        if (window.confirm('Delete this Q&A?')) deleteMutation.mutate(qna._id);
                      }}
                      className="p-2 text-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300",
                    expandedId === qna._id ? "bg-brand-green/10 text-brand-green rotate-180" : "bg-background border border-border text-foreground/60 group-hover:border-foreground/30"
                  )}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>
              
              <div 
                className={cn(
                  "grid transition-all duration-300 ease-in-out",
                  expandedId === qna._id ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <div className="p-6 pt-3 border-t border-border/30 bg-background/30 prose prose-sm dark:prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: qna.answer }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            <div className="p-5 border-b border-border/50 flex justify-between items-center bg-card/30 shrink-0">
              <h2 className="text-lg font-bold">{editingQna ? 'Edit Q&A' : 'Add New Q&A'}</h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-foreground/10 text-foreground/60 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 flex flex-col gap-5 bg-card/30 custom-scrollbar">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">Question</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is the Virtual DOM in React?"
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm font-medium"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">Topic</label>
                  <select
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm font-medium cursor-pointer"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  >
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">Confidence Level</label>
                  <select
                    className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm font-medium cursor-pointer"
                    value={confidence}
                    onChange={(e) => setConfidence(e.target.value)}
                  >
                    <option value="needs-revision">Needs Revision</option>
                    <option value="confident">Confident</option>
                  </select>
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-[300px] space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">Answer</label>
                <div className="flex-1 rounded-xl overflow-hidden border border-border bg-background focus-within:ring-2 focus-within:ring-brand-green/50 focus-within:border-brand-green transition-all shadow-sm">
                  <DefaultEditor 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} 
                    className="h-full min-h-[300px] w-full border-none! text-sm font-medium p-3"
                  />
                </div>
              </div>
            </form>
            
            <div className="p-5 border-t border-border/50 flex justify-end gap-3 shrink-0 bg-card/30">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 font-bold rounded-xl text-sm bg-background border border-border hover:bg-foreground/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="px-6 py-2.5 bg-brand-green hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-brand-green/20"
              >
                {editingQna ? 'Save Changes' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Answers;
