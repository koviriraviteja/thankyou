'use client';

import {
  Users, Heart, ShoppingCart, MapPin,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  Package, Clock, AlertCircle, CheckCircle2,
  Eye, Star, HandHeart,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { formatNumber, timeAgo } from '@/utils/formatters';

/* ─────────────── Mock Data ─────────────── */

const stats = [
  { label: 'Total Users', value: 5642, change: 12.5, icon: Users, color: 'primary' },
  { label: 'Items Donated', value: 1284, change: 8.2, icon: Heart, color: 'leaf' },
  { label: 'Active Requests', value: 342, change: -2.4, icon: ShoppingCart, color: 'gold' },
  { label: 'Communities', value: 48, change: 15.3, icon: MapPin, color: 'tamarind' },
];

const donationTrend = [
  { month: 'Jan', donations: 85, requests: 120 },
  { month: 'Feb', donations: 120, requests: 145 },
  { month: 'Mar', donations: 98, requests: 132 },
  { month: 'Apr', donations: 180, requests: 198 },
  { month: 'May', donations: 165, requests: 176 },
  { month: 'Jun', donations: 220, requests: 245 },
  { month: 'Jul', donations: 195, requests: 228 },
  { month: 'Aug', donations: 265, requests: 267 },
];

const categoryData = [
  { name: 'Clothing', value: 20, color: '#5FD5E3' }, // primary
  { name: 'Electronics', value: 13, color: '#23C7C9' }, // primary-500
  { name: 'Furniture', value: 10, color: '#FF8A00' }, // gold
  { name: 'Books', value: 17, color: '#2ECC71' }, // leaf
  { name: 'Toys', value: 12, color: '#8B8CF7' }, // purple (from web app globals)
  { name: 'Kitchen', value: 8, color: '#EF4444' }, // error (red)
  { name: 'Sports', value: 5, color: '#3B82F6' }, // info (blue)
  { name: 'Medical', value: 3, color: '#F59E0B' }, // warning (amber)
  { name: 'Plants', value: 4, color: '#28B463' }, // dark leaf
  { name: 'Food', value: 6, color: '#FFB4A2' }, // coral
  { name: 'Other', value: 2, color: '#D1D5DB' }, // gray
];

const topDonors = [
  { name: 'Priya Sharma', donations: 45, rating: 4.9 },
  { name: 'Rahul Kumar', donations: 38, rating: 4.8 },
  { name: 'Sneha Iyer', donations: 32, rating: 4.7 },
  { name: 'Karthik R.', donations: 28, rating: 4.7 },
  { name: 'Anita Verma', donations: 25, rating: 4.6 },
];

const recentDonations = [
  { id: 'DON-3001', donor: 'Priya Sharma', item: 'Vintage Wooden Bookshelf', category: 'Furniture', status: 'claimed', date: new Date(Date.now() - 3600000).toISOString() },
  { id: 'DON-3002', donor: 'Rahul K.', item: 'Samsung Galaxy S21 Ultra', category: 'Electronics', status: 'available', date: new Date(Date.now() - 7200000).toISOString() },
  { id: 'DON-3003', donor: 'Sneha Iyer', item: 'Harry Potter Complete Box Set', category: 'Books', status: 'pending', date: new Date(Date.now() - 14400000).toISOString() },
  { id: 'DON-3004', donor: 'Karthik R.', item: 'Nike Running Shoes (Size 10)', category: 'Sports', status: 'claimed', date: new Date(Date.now() - 28800000).toISOString() },
  { id: 'DON-3005', donor: 'Anita V.', item: 'KitchenAid Mixer — Barely Used', category: 'Kitchen', status: 'available', date: new Date(Date.now() - 43200000).toISOString() },
];

const recentActivity = [
  { type: 'user_registered', message: 'New user Meera Nair joined the community', time: new Date(Date.now() - 600000).toISOString() },
  { type: 'donation_listed', message: 'Priya Sharma listed "Winter Jacket"', time: new Date(Date.now() - 1800000).toISOString() },
  { type: 'item_claimed', message: 'Deepa M. claimed "Samsung Galaxy S21"', time: new Date(Date.now() - 3600000).toISOString() },
  { type: 'thanku_sent', message: 'Vikram sent a ThankU note to Sneha', time: new Date(Date.now() - 7200000).toISOString() },
  { type: 'report_filed', message: 'Report filed on listing DON-2830', time: new Date(Date.now() - 10800000).toISOString() },
];

/* ─────────────── Status Badge ─────────────── */

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    claimed: 'badge-success',
    available: 'badge-info',
    pending: 'badge-warning',
    expired: 'badge-neutral',
    flagged: 'badge-error',
  };
  return <span className={styles[status] || 'badge-neutral'}>{status}</span>;
}

/* ─────────────── Stat Card ─────────────── */

