'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IoNotificationsOutline, IoHeartOutline, IoChatboxOutline, IoCheckmarkCircleOutline, IoFilterOutline } from 'react-icons/io5';
import styles from './page.module.css';

const NOTIFICATIONS = [
  { id: 1, type: 'chat', title: 'New message from Rahul', desc: 'Hey! Is the bookshelf still available?', time: '10 min ago', isUnread: true, icon: IoChatboxOutline },
  { id: 2, type: 'like', title: 'Someone liked your item', desc: 'Priya saved your "Vintage Desk" to her favorites.', time: '2 hours ago', isUnread: true, icon: IoHeartOutline },
  { id: 3, type: 'success', title: 'Item claimed successfully', desc: 'You have successfully scheduled the pickup for the TV.', time: 'Yesterday', isUnread: false, icon: IoCheckmarkCircleOutline },
];

const FILTERS = [
  { id: 'all', label: 'All Notifications' },
  { id: 'unread', label: 'Unread' },
  { id: 'messages', label: 'Messages' },
  { id: 'likes', label: 'Likes & Favorites' },
  { id: 'system', label: 'System Alerts' },
];

export default function NotificationsPage() {
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h1 className={styles.title}>Notifications</h1>
            </div>
            
            <div className={styles.filterList}>
              <div className={styles.filterTitle}>
                <IoFilterOutline size={16} /> Filters
              </div>
              {FILTERS.map(filter => (
                <button
                  key={filter.id}
                  className={`${styles.filterBtn} ${activeFilter === filter.id ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </aside>

          <section className={styles.content}>
            <div className={styles.contentHeader}>
              <h2 className={styles.contentTitle}>
                {FILTERS.find(f => f.id === activeFilter)?.label}
              </h2>
              <button className={styles.markReadBtn}>Mark all as read</button>
            </div>

            <div className={styles.list}>
              {NOTIFICATIONS.length > 0 ? (
                NOTIFICATIONS.map(notif => {
                  const Icon = notif.icon;
                  return (
                    <div key={notif.id} className={`${styles.card} ${notif.isUnread ? styles.unread : ''}`}>
                      <div className={styles.iconWrapper}>
                        <Icon size={24} />
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.notifTitle}>{notif.title}</h3>
                        <p className={styles.notifDesc}>{notif.desc}</p>
                        <span className={styles.notifTime}>{notif.time}</span>
                      </div>
                      {notif.isUnread && <div className={styles.unreadDot} />}
                    </div>
                  );
                })
              ) : (
                <div className={styles.empty}>
                  <IoNotificationsOutline size={48} className={styles.emptyIcon} />
                  <p>You have no new notifications.</p>
                </div>
              )}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
