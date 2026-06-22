'use client';

import { useState } from 'react';
import { 
  Bell, Check, AlertTriangle, MessageSquare, 
  UserPlus, Flag, Gift, Search, Trash2, Settings
} from 'lucide-react';
import { timeAgo } from '@/utils/formatters';

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'alert',
    title: 'High Volume of Flags',
    message: 'We have received 15 new flags on user "Vikram N." within the last hour. Please review immediately.',
    time: '2026-06-22T23:45:00',
    read: false,
    icon: AlertTriangle,
    iconColor: 'text-error',
    iconBg: 'bg-error/10'
  },
  {
    id: 'notif-2',
    type: 'support',
    title: 'New Support Escalation',
    message: 'Ticket TKT-502 has been escalated to High Priority. User claims item was not received.',
    time: '2026-06-22T21:30:00',
    read: false,
    icon: MessageSquare,
    iconColor: 'text-warning',
    iconBg: 'bg-warning/10'
  },
  {
    id: 'notif-3',
    type: 'user',
    title: 'New Verification Request',
    message: 'Organization "GreenEarth NGO" has submitted documents for verification.',
    time: '2026-06-22T18:15:00',
    read: true,
    icon: UserPlus,
    iconColor: 'text-primary',
    iconBg: 'bg-primary/10'
  },
  {
    id: 'notif-4',
    type: 'donation',
    title: 'Large Donation Listed',
    message: 'A new high-value item (Medical Equipment bundle) was listed in Bengaluru.',
    time: '2026-06-22T14:00:00',
    read: true,
    icon: Gift,
    iconColor: 'text-leaf',
    iconBg: 'bg-leaf/10'
  },
  {
    id: 'notif-5',
    type: 'system',
    title: 'System Maintenance Scheduled',
    message: 'Database optimization is scheduled for June 25th, 02:00 AM IST. Expect 15 mins of downtime.',
    time: '2026-06-21T09:00:00',
    read: true,
    icon: Settings,
    iconColor: 'text-muted',
    iconBg: 'bg-cream'
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [search, setSearch] = useState('');

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread' && n.read) return false;
    if (search && !n.title.toLowerCase().includes(search.toLowerCase()) && !n.message.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-heading tracking-tight flex items-center gap-3">
            Notifications 
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-muted mt-1">Stay updated with system alerts and platform activity.</p>
        </div>
        
        <button 
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-tamarind-200 text-body rounded-lg text-sm font-semibold hover:bg-cream transition-colors disabled:opacity-50"
        >
          <Check className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      {/* ─── Controls ─── */}
      <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 p-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-background border border-[var(--color-border)] rounded-lg placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
        <div className="flex bg-background border border-[var(--color-border)] rounded-lg p-1 shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              filter === 'all' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-heading hover:bg-cream'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${
              filter === 'unread' ? 'bg-primary text-white shadow-sm' : 'text-muted hover:text-heading hover:bg-cream'
            }`}
          >
            Unread
          </button>
        </div>
      </div>

      {/* ─── List ─── */}
      <div className="bg-surface rounded-xl shadow-warm-md border border-tamarind-50 overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-muted" />
            </div>
            <h3 className="text-lg font-bold text-heading">No notifications found</h3>
            <p className="text-muted mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-tamarind-50">
            {filteredNotifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <div 
                  key={notif.id} 
                  className={`p-5 transition-colors group relative ${notif.read ? 'bg-surface hover:bg-cream/50' : 'bg-primary-50/30 dark:bg-primary/5 hover:bg-primary-50/50 dark:hover:bg-primary/10'}`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notif.iconBg}`}>
                      <Icon className={`w-5 h-5 ${notif.iconColor}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0 pr-8">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`text-sm font-semibold truncate ${notif.read ? 'text-heading' : 'text-primary-700 dark:text-primary-400'}`}>
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                        )}
                      </div>
                      <p className={`text-sm leading-snug ${notif.read ? 'text-muted' : 'text-body font-medium'}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-muted mt-2">
                        {timeAgo(notif.time)}
                      </p>
                    </div>

                    <div className="absolute right-5 top-5 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                      {!notif.read && (
                        <button 
                          onClick={() => markAsRead(notif.id)}
                          className="p-1.5 text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteNotification(notif.id)}
                        className="p-1.5 text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
