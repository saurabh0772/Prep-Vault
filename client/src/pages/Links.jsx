import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axiosInstance';
import { Plus, Copy, ExternalLink, Edit2, Trash2, Link as LinkIcon, X } from 'lucide-react';
import toast from 'react-hot-toast';

const Links = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  
  // Form state
  const [label, setLabel] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('');

  const { data: links = [], isLoading } = useQuery({
    queryKey: ['links'],
    queryFn: async () => {
      const res = await axiosInstance.get('/links');
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newLink) => axiosInstance.post('/links', newLink),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link saved!');
      closeModal();
    },
    onError: () => toast.error('Failed to save link')
  });

  const updateMutation = useMutation({
    mutationFn: (data) => axiosInstance.put(`/links/${data.id}`, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link updated!');
      closeModal();
    },
    onError: () => toast.error('Failed to update link')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axiosInstance.delete(`/links/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success('Link deleted!');
    },
    onError: () => toast.error('Failed to delete link')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLink) {
      updateMutation.mutate({
        id: editingLink._id,
        payload: { label, url, icon }
      });
    } else {
      createMutation.mutate({ label, url, icon });
    }
  };

  const openModal = (link = null) => {
    if (link) {
      setEditingLink(link);
      setLabel(link.label);
      setUrl(link.url);
      setIcon(link.icon || '');
    } else {
      setEditingLink(null);
      setLabel('');
      setUrl('');
      setIcon('');
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Copied to clipboard!');
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Links Vault</h1>
          <p className="text-foreground/60 mt-1 text-sm">Manage your important professional links.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-5 py-2.5 bg-brand-green hover:bg-teal-500 text-white font-bold rounded-xl transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2 active:scale-95 text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Link
        </button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-2xl border-dashed border-2 border-border/50 max-w-xl mx-auto">
          <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-green">
            <LinkIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold mb-2">Your vault is empty</h3>
          <p className="text-foreground/60 mb-6 text-sm max-w-sm mx-auto">Start building your collection of important links like your GitHub, LinkedIn, and Portfolio.</p>
          <button
            onClick={() => openModal()}
            className="text-brand-green font-bold text-sm hover:text-teal-500 transition-colors"
          >
            + Add your first link
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {links.map((link) => (
            <div 
              key={link._id} 
              onClick={() => window.open(link.url, '_blank')}
              className="glass rounded-2xl p-5 group flex flex-col h-full hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-4">
                {link.icon ? (
                  <div className="text-2xl w-12 h-12 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl shrink-0 shadow-sm border border-border/50">
                    {link.icon}
                  </div>
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-xl shrink-0 text-foreground/60 shadow-sm border border-border/50">
                    <LinkIcon className="w-5 h-5" />
                  </div>
                )}
                <div className="overflow-hidden flex-1 pt-1">
                  <h3 className="font-bold text-foreground truncate text-base group-hover:text-brand-green transition-colors">{link.label}</h3>
                  <p className="text-xs text-foreground/50 truncate font-medium mt-1">{link.url}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex items-center justify-between border-t border-border/30">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(link.url); }}
                    className="flex items-center justify-center w-8 h-8 text-foreground/60 hover:text-brand-green hover:bg-brand-green/10 rounded-lg transition-colors"
                    title="Copy Link"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center justify-center w-8 h-8 text-foreground/60 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Open Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); openModal(link); }}
                    className="flex items-center justify-center w-8 h-8 text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this link?')) {
                        deleteMutation.mutate(link._id);
                      }
                    }}
                    className="flex items-center justify-center w-8 h-8 text-foreground/60 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-8 duration-300">
            <div className="p-5 border-b border-border/50 flex justify-between items-center bg-card/30">
              <h2 className="text-lg font-bold">{editingLink ? 'Edit Link' : 'Add New Link'}</h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-foreground/10 text-foreground/60 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 bg-card/30">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GitHub Profile"
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm font-medium"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/..."
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-sm font-medium"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground/80 pl-1 uppercase tracking-wider">Icon (Emoji) <span className="font-normal opacity-60">- Optional</span></label>
                <input
                  type="text"
                  placeholder="🐙"
                  className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-lg"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                />
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 font-bold rounded-xl text-sm bg-background border border-border hover:bg-foreground/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="px-6 py-2.5 bg-brand-green hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-brand-green/20"
                >
                  {editingLink ? 'Save Changes' : 'Add Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Links;
