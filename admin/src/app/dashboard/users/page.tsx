'use client';

import { useState } from 'react';
import {
  Users as UsersIcon, Search, Filter, MoreHorizontal,
  Mail, Phone, Calendar, Shield, Ban, CheckCircle2,
  ChevronLeft, ChevronRight, Eye, UserX, UserCheck,
  Download,
} from 'lucide-react';
import { formatDate, timeAgo } from '@/utils/formatters';

/* ─── Mock Data ─── */
const USERS = [
  { id: 'USR-001', name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 98765 43210', status: 'active', role: 'donor', joinDate: '2025-08-15', donations: 45, received: 12, rating: 4.9, avatar: 'PS' },
  { id: 'USR-002', name: 'Rahul Kumar', email: 'rahul@email.com', phone: '+91 87654 32109', status: 'active', role: 'donor', joinDate: '2025-09-22', donations: 38, received: 8, rating: 4.8, avatar: 'RK' },
  { id: 'USR-003', name: 'Sneha Iyer', email: 'sneha@email.com', phone: '+91 76543 21098', status: 'active', role: 'both', joinDate: '2025-10-05', donations: 32, received: 15, rating: 4.7, avatar: 'SI' },
  { id: 'USR-004', name: 'Karthik R.', email: 'karthik@email.com', phone: '+91 65432 10987', status: 'suspended', role: 'receiver', joinDate: '2025-11-18', donations: 5, received: 28, rating: 3.2, avatar: 'KR' },
  { id: 'USR-005', name: 'Anita Verma', email: 'anita@email.com', phone: '+91 54321 09876', status: 'active', role: 'donor', joinDate: '2025-12-01', donations: 25, received: 3, rating: 4.6, avatar: 'AV' },
  { id: 'USR-006', name: 'Vikram N.', email: 'vikram@email.com', phone: '+91 43210 98765', status: 'banned', role: 'receiver', joinDate: '2026-01-10', donations: 2, received: 18, rating: 2.1, avatar: 'VN' },
  { id: 'USR-007', name: 'Meera Nair', email: 'meera@email.com', phone: '+91 32109 87654', status: 'active', role: 'both', joinDate: '2026-02-14', donations: 19, received: 22, rating: 4.5, avatar: 'MN' },
  { id: 'USR-008', name: 'Deepa M.', email: 'deepa@email.com', phone: '+91 21098 76543', status: 'active', role: 'donor', joinDate: '2026-03-08', donations: 15, received: 1, rating: 4.4, avatar: 'DM' },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: 'badge-success',
    suspended: 'badge-warning',
    banned: 'badge-error',
    pending: 'badge-neutral',
  };
  return <span className={map[status] || 'badge-neutral'}>{status}</span>;
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, string> = {
    donor: 'badge-info',
    receiver: 'badge-neutral',
    both: 'bg-primary-50 text-primary-700 border border-primary-200 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold',
  };
  return <span className={map[role] || 'badge-neutral'}>{role}</span>;
}

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = USERS.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Users</h1>
          <p className="text-sm text-muted mt-1">Manage platform users, donors, and receivers.</p>
        </div>
        <button 
          onClick={() => alert('Exporting CSV...')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-600 transition-colors shadow-warm-sm"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-tamarind-200 rounded-lg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'active', 'suspended', 'banned'].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  statusFilter === s
                    ? 'bg-primary/15 text-primary-700 dark:text-primary-400 ring-1 ring-primary/30'
                    : 'bg-surface text-muted hover:bg-cream hover:text-heading border border-tamarind-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-display font-bold text-heading">{USERS.length}</p>
          <p className="text-sm text-muted">Total Users</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-display font-bold text-leaf">{USERS.filter(u => u.status === 'active').length}</p>
          <p className="text-sm text-muted">Active</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-display font-bold text-warning">{USERS.filter(u => u.status === 'suspended').length}</p>
          <p className="text-sm text-muted">Suspended</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-display font-bold text-error">{USERS.filter(u => u.status === 'banned').length}</p>
          <p className="text-sm text-muted">Banned</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/60">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">User</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Role</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Donated</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Received</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Rating</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tamarind-50">
              {paginated.map((user) => (
                <tr key={user.id} className="table-row-hover">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center">
                        <span className="text-xs font-bold text-white">{user.avatar}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-heading">{user.name}</p>
                        <p className="text-xs text-muted">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <p className="text-body">{user.email}</p>
                    <p className="text-xs text-muted">{user.phone}</p>
                  </td>
                  <td className="px-6 py-3.5"><RoleBadge role={user.role} /></td>
                  <td className="px-6 py-3.5 font-semibold text-heading">{user.donations}</td>
                  <td className="px-6 py-3.5 font-semibold text-heading">{user.received}</td>
                  <td className="px-6 py-3.5">
                    <span className="flex items-center gap-1 text-heading font-semibold">
                      ⭐ {user.rating}
                    </span>
                  </td>
                  <td className="px-6 py-3.5"><StatusBadge status={user.status} /></td>
                  <td className="px-6 py-3.5 text-muted text-xs">{formatDate(user.joinDate)}</td>
                  <td className="px-6 py-3.5">
                    <button className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-heading transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-tamarind-50">
          <p className="text-xs text-muted">Showing {Math.min((page - 1) * itemsPerPage + 1, filtered.length)} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} users</p>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-cream text-muted disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  page === i + 1 
                    ? 'bg-primary/15 text-primary-700 dark:text-primary-400 ring-1 ring-primary/30' 
                    : 'hover:bg-cream text-muted hover:text-heading'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="p-1.5 rounded-lg hover:bg-cream text-muted disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
