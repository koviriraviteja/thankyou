'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Camera, Mail, User as UserIcon, Shield, Key, Smartphone, Save, ShieldCheck } from 'lucide-react';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Admin Profile</h1>
        <p className="text-sm text-muted mt-1">Manage your personal information and account security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ─── Left Column (Navigation / Overview) ─── */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-primary-100 to-gold-100 dark:from-primary/20 dark:to-gold/10" />
            
            <div className="relative mt-8 group">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center text-3xl font-bold text-white shadow-lg ring-4 ring-surface">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-heading text-surface rounded-full shadow-md opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <div className="mt-4 relative z-10">
              <h2 className="text-lg font-bold text-heading">{user?.name || 'Admin'}</h2>
              <p className="text-sm text-muted capitalize">{user?.role?.replace('_', ' ') || 'Super Admin'}</p>
            </div>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-leaf-50 dark:bg-leaf/10 text-leaf text-xs font-semibold rounded-full">
              <ShieldCheck className="w-4 h-4" /> Account Verified
            </div>
          </div>
        </div>

        {/* ─── Right Column (Forms) ─── */}
        <div className="md:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-tamarind-50 bg-cream/30">
              <h3 className="font-semibold text-heading flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-primary" /> Personal Information
              </h3>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-heading">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name}
                    className="w-full px-4 py-2.5 bg-background border border-[var(--color-border)] rounded-lg text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-heading">Email Address</label>
                  <input
                    type="email"
                    defaultValue={user?.email}
                    className="w-full px-4 py-2.5 bg-background border border-[var(--color-border)] rounded-lg text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-sm font-semibold text-heading">Bio / Note</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 bg-background border border-[var(--color-border)] rounded-lg text-sm text-body placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Add a short bio or internal note..."
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-600 text-white font-semibold text-sm rounded-lg shadow-warm-sm transition-colors disabled:opacity-70"
                >
                  <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 overflow-hidden">
            <div className="px-6 py-4 border-b border-tamarind-50 bg-cream/30">
              <h3 className="font-semibold text-heading flex items-center gap-2">
                <Shield className="w-4 h-4 text-tamarind-500" /> Security Settings
              </h3>
            </div>
            <div className="p-6 space-y-6">
              {/* Password */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-tamarind-50">
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-cream rounded-lg text-tamarind-500 shrink-0">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-heading text-sm">Password</h4>
                    <p className="text-xs text-muted mt-0.5">It's a good idea to use a strong password that you're not using elsewhere.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-cream text-heading text-sm font-semibold rounded-lg hover:bg-tamarind-100 transition-colors shrink-0">
                  Change Password
                </button>
              </div>

              {/* 2FA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-3 items-start">
                  <div className="p-2 bg-cream rounded-lg text-primary shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-heading text-sm">Two-Factor Authentication (2FA)</h4>
                    <p className="text-xs text-muted mt-0.5">Add an extra layer of security to your account by requiring a code upon login.</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-primary/10 text-primary-700 dark:text-primary-400 text-sm font-semibold rounded-lg hover:bg-primary/20 transition-colors shrink-0">
                  Enable 2FA
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