function StatCard({ stat }: { stat: typeof stats[0] }) {
  const Icon = stat.icon;
  const isPositive = stat.change >= 0;
  const colorMap: Record<string, string> = {
    primary: 'bg-primary-50 text-primary',
    leaf: 'bg-leaf-50 text-leaf',
    gold: 'bg-gold-50 text-gold-600',
    tamarind: 'bg-tamarind-50 text-tamarind',
  };

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${colorMap[stat.color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-leaf' : 'text-error'}`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(stat.change)}%
        </div>
      </div>
      <p className="text-2xl font-bold text-heading font-display tracking-tight">
        {formatNumber(stat.value)}
      </p>
      <p className="text-sm text-muted mt-1">{stat.label}</p>
    </div>
  );
}

/* ─────────────── Chart Tooltip ─────────────── */

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface rounded-lg shadow-warm-xl border border-tamarind-100 px-4 py-3">
      <p className="text-xs font-semibold text-heading mb-1">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} className="text-xs text-muted">
          <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

/* ═══════════════ DASHBOARD PAGE ═══════════════ */

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* ─── Page Header ─── */}
      <div>
        <h1 className="text-3xl font-display font-bold text-heading tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted mt-1">Welcome back! Here's what's happening on the ThankU platform.</p>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} stat={stat} />
        ))}
      </div>

      {/* ─── Charts Row ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donation Trend — 2/3 width */}
        <div className="lg:col-span-2 bg-surface rounded-xl p-6 shadow-warm-md border border-tamarind-50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-display font-bold text-heading">Donation & Request Trends</h2>
              <p className="text-xs text-muted mt-0.5">Monthly items donated vs. requests placed</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Donations
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gold" /> Requests
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={donationTrend}>
              <defs>
                <linearGradient id="donationGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5FD5E3" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#5FD5E3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="donations" stroke="#5FD5E3" strokeWidth={2.5} fill="url(#donationGrad)" />
              <Area type="monotone" dataKey="requests" stroke="#FF8A00" strokeWidth={2} fill="none" strokeDasharray="5 5" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Distribution — 1/3 width */}
        <div className="bg-surface rounded-xl p-6 shadow-warm-md border border-tamarind-50">
          <h2 className="text-lg font-display font-bold text-heading mb-1">Category Split</h2>
          <p className="text-xs text-muted mb-4">Donations by item category</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} stroke="var(--color-surface)" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                  <span className="text-body font-medium">{cat.name}</span>
                </span>
                <span className="text-muted font-semibold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Top Donors Bar Chart ─── */}
      <div className="bg-surface rounded-xl p-6 shadow-warm-md border border-tamarind-50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-display font-bold text-heading">Top Donors</h2>
            <p className="text-xs text-muted mt-0.5">Community leaders by donation count this month</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={topDonors} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} width={140} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="donations" fill="#5FD5E3" radius={[0, 6, 6, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Bottom Row: Recent Donations + Activity ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Donations — 2/3 */}
        <div className="lg:col-span-2 bg-surface rounded-xl shadow-warm-md border border-tamarind-50 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-tamarind-50">
            <h2 className="text-lg font-display font-bold text-heading">Recent Donations</h2>
            <button className="text-xs text-primary font-semibold hover:underline">View All →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream/60">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Donor</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Item</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-muted uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tamarind-50">
                {recentDonations.map((donation) => (
                  <tr key={donation.id} className="table-row-hover">
                    <td className="px-6 py-3.5 font-semibold text-primary">{donation.id}</td>
                    <td className="px-6 py-3.5 text-heading font-medium">{donation.donor}</td>
                    <td className="px-6 py-3.5 text-body">{donation.item}</td>
                    <td className="px-6 py-3.5">
                      <span className="badge-neutral">{donation.category}</span>
                    </td>
                    <td className="px-6 py-3.5"><StatusBadge status={donation.status} /></td>
                    <td className="px-6 py-3.5 text-muted text-xs">{timeAgo(donation.date)}</td>
                    <td className="px-6 py-3.5">
                      <button className="p-1 rounded hover:bg-cream text-muted hover:text-heading transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity — 1/3 */}
        <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50">
          <div className="flex items-center justify-between px-6 py-4 border-b border-tamarind-50">
            <h2 className="text-lg font-display font-bold text-heading">Activity Feed</h2>
          </div>
          <div className="divide-y divide-tamarind-50">
            {recentActivity.map((activity, i) => {
              const iconMap: Record<string, { icon: any; color: string }> = {
                user_registered: { icon: Users, color: 'text-leaf' },
                donation_listed: { icon: Heart, color: 'text-primary' },
                item_claimed: { icon: CheckCircle2, color: 'text-leaf' },
                thanku_sent: { icon: Star, color: 'text-gold-600' },
                report_filed: { icon: AlertCircle, color: 'text-warning' },
              };
              const config = iconMap[activity.type] || { icon: Clock, color: 'text-muted' };
              const ActivityIcon = config.icon;

              return (
                <div key={i} className="flex items-start gap-3 px-6 py-3.5">
                  <div className={`mt-0.5 ${config.color}`}>
                    <ActivityIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-body leading-snug">{activity.message}</p>
                    <p className="text-[11px] text-muted mt-0.5">{timeAgo(activity.time)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
