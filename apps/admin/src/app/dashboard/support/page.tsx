'use client';

import { useState } from 'react';
import {
  HeadphonesIcon, Search, MessageSquare, Clock, CheckCircle2,
  AlertCircle, ChevronRight, User, MoreHorizontal,
} from 'lucide-react';

const TICKETS = [
  { id: 'TKT-501', user: 'Priya Sharma', subject: 'Unable to upload photos', category: 'technical', status: 'open', priority: 'high', created: '2026-06-21 14:30', lastReply: '2026-06-21 16:45', messages: 3 },
  { id: 'TKT-502', user: 'Rahul Kumar', subject: 'Item not received after claiming', category: 'dispute', status: 'open', priority: 'high', created: '2026-06-20 10:00', lastReply: '2026-06-21 09:15', messages: 5 },
  { id: 'TKT-503', user: 'Sneha Iyer', subject: 'How to edit my listing?', category: 'general', status: 'pending', priority: 'low', created: '2026-06-19 18:20', lastReply: '2026-06-20 11:00', messages: 2 },
  { id: 'TKT-504', user: 'Karthik R.', subject: 'Account suspended unfairly', category: 'account', status: 'pending', priority: 'medium', created: '2026-06-18 09:00', lastReply: '2026-06-19 14:30', messages: 4 },
  { id: 'TKT-505', user: 'Anita Verma', subject: 'Delete my account and data', category: 'account', status: 'closed', priority: 'medium', created: '2026-06-15 11:30', lastReply: '2026-06-16 10:00', messages: 3 },
  { id: 'TKT-506', user: 'Meera Nair', subject: 'App crashes on Android 14', category: 'technical', status: 'closed', priority: 'high', created: '2026-06-12 08:00', lastReply: '2026-06-14 16:20', messages: 7 },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { open: 'badge-error', pending: 'badge-warning', closed: 'badge-success' };
  return <span className={map[status] || 'badge-neutral'}>{status}</span>;
}

function PriorityDot({ priority }: { priority: string }) {
  const map: Record<string, string> = { high: 'bg-error', medium: 'bg-warning', low: 'bg-leaf' };
  return <span className={`w-2 h-2 rounded-full ${map[priority]}`} />;
}

export default function SupportPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const filtered = TICKETS.filter((t) => statusFilter === 'all' || t.status === statusFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Support Tickets</h1>
        <p className="text-sm text-muted mt-1">Manage user queries and complaints.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="text-2xl font-display font-bold text-error">{TICKETS.filter(t => t.status === 'open').length}</p>
          <p className="text-xs text-muted">Open Tickets</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-display font-bold text-warning">{TICKETS.filter(t => t.status === 'pending').length}</p>
          <p className="text-xs text-muted">Pending Response</p>
        </div>
        <div className="stat-card">
          <p className="text-2xl font-display font-bold text-leaf">{TICKETS.filter(t => t.status === 'closed').length}</p>
          <p className="text-xs text-muted">Resolved</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['all', 'open', 'pending', 'closed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
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

      {/* Ticket List */}
      <div className="space-y-3">
        {filtered.map((ticket) => (
          <div key={ticket.id} className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-5 hover:shadow-warm-lg transition-shadow cursor-pointer group">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-gold flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-white">{ticket.user.split(' ').map(w => w[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <PriorityDot priority={ticket.priority} />
                    <h3 className="font-semibold text-heading truncate">{ticket.subject}</h3>
                  </div>
                  <p className="text-sm text-muted mb-2">{ticket.user} • {ticket.id}</p>
                  <div className="flex items-center gap-3 text-xs text-muted">
                    <span className="badge-neutral">{ticket.category}</span>
                    <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" /> {ticket.messages} messages</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Last reply: {ticket.lastReply}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusBadge status={ticket.status} />
                <ChevronRight className="w-4 h-4 text-muted group-hover:text-heading transition-colors" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
