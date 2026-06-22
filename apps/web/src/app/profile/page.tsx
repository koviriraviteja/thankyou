'use client';

import React from 'react';
import Link from 'next/link';
import { 
  IoPersonOutline, IoSettingsOutline, IoNotificationsOutline, 
  IoHelpCircleOutline, IoShieldCheckmarkOutline, IoLogOutOutline,
  IoChevronForward, IoStar
} from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function ProfilePage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header Info */}
          <div className={styles.profileHeader}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                <IoPersonOutline size={40} color="var(--color-primary)" />
              </div>
            </div>
            <h1 className={styles.name}>Rahul Kumar</h1>
            <p className={styles.phone}>+91 98765 43210</p>
            
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>12</span>
                <span className={styles.statLabel}>Donated</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>
                  4.8 <IoStar size={12} color="var(--color-gold)" />
                </span>
                <span className={styles.statLabel}>Rating</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.statItem}>
                <span className={styles.statValue}>15</span>
                <span className={styles.statLabel}>Impact Score</span>
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          <div className={styles.menuSection}>
            <div className={styles.menuGroup}>
              <h2 className={styles.menuTitle}>Account</h2>
              <Link href="/profile/edit" className={styles.menuItem}>
                <IoPersonOutline size={22} className={styles.menuIcon} />
                <span className={styles.menuText}>Edit Profile</span>
                <IoChevronForward size={20} className={styles.menuChevron} />
              </Link>
              <Link href="/settings/notifications" className={styles.menuItem}>
                <IoNotificationsOutline size={22} className={styles.menuIcon} />
                <span className={styles.menuText}>Notifications</span>
                <IoChevronForward size={20} className={styles.menuChevron} />
              </Link>
            </div>

            <div className={styles.menuGroup}>
              <h2 className={styles.menuTitle}>Support & Legal</h2>
              <Link href="/help" className={styles.menuItem}>
                <IoHelpCircleOutline size={22} className={styles.menuIcon} />
                <span className={styles.menuText}>Help Center</span>
                <IoChevronForward size={20} className={styles.menuChevron} />
              </Link>
              <Link href="/safety" className={styles.menuItem}>
                <IoShieldCheckmarkOutline size={22} className={styles.menuIcon} />
                <span className={styles.menuText}>Safety Guidelines</span>
                <IoChevronForward size={20} className={styles.menuChevron} />
              </Link>
            </div>

            <div className={styles.menuGroup}>
              <button className={`${styles.menuItem} ${styles.menuItemLogout}`}>
                <IoLogOutOutline size={22} className={styles.logoutIcon} />
                <span className={styles.logoutText}>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
