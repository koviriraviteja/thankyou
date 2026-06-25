'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IoStar, IoTimeOutline, IoInformationCircleOutline, IoTrendingUp, IoArrowDown, IoArrowUp } from 'react-icons/io5';
import styles from './page.module.css';

const MOCK_HISTORY = [
  { id: '1', type: 'earned', points: 50, title: 'Item Donated', desc: 'Wooden Chair', date: 'May 12, 2025' },
  { id: '2', type: 'spent', points: -20, title: 'Request Sponsored', desc: 'Notebooks', date: 'May 10, 2025' },
  { id: '3', type: 'earned', points: 150, title: 'Signup Bonus', desc: 'Welcome to ThankU', date: 'May 1, 2025' },
];

export default function PointsPage() {
  const currentPoints = 180;
  const currentLevel = 2;
  const pointsToNext = 20;

  const monthItemsGiven = 3;
  const monthLimitGiven = 5;
  const monthItemsTaken = 1;
  const monthLimitTaken = 2;

  const giveProgress = (monthItemsGiven / monthLimitGiven) * 100;
  const takeProgress = (monthItemsTaken / monthLimitTaken) * 100;

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.pageTitle}>My Points & Limits</h1>
          
          <div className={styles.grid}>
            {/* Left Column */}
            <div className={styles.leftCol}>
              {/* Balance Card */}
              <section className={styles.balanceCard}>
                <div className={styles.balanceHeader}>
                  <IoStar size={32} className={styles.starIcon} />
                  <h2 className={styles.balanceTitle}>Total Balance</h2>
                </div>
                <div className={styles.balanceAmount}>{currentPoints} <span className={styles.balanceCurrency}>Points</span></div>
                <div className={styles.levelInfo}>
                  <div className={styles.levelBadge}>Level {currentLevel}</div>
                  <span className={styles.levelText}>{pointsToNext} points to next level</span>
                </div>
              </section>

              {/* Monthly Limits */}
              <section className={styles.limitsCard}>
                <div className={styles.cardHeader}>
                  <IoTimeOutline size={24} className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>Monthly Limits</h3>
                  <IoInformationCircleOutline size={18} className={styles.infoIcon} />
                </div>
                
                <div className={styles.limitItem}>
                  <div className={styles.limitTextRow}>
                    <span className={styles.limitLabel}>Items Given</span>
                    <span className={styles.limitValue}>{monthItemsGiven} / {monthLimitGiven}</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${giveProgress}%`, backgroundColor: '#34D399' }} />
                  </div>
                </div>

                <div className={styles.limitItem}>
                  <div className={styles.limitTextRow}>
                    <span className={styles.limitLabel}>Requests Sponsored</span>
                    <span className={styles.limitValue}>{monthItemsTaken} / {monthLimitTaken}</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <div className={styles.progressBarFill} style={{ width: `${takeProgress}%`, backgroundColor: '#F87171' }} />
                  </div>
                </div>
                
                <p className={styles.limitNote}>Limits reset on the 1st of every month. Higher levels unlock higher limits.</p>
              </section>
            </div>

            {/* Right Column: Transaction History */}
            <div className={styles.rightCol}>
              <section className={styles.historyCard}>
                <div className={styles.cardHeader}>
                  <IoTrendingUp size={24} className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>Transaction History</h3>
                </div>

                <div className={styles.historyList}>
                  {MOCK_HISTORY.map((item) => (
                    <div key={item.id} className={styles.historyItem}>
                      <div className={`${styles.historyIcon} ${item.type === 'earned' ? styles.iconEarned : styles.iconSpent}`}>
                        {item.type === 'earned' ? <IoArrowUp size={20} /> : <IoArrowDown size={20} />}
                      </div>
                      <div className={styles.historyInfo}>
                        <h4 className={styles.historyTitle}>{item.title}</h4>
                        <span className={styles.historyDesc}>{item.desc}</span>
                        <span className={styles.historyDate}>{item.date}</span>
                      </div>
                      <div className={`${styles.historyPoints} ${item.type === 'earned' ? styles.textEarned : styles.textSpent}`}>
                        {item.type === 'earned' ? '+' : ''}{item.points}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
