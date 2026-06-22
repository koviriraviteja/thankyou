'use client';

import React from 'react';
import Link from 'next/link';
import { IoChevronForward, IoTrophyOutline, IoMedalOutline, IoStar } from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const MOCK_LEADERS = [
  { id: '1', rank: 1, name: 'Priya Sharma', impactScore: 1250, donations: 45 },
  { id: '2', rank: 2, name: 'Rahul Kumar', impactScore: 980, donations: 32 },
  { id: '3', rank: 3, name: 'Anita Verma', impactScore: 850, donations: 28 },
  { id: '4', rank: 4, name: 'Vikram Singh', impactScore: 720, donations: 21 },
  { id: '5', rank: 5, name: 'Sneha Patel', impactScore: 650, donations: 19 },
];

export default function LeaderboardPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <IoChevronForward size={12} />
            <span>Leaderboard</span>
          </nav>

          <div className={styles.headerSection}>
            <div className={styles.iconWrapper}>
              <IoTrophyOutline size={48} color="var(--color-gold)" />
            </div>
            <h1 className={styles.title}>Community Leaderboard</h1>
            <p className={styles.subtitle}>Celebrating our most generous members creating the biggest impact.</p>
          </div>

          <div className={styles.leaderboardCard}>
            <div className={styles.tableHeader}>
              <div className={styles.colRank}>Rank</div>
              <div className={styles.colName}>Hero</div>
              <div className={styles.colImpact}>Impact Score</div>
              <div className={styles.colDonations}>Items Donated</div>
            </div>

            <div className={styles.tableBody}>
              {MOCK_LEADERS.map((leader) => (
                <div key={leader.id} className={`${styles.tableRow} ${leader.rank <= 3 ? styles.topThree : ''}`}>
                  <div className={styles.colRank}>
                    {leader.rank === 1 && <IoMedalOutline size={24} color="#FFD700" />}
                    {leader.rank === 2 && <IoMedalOutline size={24} color="#C0C0C0" />}
                    {leader.rank === 3 && <IoMedalOutline size={24} color="#CD7F32" />}
                    {leader.rank > 3 && <span className={styles.rankNumber}>#{leader.rank}</span>}
                  </div>
                  <div className={styles.colName}>
                    <span className={styles.leaderName}>{leader.name}</span>
                  </div>
                  <div className={styles.colImpact}>
                    <IoStar size={14} color="var(--color-gold)" className={styles.starIcon} />
                    <span className={styles.impactScore}>{leader.impactScore}</span>
                  </div>
                  <div className={styles.colDonations}>
                    <span className={styles.donationsCount}>{leader.donations}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
