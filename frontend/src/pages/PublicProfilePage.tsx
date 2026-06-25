import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Clock, Star, Calendar, Globe, Award, Briefcase, ChevronRight, UserCheck } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { profileService } from '../services/api';

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profileData, setProfileData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicProfile = async () => {
      if (!username) return;
      setLoading(true);
      try {
        const data = await profileService.getPublicProfile(username);
        setProfileData(data);
      } catch (err: any) {
        console.error('Error loading public profile:', err);
        setError(err.response?.data?.error || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };
    fetchPublicProfile();
  }, [username]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C3AED]"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !profileData) {
    return (
      <DashboardLayout>
        <div className="max-w-md mx-auto text-center py-12 bg-white border border-[#E4E8F0] rounded-xl shadow-sm space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-sm font-bold text-[#0F172A]">Profile Not Found</h3>
          <p className="text-xs text-[#64748B]">{error || 'Something went wrong.'}</p>
          <Link to="/marketplace" className="inline-flex items-center gap-1.5 text-xs text-[#7C3AED] font-bold hover:underline">
            Back to Marketplace
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const { profile, listings, stats, reviews } = profileData;
  const joinedYear = new Date(stats.joinedDate).getFullYear();

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* HERO SECTION */}
        <div className="bg-white border border-[#E4E8F0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-bl-full pointer-events-none" />
          <div className="relative">
            <img
              src={profile.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`}
              alt={profile.name}
              className="w-20 h-20 rounded-full border-2 border-slate-50 object-cover"
            />
            <span className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 bg-[#10B981] border-2 border-white rounded-full"></span>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2.5">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-lg font-black text-[#0F172A] tracking-tight">{profile.name}</h1>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-[10px] font-mono text-slate-400">@{profile.username}</span>
                <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white rounded-md bg-gradient-to-r ${
                  profile.role === 'CLIENT' ? 'from-blue-500 to-indigo-600' : 'from-purple-500 to-pink-600'
                }`}>
                  {profile.role}
                </span>
              </div>
            </div>

            <div className="text-xs text-[#64748B] flex flex-wrap justify-center md:justify-start items-center gap-4">
              <span className="font-semibold text-amber-500 flex items-center gap-0.5">
                ★ {(profile.trustScore / 20).toFixed(1)} <span className="text-slate-400">Reputation</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded text-[10px] flex items-center gap-1">
                <Award className="w-3 h-3" /> {profile.badge} Level
              </span>
              {profile.location && (
                <>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span>📍 {profile.location}</span>
                </>
              )}
            </div>

            <div className="border-t border-[#F1F5F9] pt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-[10px] text-gray-500 font-mono">
              <div className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[200px]" title={profile.walletAddress}>
                  Wallet: {profile.walletAddress}
                </span>
              </div>
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Freighter Verified Client/Talent</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column layout: About / Activity and Listings / Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANEL: ABOUT & STATS (span 4) */}
          <div className="lg:col-span-4 space-y-6">
            {/* About Card */}
            <div className="bg-white border border-[#E4E8F0] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#64748B]">About</h3>
              <p className="text-xs text-[#334155] leading-relaxed whitespace-pre-line">
                {profile.bio || "No bio posted yet."}
              </p>

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expertise / Skills</span>
                  <div className="flex flex-wrap gap-1">
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-[#475569] uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
                {profile.website && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B] flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-gray-400" /> Website</span>
                    <a href={profile.website} target="_blank" rel="noreferrer" className="font-semibold text-[#7C3AED] hover:underline">{profile.website.replace(/^https?:\/\//i, '')}</a>
                  </div>
                )}
                {profile.portfolio && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#64748B] flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-gray-400" /> Portfolio</span>
                    <a href={profile.portfolio} target="_blank" rel="noreferrer" className="font-semibold text-[#7C3AED] hover:underline">View Portfolio</a>
                  </div>
                )}
              </div>
            </div>

            {/* Platform Activity Stats */}
            <div className="bg-white border border-[#E4E8F0] rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#64748B]">Platform Activity</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#FAFAFA] border border-[#F1F5F9] rounded-xl p-3.5 text-center">
                  <p className="text-lg font-black text-[#0F172A]">{stats.escrowsCompleted}</p>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Escrows Closed</p>
                </div>
                <div className="bg-[#FAFAFA] border border-[#F1F5F9] rounded-xl p-3.5 text-center">
                  <p className="text-lg font-black text-[#0F172A]">{stats.listingsCreated}</p>
                  <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">Active Listings</p>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-100 text-[#64748B]">
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> Member since</span>
                <span className="font-semibold text-[#0F172A]">{joinedYear}</span>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: PORTFOLIO LISTINGS & REVIEWS (span 8) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Listings Grid */}
            <div className="bg-white border border-[#E4E8F0] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#64748B]">Active Listings & Offers</h3>
              {listings.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4">No active marketplace listings published.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {listings.map((item: any) => (
                    <Link
                      key={item._id}
                      to={`/listing/${item._id}`}
                      className="border border-[#F1F5F9] rounded-xl overflow-hidden hover:border-[#7C3AED]/25 hover:shadow-sm transition-all flex flex-col bg-white"
                    >
                      <div className="h-32 bg-slate-50 relative overflow-hidden">
                        <img
                          src={item.coverImage || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80'}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute top-2.5 right-2.5 text-[8px] font-extrabold uppercase px-2 py-0.5 rounded-full text-white ${
                          item.type === 'SERVICE' ? 'bg-emerald-500' : 'bg-purple-600'
                        }`}>
                          {item.type === 'SERVICE' ? 'Gig' : 'Project'}
                        </span>
                      </div>
                      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                        <h4 className="text-xs font-bold text-[#0F172A] line-clamp-1 hover:text-[#7C3AED] transition-colors">{item.title}</h4>
                        <div className="flex justify-between items-center pt-2 border-t border-[#F1F5F9] text-[10px]">
                          <span className="text-[#64748B] flex items-center gap-1"><Clock className="w-3 h-3" /> {item.deliveryDays} Days</span>
                          <span className="font-mono font-bold text-[#0F172A]">
                            {item.type === 'SERVICE' ? item.price : item.budget} XLM
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white border border-[#E4E8F0] rounded-xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#64748B]">Counterparty Reviews</h3>
              {reviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-4">No reviews recorded on the Stellar ledger for this user.</p>
              ) : (
                <div className="space-y-4 divide-y divide-[#F1F5F9]">
                  {reviews.map((r: any, idx: number) => (
                    <div key={r._id} className={`pt-4 first:pt-0 space-y-2`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={r.reviewer?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${r.reviewer?.username}`}
                            alt=""
                            className="w-5.5 h-5.5 rounded-full object-cover border"
                          />
                          <span className="text-xs font-bold text-[#0F172A]">{r.reviewer?.name}</span>
                          <span className="text-[10px] text-slate-400">@{r.reviewer?.username}</span>
                        </div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[#334155] italic">"{r.comment}"</p>
                      <span className="text-[9px] text-slate-400 block">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Simple fallback icon missing handler
function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
