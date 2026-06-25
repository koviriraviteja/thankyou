'use client';

import { useState } from 'react';
import {
  Flag, Search, Eye, CheckCircle2, XCircle, AlertTriangle,
  ChevronLeft, ChevronRight, MoreHorizontal, MessageSquare,
} from 'lucide-react';

const REPORTS = [
  { id: 'RPT-101', reporter: 'Meera Nair', target: 'DON-3007 (Wooden Study Table)', targetType: 'listing', reason: 'Misleading photos', description: 'The photos do not match the actual condition of the item. Item appears damaged.', status: 'open', priority: 'high', date: '2026-06-21' },
  { id: 'RPT-102', reporter: 'Rahul Kumar', target: 'Vikram N.', targetType: 'user', reason: 'Spam / Fake account', description: 'This user is posting duplicate listings and never responds to messages.', status: 'investigating', priority: 'medium', date: '2026-06-20' },
  { id: 'RPT-103', reporter: 'Priya Sharma', target: 'DON-2998 (iPhone Cable)', targetType: 'listing', reason: 'Prohibited item', description: 'Item appears to be counterfeit / not genuine.', status: 'open', priority: 'low', date: '2026-06-19' },
  { id: 'RPT-104', reporter: 'Anita Verma', target: 'Deepa M.', targetType: 'user', reason: 'Abusive behavior', description: 'User sent aggressive messages after I claimed an item. Screenshots attached.', status: 'resolved', priority: 'high', date: '2026-06-18' },
  { id: 'RPT-105', reporter: 'Karthik R.', target: 'DON-2985 (Gaming Chair)', targetType: 'listing', reason: 'Item not as described', description: 'Claimed to be "Like New" but has significant wear and tear.', status: 'dismissed', priority: 'low', date: '2026-06-15' },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    open: 'badge-error',
    investigating: 'badge-warning',
    resolved: 'badge-success',
    dismissed: 'badge-neutral',
  };
  return <span className={map[status] || 'badge-neutral'}>{status}</span>;
}

function PriorityDot({ priority }: { priority: string }) {
  const colorMap: Record<string, string> = {
    high: 'bg-error',
    medium: 'bg-warning',
    low: 'bg-leaf',
  };
  return (
    <span className="flex items-center gap-1.5">
      <span className={`w-2 h-2 rounded-full ${colorMap[priority]}`} />
      <span className="capitalize text-sm">{priority}</span>
    </span>
  );
}

export default function ReportsPage() {
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = REPORTS.filter((r) => statusFilter === 'all' || r.status === statusFilter);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Reports</h1>
        <p className="text-sm text-muted mt-1">Review flagged content and user reports.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4 text-error" /></div>
          <p className="text-2xl font-display font-bold text-error">{REPORTS.filter(r => r.status === 'open').length}</p>
          <p className="text-xs text-muted">Open</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2"><Eye className="w-4 h-4 text-warning" /></div>
          <p className="text-2xl font-display font-bold text-warning">{REPORTS.filter(r => r.status === 'investigating').length}</p>
          <p className="text-xs text-muted">Investigating</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="w-4 h-4 text-leaf" /></div>
          <p className="text-2xl font-display font-bold text-leaf">{REPORTS.filter(r => r.status === 'resolved').length}</p>
          <p className="text-xs text-muted">Resolved</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 mb-2"><XCircle className="w-4 h-4 text-muted" /></div>
          <p className="text-2xl font-display font-bold text-muted">{REPORTS.filter(r => r.status === 'dismissed').length}</p>
          <p className="text-xs text-muted">Dismissed</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'open', 'investigating', 'resolved', 'dismissed'].map((s) => (
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

      {/* Report Cards */}
      <div className="space-y-4">
        {filtered.map((report) => (
          <div key={report.id} className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-5 hover:shadow-warm-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.targetType === 'user' ? 'bg-primary-50' : 'bg-gold-50'}`}>
                  <Flag className={`w-5 h-5 ${report.targetType === 'user' ? 'text-primary' : 'text-gold-600'}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-heading">{report.reason}</h3>
                  <p className="text-xs text-muted">{report.id} • Reported by {report.reporter}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <PriorityDot priority={report.priority} />
                <StatusBadge status={report.status} />
              </div>
            </div>
            <p className="text-sm text-body mb-3">{report.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-muted">
                <span>Target: <span className="font-semibold text-heading">{report.target}</span></span>
                <span className="badge-neutral">{report.targetType}</span>
                <span>{report.date}</span>
              </div>
              <div className="flex gap-1">
                {report.status === 'open' && (
                  <>
                    <button 
                      onClick={() => alert('Report marked as Resolved')}
                      className="px-3 py-1.5 rounded-lg bg-leaf-50 text-leaf text-xs font-semibold hover:bg-leaf-100 transition-colors"
                    >
                      Resolve
                    </button>
                    <button 
                      onClick={() => alert('Report Dismissed')}
                      className="px-3 py-1.5 rounded-lg bg-cream text-muted text-xs font-semibold hover:bg-tamarind-100 transition-colors"
                    >
                      Dismiss
                    </button>
                  </>
                )}
                <button className="p-1.5 rounded-lg hover:bg-cream text-muted hover:text-heading transition-colors">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
