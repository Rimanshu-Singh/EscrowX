import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ClipboardList, Clock, ShieldAlert, Sparkles, X } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { listingService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function MyListingsPage() {
  const { user } = useAuthStore();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'SERVICE' | 'PROJECT'>('SERVICE');
  const [price, setPrice] = useState(100);
  const [budget, setBudget] = useState(500);
  const [deliveryDays, setDeadlineDays] = useState(7);
  const [skillsStr, setSkillsStr] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Set default type based on role
  useEffect(() => {
    if (user?.role === 'CLIENT') {
      setType('PROJECT');
    } else {
      setType('SERVICE');
    }
  }, [user]);

  const fetchMyListings = async () => {
    setLoading(true);
    try {
      const data = await listingService.getMyListings();
      setListings(data || []);
    } catch (error) {
      console.error('Error fetching my listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);

      const listingData = {
        title,
        description,
        type,
        role: user?.role === 'CLIENT' ? 'CLIENT' : 'FREELANCER',
        price: type === 'SERVICE' ? price : 0,
        budget: type === 'PROJECT' ? budget : 0,
        deliveryDays,
        skills,
        tags,
      };

      await listingService.createListing(listingData);
      setShowCreateModal(false);
      
      // Reset form
      setTitle('');
      setDescription('');
      setSkillsStr('');
      setTagsStr('');
      
      fetchMyListings();
    } catch (error) {
      console.error('Error creating listing:', error);
      alert('Failed to create listing');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await listingService.deleteListing(id);
      setListings(prev => prev.filter(l => l._id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
      alert('Failed to delete listing');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">My Listings</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Manage the gigs and projects you have posted on EscrowX.</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Listing
          </button>
        </div>

        {/* Listings Display list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-28 bg-white border border-[#E4E8F0] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white border border-[#E4E8F0] rounded-xl p-12 text-center max-w-xl mx-auto shadow-sm">
            <ClipboardList className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="text-sm font-bold text-[#0F172A]">No Listings Yet</h3>
            <p className="text-xs text-[#64748B] mt-2">You haven't posted any gigs or projects. Create one now to show up in the marketplace!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-4 py-2.5 bg-[#0F172A] text-white text-xs font-bold rounded-lg hover:bg-[#1E293B]"
            >
              Post a Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {listings.map(item => (
              <div
                key={item._id}
                className="bg-white border border-[#E4E8F0] rounded-xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      item.type === 'SERVICE' ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'
                    }`}>
                      {item.type === 'SERVICE' ? 'Gig / Service' : 'Project / Req'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold font-mono uppercase">
                      Status: {item.status}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-[#0F172A]">{item.title}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.skills?.map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-semibold text-[#64748B] uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0">
                  <div className="text-right">
                    <p className="text-[9px] text-[#94A3B8] font-bold uppercase tracking-wider">
                      {item.type === 'SERVICE' ? 'Service Rate' : 'Budget'}
                    </p>
                    <p className="text-sm font-extrabold text-[#0F172A] font-mono">
                      {item.type === 'SERVICE' ? item.price : item.budget} XLM
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDeleteListing(item._id)}
                      className="p-2 rounded-lg border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Listing Modal */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-[#E4E8F0] rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-[#7C3AED]" /> Post a New Listing
                  </h3>
                  <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Listing Title</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Build modern decentralized escrow system"
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Listing Description</label>
                    <textarea
                      required
                      rows={5}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Explain the service deliverables or project requirements..."
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Listing Type</label>
                      <select
                        value={type}
                        onChange={e => setType(e.target.value as any)}
                        className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
                      >
                        <option value="SERVICE">Service (I am offering)</option>
                        <option value="PROJECT">Project (I am hiring)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Delivery Time (Days)</label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={deliveryDays}
                        onChange={e => setDeadlineDays(Number(e.target.value))}
                        className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {type === 'SERVICE' ? (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Rate / Price (XLM)</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={price}
                          onChange={e => setPrice(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none"
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Project Budget (XLM)</label>
                        <input
                          type="number"
                          required
                          min={1}
                          value={budget}
                          onChange={e => setBudget(Number(e.target.value))}
                          className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Skills Required (Comma separated)</label>
                    <input
                      type="text"
                      value={skillsStr}
                      onChange={e => setSkillsStr(e.target.value)}
                      placeholder="e.g. React, Stellar, Rust, AI"
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={tagsStr}
                      onChange={e => setTagsStr(e.target.value)}
                      placeholder="e.g. soroban, escrow, web3"
                      className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 py-2.5 border border-[#E4E8F0] text-gray-500 rounded-lg hover:bg-slate-50 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 py-2.5 bg-[#7C3AED] text-white rounded-lg hover:bg-[#6D28D9] transition-all font-bold shadow-sm"
                    >
                      {submitting ? 'Posting...' : 'Post Listing'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
