'use client';

import { useState } from 'react';
import {
  Heart, Search, Filter, MoreHorizontal, Eye,
  ChevronLeft, ChevronRight, Plus, Archive, Flag,
  Download, Image as ImageIcon,
} from 'lucide-react';
import { timeAgo, formatDate } from '@/utils/formatters';

/* Mock data uses actual items from the ThankU web app */
const DONATIONS = [
  { id: 'DON-3001', donor: 'Priya Sharma', item: 'Vintage Wooden Bookshelf', category: 'Furniture', condition: 'Like New', status: 'available', location: 'Anna Nagar, Chennai', image: '🛋️', date: '2026-06-20', views: 24, rating: '4.8' },
  { id: 'DON-3002', donor: 'Rahul Kumar', item: 'Samsung Galaxy S21 Ultra', category: 'Electronics', condition: 'Good', status: 'claimed', location: 'Koramangala, Bengaluru', image: '📱', date: '2026-06-19', views: 56, rating: '4.5' },
  { id: 'DON-3003', donor: 'Sneha Iyer', item: 'Harry Potter Complete Box Set', category: 'Books', condition: 'New', status: 'available', location: 'Bandra, Mumbai', image: '📚', date: '2026-06-18', views: 31, rating: '5.0' },
  { id: 'DON-3004', donor: 'Karthik R.', item: 'Nike Running Shoes (Size 10)', category: 'Sports', condition: 'Like New', status: 'claimed', location: 'Jubilee Hills, Hyderabad', image: '⚽', date: '2026-06-17', views: 42, rating: '4.7' },
  { id: 'DON-3005', donor: 'Anita Verma', item: 'IKEA Study Desk with Drawers', category: 'Furniture', condition: 'Good', status: 'pending', location: 'Connaught Place, Delhi', image: '🛋️', date: '2026-06-16', views: 18, rating: '4.3' },
  { id: 'DON-3006', donor: 'Meera Nair', item: 'KitchenAid Mixer — Barely Used', category: 'Kitchen', condition: 'Like New', status: 'available', location: 'Salt Lake, Kolkata', image: '🍳', date: '2026-06-15', views: 37, rating: '4.9' },
  { id: 'DON-3007', donor: 'Deepa M.', item: 'Children\'s Building Blocks Set', category: 'Toys', condition: 'Good', status: 'flagged', location: 'Adyar, Chennai', image: '🧸', date: '2026-06-14', views: 12, rating: '4.6' },
  { id: 'DON-3008', donor: 'Vikram N.', item: 'Medical Pulse Oximeter', category: 'Medical', condition: 'New', status: 'available', location: 'HSR Layout, Bengaluru', image: '🩺', date: '2026-06-13', views: 89, rating: '4.4' },
  { id: 'DON-3009', donor: 'Suman K.', item: 'Indoor Potted Monstera Plant', category: 'Plants', condition: 'Like New', status: 'claimed', location: 'Indiranagar, Bengaluru', image: '🌿', date: '2026-06-12', views: 65, rating: '4.9' },
  { id: 'DON-3010', donor: 'Arun P.', item: 'Box of Non-perishable Groceries', category: 'Food', condition: 'New', status: 'available', location: 'T Nagar, Chennai', image: '🥫', date: '2026-06-11', views: 43, rating: '5.0' },
  { id: 'DON-3011', donor: 'Lakshmi V.', item: 'Acoustic Guitar with Soft Case', category: 'Other', condition: 'Good', status: 'expired', location: 'Banjara Hills, Hyderabad', image: '📦', date: '2026-06-10', views: 28, rating: '4.5' },
  { id: 'DON-3012', donor: 'Ravi T.', item: 'Men\'s Winter Jacket (Size L)', category: 'Clothing', condition: 'Good', status: 'available', location: 'Andheri West, Mumbai', image: '👕', date: '2026-06-09', views: 52, rating: '4.2' },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    available: 'badge-success',
    claimed: 'badge-info',
    pending: 'badge-warning',
    flagged: 'badge-error',
    expired: 'badge-neutral',
  };
  return <span className={map[status] || 'badge-neutral'}>{status}</span>;
}

function ConditionBadge({ condition }: { condition: string }) {
  const map: Record<string, string> = {
    'New': 'badge-success',
    'Like New': 'badge-success',
    'Good': 'badge-info',
    'Fair': 'badge-warning',
    'Poor': 'badge-error',
  };
  return <span className={map[condition] || 'badge-neutral'}>{condition}</span>;
}

export default function DonationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = DONATIONS.filter((d) => {
    const matchSearch = d.item.toLowerCase().includes(search.toLowerCase()) || d.donor.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Donations</h1>
          <p className="text-sm text-muted mt-1">Manage all donated items listed on the ThankU platform.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => alert('Exporting donations data...')}
            className="flex items-center gap-2 px-4 py-2.5 bg-cream text-body rounded-lg text-sm font-semibold hover:bg-tamarind-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total', count: DONATIONS.length, color: 'text-heading' },
          { label: 'Available', count: DONATIONS.filter(d => d.status === 'available').length, color: 'text-leaf' },
          { label: 'Claimed', count: DONATIONS.filter(d => d.status === 'claimed').length, color: 'text-info' },
          { label: 'Pending', count: DONATIONS.filter(d => d.status === 'pending').length, color: 'text-warning' },
          { label: 'Flagged', count: DONATIONS.filter(d => d.status === 'flagged').length, color: 'text-error' },
        ].map((s) => (
          <div key={s.label} className="stat-card text-center">
            <p className={`text-2xl font-display font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-muted mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search items or donors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-tamarind-200 rounded-lg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'available', 'claimed', 'pending', 'flagged', 'expired'].map((s) => (
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

      {/* Table */}
      <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream/60">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Item</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Donor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Condition</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Location</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Views</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Listed</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tamarind-50">
              {paginated.map((item) => (
                <tr key={item.id} className="table-row-hover">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center text-lg">
                        {item.image}
                      </div>
                      <div>
                        <p className="font-semibold text-heading">{item.item}</p>
                        <p className="text-xs text-muted">{item.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-body font-medium">{item.donor}</td>
                  <td className="px-6 py-3.5"><span className="badge-neutral">{item.category}</span></td>
                  <td className="px-6 py-3.5"><ConditionBadge condition={item.condition} /></td>
                  <td className="px-6 py-3.5 text-muted text-xs">{item.location}</td>
                  <td className="px-6 py-3.5 text-muted">{item.views}</td>
                  <td className="px-6 py-3.5"><StatusBadge status={item.status} /></td>
                  <td className="px-6 py-3.5 text-muted text-xs">{formatDate(item.date)}</td>
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-tamarind-50">
          <p className="text-xs text-muted">Showing {Math.min((page - 1) * itemsPerPage + 1, filtered.length)} to {Math.min(page * itemsPerPage, filtered.length)} of {filtered.length} items</p>
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
