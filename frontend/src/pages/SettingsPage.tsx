import React, { useState, useEffect } from 'react';
import { Shield, Mail, Save, AlertCircle, Sparkles } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { profileService } from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [profile, setProfile] = useState<any>({
    name: '',
    username: '',
    email: '',
    walletAddress: '',
    bio: '',
    location: '',
    profileImage: '',
    skills: [],
    website: '',
    twitter: '',
    github: '',
    portfolio: ''
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Skill input helper
  const [skillsInput, setSkillsInput] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setProfile(data);
        setSkillsInput(data.skills ? data.skills.join(', ') : '');
      } catch (err) {
        console.error('Error fetching profile settings:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    try {
      const payload = {
        ...profile,
        skills: skillsInput
      };
      
      const updatedData = await profileService.updateProfile(payload);
      setProfile(updatedData);
      setSkillsInput(updatedData.skills ? updatedData.skills.join(', ') : '');
      
      // Update global auth store user details (to sync badge & headers)
      if (user) {
        setUser({
          ...user,
          name: updatedData.name,
          username: updatedData.username,
          avatar: updatedData.avatar
        });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Error updating settings:', err);
      setError(err.response?.data?.error || 'Failed to save settings changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C3AED]"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-black text-[#0F172A] tracking-tight">Account Settings</h1>
          <p className="text-xs text-[#64748B] mt-0.5">Customize your developer reputation profile and platform social details.</p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Status alerts */}
          {success && (
            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Profile updated successfully! Public routing is active.
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* SECTION 1: PROFILE INFO */}
          <div className="bg-white border border-[#E4E8F0] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Profile Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA] font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                  Unique Username <span className="text-[9px] text-[#7C3AED] lowercase">(/u/username)</span>
                </label>
                <input
                  type="text"
                  name="username"
                  required
                  value={profile.username}
                  onChange={handleInputChange}
                  placeholder="e.g. john_dev"
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA] font-mono font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. San Francisco, CA"
                  value={profile.location}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Profile Photo Avatar URL</label>
                <input
                  type="url"
                  name="profileImage"
                  placeholder="e.g. https://domain.com/photo.jpg"
                  value={profile.profileImage}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Professional Bio</label>
              <textarea
                name="bio"
                rows={3}
                placeholder="Write a summary describing your experience, background, and what you build..."
                value={profile.bio}
                onChange={handleInputChange}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA] resize-none"
              />
            </div>
          </div>

          {/* SECTION 2: WEB3 WALLET & SECURE ACCESS */}
          <div className="bg-white border border-[#E4E8F0] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Account Credentials (Read-Only)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Connected Wallet Address</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-100 rounded-xl bg-slate-50 text-slate-500 text-xs font-mono select-none">
                  <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{profile.walletAddress}</span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Primary Email Address</label>
                <div className="flex items-center gap-2 px-3.5 py-2.5 border border-slate-100 rounded-xl bg-slate-50 text-slate-500 text-xs font-semibold select-none">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: SKILLS */}
          <div className="bg-white border border-[#E4E8F0] rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Skills / Tags</h3>
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Skills (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. React, Next.js, Soroban, Rust, Python, LangChain"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA] font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Specify your skills, separated by commas, to help others find your listings.</span>
            </div>
          </div>

          {/* SECTION 4: SOCIAL LINKS */}
          <div className="bg-white border border-[#E4E8F0] rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Social Networks & Links</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Website URL</label>
                <input
                  type="url"
                  name="website"
                  placeholder="https://yourwebsite.com"
                  value={profile.website}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Portfolio Link</label>
                <input
                  type="url"
                  name="portfolio"
                  placeholder="https://behance.net/profile"
                  value={profile.portfolio}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Twitter / X Handle</label>
                <input
                  type="text"
                  name="twitter"
                  placeholder="https://x.com/username"
                  value={profile.twitter}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">GitHub Profile Link</label>
                <input
                  type="url"
                  name="github"
                  placeholder="https://github.com/username"
                  value={profile.github}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 border border-[#E2E8F0] rounded-xl text-xs bg-[#FAFAFA]"
                />
              </div>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex justify-end gap-3 pb-6">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#0F172A] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving changes...' : 'Save Profile details'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
