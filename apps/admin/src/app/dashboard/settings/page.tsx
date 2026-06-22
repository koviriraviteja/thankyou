'use client';

import { useState } from 'react';
import { Settings as SettingsIcon, Globe, Bell, Shield, Palette, Save, ToggleLeft, ToggleRight } from 'lucide-react';

interface SettingToggle {
  label: string;
  description: string;
  enabled: boolean;
}

export default function SettingsPage() {
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'ThankU',
    tagline: 'Share Kindness, Spread Joy',
    contactEmail: 'support@thanku.app',
    contactPhone: '+91 80 1234 5678',
    maxUploadSize: '10',
    itemExpiryDays: '30',
  });

  const [toggles, setToggles] = useState<SettingToggle[]>([
    { label: 'User Registration', description: 'Allow new users to sign up on the platform', enabled: true },
    { label: 'Email Verification Required', description: 'Users must verify email before posting', enabled: true },
    { label: 'Auto-approve Listings', description: 'Skip moderation for verified users', enabled: false },
    { label: 'Location Sharing', description: 'Allow users to share approximate location', enabled: true },
    { label: 'Chat System', description: 'Enable in-app messaging between users', enabled: true },
    { label: 'Push Notifications', description: 'Send push notifications for updates', enabled: true },
    { label: 'Maintenance Mode', description: 'Show maintenance page to all users', enabled: false },
    { label: 'Two-Factor Authentication', description: 'Require 2FA for admin accounts', enabled: true },
  ]);

  const handleToggle = (index: number) => {
    setToggles(prev => prev.map((t, i) => i === index ? { ...t, enabled: !t.enabled } : t));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Settings</h1>
          <p className="text-sm text-muted mt-1">Configure your ThankU platform.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors shadow-warm-sm">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary-50"><Globe className="w-5 h-5 text-primary" /></div>
            <h2 className="text-lg font-display font-bold text-heading">General</h2>
          </div>
          <div className="space-y-4">
            {Object.entries(generalSettings).map(([key, value]) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-1.5">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, [key]: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm bg-background border border-tamarind-200 rounded-lg text-heading
                             focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-leaf-50"><SettingsIcon className="w-5 h-5 text-leaf" /></div>
            <h2 className="text-lg font-display font-bold text-heading">Features & Security</h2>
          </div>
          <div className="space-y-1">
            {toggles.map((toggle, i) => (
              <div key={toggle.label} className="flex items-center justify-between py-3 border-b border-tamarind-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-heading">{toggle.label}</p>
                  <p className="text-xs text-muted mt-0.5">{toggle.description}</p>
                </div>
                <button
                  onClick={() => handleToggle(i)}
                  className="shrink-0 ml-4"
                >
                  {toggle.enabled ? (
                    <ToggleRight className="w-8 h-8 text-primary" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-tamarind-300" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
