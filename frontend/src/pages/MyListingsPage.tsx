import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
      <div className="min-w-0 space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A] sm:text-2xl">My Listings</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Manage the gigs and projects you have posted on EscrowX.</p>
          </div>
          {user?.role !== 'CLIENT' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex min-h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-[#7C3AED] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-[#6D28D9] sm:w-auto cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Listing
            </button>
          )}
        </div>

        {/* Listings Display list */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-28 bg-white border border-[#E4E8F0] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="mx-auto max-w-xl rounded-xl border border-[#E4E8F0] bg-white p-6 text-center shadow-sm sm:p-12">
            <ClipboardList className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="text-sm font-bold text-[#0F172A]">No Listings Yet</h3>
            <p className="text-xs text-[#64748B] mt-2">You haven't posted any gigs or projects. Create one now to show up in the marketplace!</p>
            {user?.role !== 'CLIENT' ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 min-h-11 rounded-lg bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1E293B]"
              >
                Post a Listing
              </button>
            ) : (
              <Link
                to="/escrow/create"
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0F172A] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#1E293B]"
              >
                Create Escrow & Project
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {listings.map(item => (
              <div
                key={item._id}
                className="flex min-w-0 flex-col justify-between gap-4 rounded-xl border border-[#E4E8F0] bg-white p-4 shadow-sm transition-shadow hover:shadow-md md:flex-row md:items-center sm:p-5"
              >
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      item.type === 'SERVICE' ? 'bg-emerald-500 text-white' : 'bg-purple-600 text-white'
                    }`}>
                      {item.type === 'SERVICE' ? 'Gig / Service' : 'Project / Req'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold font-mono uppercase">
                      Status: {item.status}
                    </span>
                  </div>
                  <h3 className="break-words text-sm font-bold text-[#0F172A]">{item.title}</h3>
                  <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.skills?.map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-semibold text-[#64748B] uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 border-t pt-3 md:justify-end md:border-t-0 md:pt-0">
                  <div className="text-left md:text-right">
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
                      className="min-h-11 min-w-11 rounded-lg border border-red-100 bg-red-50 p-2 text-red-500 transition-colors hover:bg-red-100 cursor-pointer"
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
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-h-[calc(100vh-24px)] w-full max-w-lg space-y-4 overflow-y-auto rounded-xl border border-[#E4E8F0] bg-white p-4 shadow-2xl sm:max-h-[90vh] sm:p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-[#7C3AED]" /> Post a New Listing
                  </h3>
                  <button onClick={() => setShowCreateModal(false)} className="min-h-10 min-w-10 rounded-lg text-gray-400 hover:text-gray-500">
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
                      className="min-h-11 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
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
                      className="min-h-32 w-full resize-none rounded-lg border border-[#E2E8F0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Listing Type</label>
                      <select
                        value={type}
                        onChange={e => setType(e.target.value as any)}
                        className="min-h-11 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED]"
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
                        className="min-h-11 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 focus:outline-none"
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
                          className="min-h-11 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 focus:outline-none"
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
                          className="min-h-11 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 focus:outline-none"
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
                      className="min-h-11 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1.5">Tags (Comma separated)</label>
                    <input
                      type="text"
                      value={tagsStr}
                      onChange={e => setTagsStr(e.target.value)}
                      placeholder="e.g. soroban, escrow, web3"
                      className="min-h-11 w-full rounded-lg border border-[#E2E8F0] px-3 py-2 focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="min-h-11 flex-1 rounded-lg border border-[#E4E8F0] py-2.5 font-semibold text-gray-500 transition-all hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="min-h-11 flex-1 rounded-lg bg-[#7C3AED] py-2.5 font-bold text-white shadow-sm transition-all hover:bg-[#6D28D9]"
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
