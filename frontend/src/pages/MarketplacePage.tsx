import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpDown, Calendar, ShieldAlert, Sparkles, Filter, X, Check } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { listingService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function MarketplacePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState('');
  const [type, setType] = useState<'ALL' | 'SERVICE' | 'PROJECT'>('ALL');
  const [roleType, setRoleType] = useState<'ALL' | 'CLIENT' | 'FREELANCER'>('ALL');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  // Common skills for filter tags
  const POPULAR_SKILLS = ['AI', 'LangChain', 'Python', 'Rust', 'Stellar', 'Soroban', 'React', 'Figma', 'TailwindCSS', 'Zendesk'];

  const fetchListings = async () => {
    setLoading(true);
    try {
      const params: any = {
        search: search || undefined,
        type: type !== 'ALL' ? type : undefined,
        role: roleType !== 'ALL' ? roleType : undefined,
        sort,
        page,
        limit: 8,
      };

      if (selectedSkills.length > 0) {
        params.skills = selectedSkills.join(',');
      }

      const data = await listingService.getListings(params);
      setListings(data.listings || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching marketplace listings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [type, roleType, sort, page, selectedSkills]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchListings();
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setType('ALL');
    setRoleType('ALL');
    setSelectedSkills([]);
    setSort('newest');
    setPage(1);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Marketplace</h1>
            <p className="text-xs text-[#64748B] mt-0.5">Explore opportunities, hire talent, or offer services backed by secure Stellar escrows.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={user?.role === 'CLIENT' ? '/client/listings' : '/freelancer/listings'}
              className="px-4 py-2.5 rounded-xl border border-[#E4E8F0] bg-white text-xs font-bold text-[#334155] hover:bg-[#FAFAFA] transition-all shadow-xs"
            >
              My Listings
            </Link>
            <Link
              to="/escrow/create"
              className="px-4 py-2.5 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:bg-[#1E293B] transition-all shadow-sm"
            >
              Create Escrow Contract
            </Link>
          </div>
        </div>

        {/* Compact Single Horizontal Filter Row */}
        <div className="bg-white border border-[#E4E8F0] rounded-2xl p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.01)]">
          <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-center gap-3">
            {/* Search */}
            <div className="w-full lg:flex-1 relative">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search projects, services, skills, tags..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/15 focus:border-[#7C3AED] transition-all bg-[#FAFAFA] text-[#334155]"
              />
            </div>

            {/* Controls segment */}
            <div className="w-full lg:w-auto flex flex-wrap items-center gap-2">
              {/* Category Dropdown (Type) */}
              <select
                value={type}
                onChange={e => { setType(e.target.value as any); setPage(1); }}
                className="px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-white text-[#475569] font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Categories</option>
                <option value="SERVICE">Gigs / Services</option>
                <option value="PROJECT">Client Projects</option>
              </select>

              {/* Role Type Dropdown */}
              <select
                value={roleType}
                onChange={e => { setRoleType(e.target.value as any); setPage(1); }}
                className="px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-white text-[#475569] font-bold focus:outline-none cursor-pointer"
              >
                <option value="ALL">All Roles</option>
                <option value="CLIENT">Client Posts</option>
                <option value="FREELANCER">Freelancer Posts</option>
              </select>

              {/* Skills Multi Select Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowSkillsDropdown(!showSkillsDropdown)}
                  className={`px-3.5 py-2.5 border rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedSkills.length > 0
                      ? 'bg-[#F5F3FF] border-[#7C3AED] text-[#7C3AED]'
                      : 'bg-white border-[#E2E8F0] text-[#475569]'
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {selectedSkills.length > 0 ? `Skills (${selectedSkills.length})` : 'Skills'}
                </button>

                {showSkillsDropdown && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setShowSkillsDropdown(false)} />
                    <div className="absolute right-0 lg:left-0 mt-2 w-52 bg-white border border-[#E4E8F0] rounded-xl shadow-lg p-2.5 z-40 space-y-1.5 max-h-60 overflow-y-auto">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Select Skills</span>
                        {selectedSkills.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedSkills([])}
                            className="text-[9px] text-red-500 font-bold hover:underline"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      {POPULAR_SKILLS.map(skill => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleSkill(skill)}
                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#475569] transition-colors ${
                              isSelected ? 'bg-[#F5F3FF] text-[#7C3AED] font-bold' : 'hover:bg-slate-50'
                            }`}
                          >
                            <span>{skill}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#7C3AED]" />}
                          </button>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {/* Sort Order */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                  className="pl-8 pr-4 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-white text-[#475569] font-bold focus:outline-none cursor-pointer appearance-none min-w-[130px]"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price_asc">Price: Low-High</option>
                  <option value="price_desc">Price: High-Low</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-3.5 pointer-events-none" />
              </div>

              {/* Reset Filters */}
              {(search || type !== 'ALL' || roleType !== 'ALL' || selectedSkills.length > 0) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-3.5 py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-all cursor-pointer"
                >
                  Reset
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all shadow-xs cursor-pointer"
              >
                Find
              </button>
            </div>
          </form>
        </div>

        {/* Listings Display Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-[#E4E8F0] rounded-2xl p-4 space-y-4 animate-pulse">
                <div className="w-full h-40 bg-slate-100 rounded-xl" />
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 bg-slate-100 rounded-full w-16" />
                  <div className="h-5 bg-slate-100 rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-white border border-[#E4E8F0] rounded-2xl p-12 text-center max-w-xl mx-auto shadow-xs">
            <ShieldAlert className="w-12 h-12 text-[#94A3B8] mx-auto mb-4" />
            <h3 className="text-sm font-bold text-[#0F172A]">No Listings Found</h3>
            <p className="text-xs text-[#64748B] mt-2">Try adjusting your filters or search keywords to explore items.</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2.5 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-[#1E293B]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {listings.map((item, idx) => (
              <motion.div
                key={item._id || item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                className="bg-white border border-[#F1F5F9] rounded-2xl overflow-hidden shadow-[0_2px_8px_-1px_rgba(0,0,0,0.01),0_8px_16px_-4px_rgba(0,0,0,0.02)] hover:-translate-y-2 hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.03)] transition-all duration-300 flex flex-col group relative"
              >
                {/* Cover Image */}
                <div className="relative aspect-[16/10] bg-slate-50 overflow-hidden">
                  <img
                    src={item.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 flex gap-1.5">
                    <span className={`text-[9px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-xs ${
                      item.type === 'SERVICE' ? 'bg-[#10B981] text-white' : 'bg-[#7C3AED] text-white'
                    }`}>
                      {item.type === 'SERVICE' ? 'Gig' : 'Project'}
                    </span>
                  </div>
                </div>

                {/* Content details */}
                <div className="p-4.5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    {/* User profile row */}
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-2 relative z-20 cursor-pointer hover:text-[#7C3AED] transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (item.createdBy?.username) {
                            navigate(`/u/${item.createdBy.username}`);
                          }
                        }}
                      >
                        <img
                          src={item.createdBy?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.createdBy?.name || 'User'}`}
                          alt=""
                          className="w-5.5 h-5.5 rounded-full border border-slate-100 object-cover"
                        />
                        <span className="text-[10px] font-bold truncate max-w-[90px]">{item.createdBy?.name}</span>
                      </div>
                      <span className="text-[9px] font-bold text-amber-500 bg-amber-50/80 px-2 py-0.5 rounded-md border border-amber-100/50 flex items-center gap-0.5">
                        ★ {item.createdBy?.trustScore ? (item.createdBy.trustScore / 20).toFixed(1) : '4.8'}
                      </span>
                    </div>

                    <h4 className="text-[13px] font-extrabold text-[#0F172A] line-clamp-1 group-hover:text-[#7C3AED] transition-colors leading-tight">
                      {item.title}
                    </h4>

                    <p className="text-[10px] text-[#64748B] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {item.skills?.slice(0, 3).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 bg-slate-50 text-[#64748B] border border-slate-100 rounded-md text-[8px] font-extrabold uppercase tracking-wide">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing row */}
                  <div className="flex items-center justify-between border-t border-[#F1F5F9] pt-3.5">
                    <div className="flex items-center gap-1.5 text-[#94A3B8]">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[9px] font-bold">{item.deliveryDays} Days</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-[#94A3B8] font-bold uppercase tracking-wider">
                        {item.type === 'SERVICE' ? 'Starting at' : 'Budget'}
                      </p>
                      <p className="text-xs font-extrabold text-[#0F172A] font-mono">
                        {item.type === 'SERVICE' ? item.price : item.budget} XLM
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cover overlay click link */}
                <Link to={`/listing/${item._id || item.id}`} className="absolute inset-0 z-10" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination Buttons */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3.5 py-2 rounded-xl border border-[#E4E8F0] bg-white text-xs font-semibold text-gray-500 hover:bg-[#FAFAFA] disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-[#475569]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3.5 py-2 rounded-xl border border-[#E4E8F0] bg-white text-xs font-semibold text-gray-500 hover:bg-[#FAFAFA] disabled:opacity-40 cursor-pointer shadow-2xs"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
