'use client';

import { useState } from 'react';
import {
  ScrollText, Search, Filter, ChevronLeft, ChevronRight,
  LogIn, UserPlus, Edit2, Trash2, Shield, Eye, Download,
} from 'lucide-react';
import { formatDateTime } from '@/utils/formatters';

const AUDIT_LOGS = [
  { id: 1, admin: 'Muktha Admin', action: 'USER_SUSPENDED', module: 'Users', target: 'Vikram N. (USR-006)', ip: '192.168.1.45', timestamp: '2026-06-22 14:30:22' },
  { id: 2, admin: 'Muktha Admin', action: 'LISTING_REMOVED', module: 'Donations', target: 'DON-3007 (Wooden Study Table)', ip: '192.168.1.45', timestamp: '2026-06-22 13:15:08' },
  { id: 3, admin: 'Priya (Moderator)', action: 'REPORT_RESOLVED', module: 'Reports', target: 'RPT-104', ip: '10.0.0.12', timestamp: '2026-06-22 11:45:33' },
  { id: 4, admin: 'Muktha Admin', action: 'SETTINGS_UPDATED', module: 'Settings', target: 'Auto-approve Listings → OFF', ip: '192.168.1.45', timestamp: '2026-06-22 10:20:15' },
  { id: 5, admin: 'Muktha Admin', action: 'CATEGORY_CREATED', module: 'Categories', target: 'Baby & Kids', ip: '192.168.1.45', timestamp: '2026-06-21 16:05:42' },
  { id: 6, admin: 'Rahul (Support)', action: 'TICKET_CLOSED', module: 'Support', target: 'TKT-505', ip: '10.0.0.8', timestamp: '2026-06-21 14:30:00' },
  { id: 7, admin: 'Muktha Admin', action: 'ROLE_UPDATED', module: 'Roles', target: 'Moderator role permissions changed', ip: '192.168.1.45', timestamp: '2026-06-21 09:12:55' },
  { id: 8, admin: 'Muktha Admin', action: 'ADMIN_LOGIN', module: 'Auth', target: 'Login from Chrome/Mac', ip: '192.168.1.45', timestamp: '2026-06-21 09:00:01' },
  { id: 9, admin: 'Priya (Moderator)', action: 'NOTIFICATION_SENT', module: 'Notifications', target: 'Community Milestone campaign', ip: '10.0.0.12', timestamp: '2026-06-20 14:00:00' },
  { id: 10, admin: 'Muktha Admin', action: 'USER_BANNED', module: 'Users', target: 'Vikram N. (USR-006)', ip: '192.168.1.45', timestamp: '2026-06-20 11:30:18' },
];

function ActionBadge({ action }: { action: string }) {
  const colorMap: Record<string, string> = {
    USER_SUSPENDED: 'badge-warning',
    USER_BANNED: 'badge-error',
    LISTING_REMOVED: 'badge-error',
    REPORT_RESOLVED: 'badge-success',
    SETTINGS_UPDATED: 'badge-info',
    CATEGORY_CREATED: 'badge-success',
    TICKET_CLOSED: 'badge-success',
    ROLE_UPDATED: 'badge-info',
    ADMIN_LOGIN: 'badge-neutral',
    NOTIFICATION_SENT: 'badge-info',
  };
  return <span className={colorMap[action] || 'badge-neutral'}>{action.replace(/_/g, ' ')}</span>;
}

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const filtered = AUDIT_LOGS.filter((log) =>
    log.admin.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.target.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Audit Logs</h1>
          <p className="text-sm text-muted mt-1">Track all administrative actions and security events.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-cream text-body rounded-lg text-sm font-semibold hover:bg-tamarind-100 transition-colors">
          <Download className="w-4 h-4" />
          Export Logs
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
        <input
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-surface border border-tamarind-200 rounded-lg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/60">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Timestamp</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Admin</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Action</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Module</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Target</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tamarind-50">
              {filtered.map((log) => (
                <tr key={log.id} className="table-row-hover">
                  <td className="px-6 py-3.5 text-xs text-muted font-mono">{log.timestamp}</td>
                  <td className="px-6 py-3.5 font-medium text-heading">{log.admin}</td>
                  <td className="px-6 py-3.5"><ActionBadge action={log.action} /></td>
                  <td className="px-6 py-3.5"><span className="badge-neutral">{log.module}</span></td>
                  <td className="px-6 py-3.5 text-body max-w-[200px] truncate">{log.target}</td>
                  <td className="px-6 py-3.5 text-xs text-muted font-mono">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-tamarind-50">
          <p className="text-xs text-muted">Showing {filtered.length} of {AUDIT_LOGS.length} logs</p>
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded-lg hover:bg-cream text-muted"><ChevronLeft className="w-4 h-4" /></button>
            <button className="w-8 h-8 rounded-lg bg-primary text-white text-xs font-semibold">1</button>
            <button className="w-8 h-8 rounded-lg hover:bg-cream text-body text-xs font-semibold">2</button>
            <button className="p-1.5 rounded-lg hover:bg-cream text-muted"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
