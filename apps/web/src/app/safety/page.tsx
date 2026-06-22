'use client';

import React from 'react';
import Link from 'next/link';
import { IoChevronForward, IoShieldCheckmarkOutline, IoLocationOutline, IoWarningOutline, IoEyeOutline } from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const SAFETY_TIPS = [
  {
    icon: IoLocationOutline,
    title: 'Meet in Public Places',
    description: 'Always arrange to meet in well-lit, public locations like coffee shops, mall food courts, or police station parking lots. Avoid meeting in secluded areas or inviting strangers into your home.'
  },
  {
    icon: IoEyeOutline,
    title: 'Inspect Items Carefully',
    description: 'Take your time to thoroughly inspect the item before accepting it. Ensure it matches the description and condition stated in the listing. For electronics, try to test them if possible.'
  },
  {
    icon: IoWarningOutline,
    title: 'Never Share Financial Info',
    description: 'ThankU is a platform for completely free items. Never share your bank details, credit card numbers, or transfer money for "shipping" or "holding" an item.'
  },
  {
    icon: IoShieldCheckmarkOutline,
    title: 'Trust Your Instincts',
    description: 'If a conversation or situation feels wrong, trust your gut. You are never obligated to complete a meetup. Report any suspicious users directly through the app.'
  }
];

export default function SafetyPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <IoChevronForward size={12} />
            <span>Safety Guidelines</span>
          </nav>

          <div className={styles.headerSection}>
            <div className={styles.iconWrapper}>
              <IoShieldCheckmarkOutline size={48} color="var(--color-success)" />
            </div>
            <h1 className={styles.title}>Trust & Safety</h1>
            <p className={styles.subtitle}>Our top priority is keeping the ThankU community safe and welcoming.</p>
          </div>

          <div className={styles.tipsGrid}>
            {SAFETY_TIPS.map((tip, index) => (
              <div key={index} className={styles.tipCard}>
                <div className={styles.tipIconWrapper}>
                  <tip.icon size={32} className={styles.tipIcon} />
                </div>
                <h3 className={styles.tipTitle}>{tip.title}</h3>
                <p className={styles.tipDesc}>{tip.description}</p>
              </div>
            ))}
          </div>

          <div className={styles.reportSection}>
            <h2 className={styles.reportTitle}>See something suspicious?</h2>
            <p className={styles.reportDesc}>
              Help us keep the community safe. If you encounter fake listings, people asking for money, or inappropriate behavior, please report it immediately.
            </p>
            <button className={styles.reportBtn}>Report an Issue</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
