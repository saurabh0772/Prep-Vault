import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import { TOPICS } from '../constants/topics';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, RotateCcw, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '../utils/cn';

const Revise = () => {
  const queryClient = useQueryClient();
  
  // Filters
  const [topicFilter, setTopicFilter] = useState('All');
  const [confidenceFilter, setConfidenceFilter] = useState('needs-revision'); // default

  // Study state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completed, setCompleted] = useState(false);

  const { data: qnas = [], isLoading } = useQuery({
    queryKey: ['qnas'],
    queryFn: async () => {
      const res = await axiosInstance.get('/qna');
      return res.data;
    },
  });

  const updateConfidenceMutation = useMutation({
    mutationFn: ({ id, confidence }) => axiosInstance.put(`/qna/${id}`, { confidence }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['qnas'] });
    },
    onError: () => toast.error('Failed to update confidence')
  });

  const studyList = useMemo(() => {
    return qnas.filter((q) => {
      const matchTopic = topicFilter === 'All' || q.topic === topicFilter;
      const matchConfidence = confidenceFilter === 'All' || q.confidence === confidenceFilter;
      return matchTopic && matchConfidence;
    });
  }, [qnas, topicFilter, confidenceFilter]);

  // Reset progress when filters change
  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
    setCompleted(false);
  }, [topicFilter, confidenceFilter, studyList.length]);

  const handleNext = (newConfidence, currentId) => {
    // Update confidence in background
    if (newConfidence) {
      updateConfidenceMutation.mutate({ id: currentId, confidence: newConfidence });
    }

    if (currentIndex < studyList.length - 1) {
      // Add a slight delay for animation
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
      }, 150);
    } else {
      setCompleted(true);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/answers" className="p-2 bg-card border border-border hover:bg-background rounded-xl transition-colors shadow-sm">
            <ArrowLeft className="w-4 h-4 text-foreground/70" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">Revise Mode</h1>
            <p className="text-foreground/60 mt-0.5 text-sm">Test your knowledge with flashcards.</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-5 shadow-sm border border-border/50 shrink-0">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
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
          <div className="flex-1">
            <label className="block text-xs font-bold mb-1.5 text-foreground/80 pl-1 uppercase tracking-wider">Confidence Filter</label>
            <select
              className="w-full px-4 py-2.5 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm font-medium cursor-pointer"
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
            >
              <option value="needs-revision">Needs Revision First</option>
              <option value="confident">Confident Only</option>
              <option value="All">All Q&As</option>
            </select>
          </div>
        </div>
      </div>

      {/* Flashcard Area */}
      <div className="flex flex-col items-center justify-center py-4 sm:py-6 mt-2">
        {studyList.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-2xl w-full max-w-xl border-dashed border-2 border-border/50">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-green">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold mb-2">You're all caught up!</h3>
            <p className="text-foreground/60 mb-6 text-sm">No questions found for the selected filters.</p>
            <Link to="/answers" className="text-brand-green font-bold text-sm hover:text-teal-500 transition-colors">
              Go add more Q&As →
            </Link>
          </div>
        ) : completed ? (
          <div className="text-center glass-panel rounded-3xl p-10 w-full shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-green to-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-brand-green/30">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold mb-3 tracking-tight">You're all done! 🎉</h2>
              <p className="text-base text-foreground/60 mb-8">You've successfully reviewed all {studyList.length} questions in this set.</p>
              <button
                onClick={() => {
                  setCurrentIndex(0);
                  setShowAnswer(false);
                  setCompleted(false);
                }}
                className="px-6 py-3 bg-brand-green hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5"
              >
                Restart Session
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-6 animate-in slide-in-from-right-8 fade-in duration-300" key={currentIndex}>
            {/* Progress */}
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-foreground/60 uppercase tracking-widest">
                <span>Question {currentIndex + 1} of {studyList.length}</span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[10px]">
                  {studyList[currentIndex].topic}
                </span>
              </div>
              <div className="w-full bg-border/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-green to-teal-500 h-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentIndex) / studyList.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Flashcard Container */}
            <div className="relative perspective-1000 min-h-[350px]">
              <div className={cn(
                "w-full min-h-[350px] glass rounded-3xl shadow-xl transition-all duration-500 flex flex-col border border-border/50 relative overflow-hidden",
                showAnswer ? "border-brand-green/30 shadow-brand-green/10" : "hover:border-foreground/20"
              )}>
                {/* Decorative gradients */}
                <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[120%] bg-gradient-to-br from-brand-green/5 to-transparent opacity-50 pointer-events-none" />
                
                {/* Question Area */}
                <div className={cn(
                  "p-6 sm:p-8 text-center flex-1 flex flex-col justify-center items-center relative z-10 transition-all duration-500",
                  showAnswer ? "border-b border-border/50 flex-none py-5 min-h-[100px]" : ""
                )}>
                  <h3 className={cn(
                    "font-extrabold text-foreground leading-tight transition-all duration-500",
                    showAnswer ? "text-lg sm:text-xl text-foreground/80" : "text-xl sm:text-2xl"
                  )}>
                    {studyList[currentIndex].question}
                  </h3>
                </div>

                {/* Answer Area */}
                <div className={cn(
                  "relative z-10 bg-background/50 backdrop-blur-md overflow-hidden transition-all duration-500",
                  showAnswer ? "flex-1 opacity-100 max-h-[1000px]" : "flex-none opacity-0 max-h-0"
                )}>
                  <div className="p-6 sm:p-8 prose prose-sm dark:prose-invert max-w-none w-full animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                    <div dangerouslySetInnerHTML={{ __html: studyList[currentIndex].answer }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="px-8 py-3 bg-brand-green hover:bg-teal-500 text-white font-bold rounded-xl hover:-translate-y-0.5 transition-all shadow-md flex items-center gap-2 text-sm"
                >
                  <Eye className="w-5 h-5" />
                  Reveal Answer
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <button
                    onClick={() => handleNext('needs-revision', studyList[currentIndex]._id)}
                    className="flex-1 w-full flex items-center justify-center gap-2 py-3 bg-card border border-orange-500/50 text-orange-600 dark:text-orange-400 font-bold rounded-xl hover:bg-orange-500 hover:text-white transition-colors text-sm group shadow-sm"
                  >
                    <RotateCcw className="w-5 h-5 group-hover:-rotate-90 transition-transform duration-500" />
                    Needs Revision
                  </button>
                  <button
                    onClick={() => handleNext('confident', studyList[currentIndex]._id)}
                    className="flex-1 w-full flex items-center justify-center gap-2 py-3 bg-brand-green hover:bg-teal-500 text-white font-bold rounded-xl transition-all hover:-translate-y-0.5 text-sm shadow-md shadow-brand-green/20"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Confident
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Revise;
