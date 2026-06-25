'use client';

import { useState } from 'react';
import { Shield, Plus, Edit2, Check, X, Users, Eye, Pencil, Trash2, Download, Settings } from 'lucide-react';

const ROLES = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full unrestricted access to all modules and settings',
    members: 1,
    color: '#C84B4B',
    permissions: { dashboard: true, users: true, donations: true, categories: true, reports: true, notifications: true, support: true, settings: true, roles: true, audit: true },
  },
  {
    id: 2,
    name: 'Admin',
    description: 'Access to all operational modules, limited settings',
    members: 2,
    color: '#D4A574',
    permissions: { dashboard: true, users: true, donations: true, categories: true, reports: true, notifications: true, support: true, settings: false, roles: false, audit: true },
  },
  {
    id: 3,
    name: 'Moderator',
    description: 'Content moderation, user reports, and support',
    members: 4,
    color: '#6B8E23',
    permissions: { dashboard: true, users: false, donations: true, categories: false, reports: true, notifications: false, support: true, settings: false, roles: false, audit: false },
  },
  {
    id: 4,
    name: 'Support Agent',
    description: 'Handle support tickets and basic user queries',
    members: 3,
    color: '#1976D2',
    permissions: { dashboard: true, users: false, donations: false, categories: false, reports: false, notifications: false, support: true, settings: false, roles: false, audit: false },
  },
];

const MODULES = ['dashboard', 'users', 'donations', 'categories', 'reports', 'notifications', 'support', 'settings', 'roles', 'audit'];

export default function RolesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Roles & Permissions</h1>
          <p className="text-sm text-muted mt-1">Manage admin access levels and module permissions.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors shadow-warm-sm">
          <Plus className="w-4 h-4" />
          Create Role
        </button>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {ROLES.map((role) => (
          <div key={role.id} className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${role.color}15` }}>
                  <Shield className="w-5 h-5" style={{ color: role.color }} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-heading text-lg">{role.name}</h3>
                  <p className="text-xs text-muted">{role.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted">
                <Users className="w-3.5 h-3.5" />
                {role.members} member{role.members !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Permissions Grid */}
            <div className="grid grid-cols-5 gap-1.5">
              {MODULES.map((mod) => {
                const hasAccess = role.permissions[mod as keyof typeof role.permissions];
                return (
                  <div
                    key={mod}
                    className={`rounded-lg py-1.5 px-2 text-center text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                      hasAccess
                        ? 'bg-leaf-50 text-leaf-700'
                        : 'bg-tamarind-50/50 text-tamarind-300'
                    }`}
                  >
                    {mod.slice(0, 6)}
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-1 mt-4 pt-3 border-t border-tamarind-50">
              <button className="px-3 py-1.5 rounded-lg text-xs font-semibold text-body hover:bg-cream transition-colors flex items-center gap-1">
                <Edit2 className="w-3 h-3" /> Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
