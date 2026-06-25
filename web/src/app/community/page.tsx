'use client';

import React, { useState } from 'react';
import { IoHeart, IoPerson, IoStar, IoStarOutline, IoShareOutline, IoGiftOutline, IoCreateOutline, IoHappyOutline, IoRibbonOutline, IoTrendingUp, IoCheckmarkCircle } from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

type TabFilter = 'All' | 'Received' | 'Given';

const DONATION_LEVELS = [
  { level: 1, min: 0, max: 4, title: 'Giver', icon: '🌱' },
  { level: 2, min: 5, max: 9, title: 'Supporter', icon: '🌿' },
  { level: 3, min: 10, max: 19, title: 'Benefactor', icon: '🌳' },
  { level: 4, min: 20, max: 49, title: 'Champion', icon: '⭐' },
  { level: 5, min: 50, max: 99, title: 'Guardian', icon: '🌟' },
  { level: 6, min: 100, max: 199, title: 'Patron', icon: '💫' },
  { level: 7, min: 200, max: 499, title: 'Ambassador', icon: '👑' },
  { level: 8, min: 500, max: 999, title: 'Visionary', icon: '🏆' },
  { level: 9, min: 1000, max: 1999, title: 'Legend', icon: '💎' },
  { level: 10, min: 2000, max: Infinity, title: 'Icon', icon: '🔮' },
];

const RATING_TIERS = [
  { pct: '1%', label: 'Newcomer', color: '#9CA3AF' },
  { pct: '25%', label: 'Rising', color: '#3B82F6' },
  { pct: '50%', label: 'Trusted', color: '#2ECC71' },
  { pct: '75%', label: 'Esteemed', color: '#F59E0B' },
  { pct: '100%', label: 'Elite', color: '#FF8A00' },
];

const MOCK_NOTES = [
  {
    id: '1', senderName: 'Priya Sharma', date: 'May 12, 2025',
    message: 'Rahul is amazing! The chair is perfect and was just what I needed. Thank you so much! 💛',
    rating: 5, itemName: 'Wooden Chair', donorLevel: 7, validationBadge: true,
  },
  {
    id: '2', senderName: 'Anita Verma', date: 'May 11, 2025',
    message: 'Thank you for the books! My kids are going to love reading them. 😊🙏',
    rating: 5, itemName: "Children's Books Set", donorLevel: 4, validationBadge: false,
  },
  {
    id: '3', senderName: 'Karthik Ramesh', date: 'May 10, 2025',
    message: 'Very kind person and easy to coordinate with. Highly recommended! 😊👍',
    rating: 5, itemName: 'Study Table', donorLevel: 10, validationBadge: true,
  },
  {
    id: '4', senderName: 'Meena Lakshmi', date: 'May 8, 2025',
    message: 'This community is so wonderful! I received a beautiful set of curtains. Feeling blessed 🙏✨',
    rating: 5, itemName: 'Window Curtains', donorLevel: 3, validationBadge: false,
  },
  {
    id: '5', senderName: 'Arjun Patel', date: 'May 7, 2025',
    message: 'Got an amazing kitchen mixer. Works perfectly! ThankU for making this platform ❤️',
    rating: 4, itemName: 'Kitchen Mixer', donorLevel: 6, validationBadge: true,
  },
];

const IMPACT_METRICS = [
  { value: '200', label: 'Donation Levels', icon: IoRibbonOutline },
  { value: '1%', label: 'Rating Tiers', icon: IoTrendingUp },
  { value: '95%', label: 'Satisfaction Rate', icon: IoHappyOutline },
  { value: '3%', label: 'Validation Rate', icon: IoCheckmarkCircle },
];

const MOCK_REQUESTS = [
  { id: 'req1', userName: 'Ayesha Khan', date: 'Just now', urgency: 'High', request: 'Hi neighbors, my washing machine just broke down and I have a toddler. Does anyone know a cheap repair person or have a spare small washer?' },
  { id: 'req2', userName: 'Ravi Kumar', date: '2 hours ago', urgency: 'Medium', request: 'Looking for old 10th grade NCERT textbooks for my sister. We cannot afford new ones this year.' },
];

export default function CommunityPage() {
  const [screenMode, setScreenMode] = useState<'gratitude' | 'help'>('gratitude');
  const [activeTab, setActiveTab] = useState<TabFilter>('All');
  const [requestTab, setRequestTab] = useState<'All' | 'Urgent' | 'Education' | 'Medical'>('All');

  const getLevelInfo = (levelNum: number) => {
    return DONATION_LEVELS.find(l => l.level === levelNum) || DONATION_LEVELS[0];
  };

  return (
    <>
      <Header />

      <main className={styles.main}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Community & Employment</h1>
            <p className={styles.pageSubtitle}>Social service through community-driven giving</p>
          </div>
        </div>

        <div className={styles.container}>
          {/* Mission Banner */}
          <section className={styles.missionBanner}>
            <div className={styles.missionBannerContent}>
              <h2 className={styles.missionBannerTitle}>Our Mission</h2>
              <p className={styles.missionBannerText}>
                We focus on social service-related employment. Every donation creates 
                opportunities, builds livelihoods, and strengthens communities.
              </p>
            </div>
          </section>

          {/* Impact Metrics */}
          <section className={styles.impactSection}>
            <div className={styles.impactGrid}>
              {IMPACT_METRICS.map((metric, i) => {
                const Icon = metric.icon;
                return (
                  <div key={i} className={styles.impactCard}>
                    <Icon size={24} className={styles.impactIcon} />
                    <span className={styles.impactValue}>{metric.value}</span>
                    <span className={styles.impactLabel}>{metric.label}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Donation Levels */}
          <section className={styles.levelsSection}>
            <h2 className={styles.sectionTitle}>200 Donation Levels</h2>
            <p className={styles.sectionSubtitle}>Climb the ranks as you give back to the community</p>
            <div className={styles.levelsGrid}>
              {DONATION_LEVELS.map((lvl) => (
                <div key={lvl.level} className={styles.levelCard}>
                  <span className={styles.levelIcon}>{lvl.icon}</span>
                  <span className={styles.levelName}>{lvl.title}</span>
                  <span className={styles.levelNum}>Level {lvl.level}</span>
                  <span className={styles.levelReq}>
                    {lvl.max === Infinity ? `${lvl.min}+ donations` : `${lvl.min}-${lvl.max} donations`}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Rating Tiers */}
          <section className={styles.ratingTiersSection}>
            <h2 className={styles.sectionTitle}>Percentage-Based Rating Tiers</h2>
            <p className={styles.sectionSubtitle}>1% increment rating system for fair recognition</p>
            <div className={styles.ratingTiers}>
              {RATING_TIERS.map((tier, i) => (
                <div key={i} className={styles.ratingTierCard}>
                  <div className={styles.ratingTierBar} style={{ background: tier.color, width: tier.pct }} />
                  <div className={styles.ratingTierInfo}>
                    <span className={styles.ratingTierPct}>{tier.pct}</span>
                    <span className={styles.ratingTierLabel}>{tier.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Validation Badge Info */}
          <section className={styles.validationSection}>
            <div className={styles.validationCard}>
              <IoCheckmarkCircle size={32} className={styles.validationIcon} />
              <div className={styles.validationContent}>
                <h3 className={styles.validationTitle}>Validated Donors</h3>
                <p className={styles.validationText}>
                  Our 2-3% validation rate ensures quality service. Look for the verified badge 
                  on donor profiles to connect with trusted community members.
                </p>
                <div className={styles.validationBadge}>
                  <IoCheckmarkCircle size={14} />
                  <span>2.5% Validation Rate</span>
                </div>
              </div>
            </div>
          </section>

          {/* Dual-Mode Toggle */}
          <div className={styles.modeToggleContainer}>
            <button 
              className={`${styles.modeToggleBtn} ${screenMode === 'gratitude' ? styles.modeToggleActive : ''}`}
              onClick={() => setScreenMode('gratitude')}
            >
              🌟 Gratitude Wall
            </button>
            <button 
              className={`${styles.modeToggleBtn} ${screenMode === 'help' ? styles.modeToggleActive : ''}`}
              onClick={() => setScreenMode('help')}
            >
              🤝 Help Board
            </button>
          </div>

          {/* Tabs */}
          <div className={styles.tabContainer}>
            {screenMode === 'gratitude' ? (
              (['All', 'Received', 'Given'] as TabFilter[]).map(tab => (
                <button
                  key={tab}
                  className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))
            ) : (
              (['All', 'Urgent', 'Education', 'Medical']).map(tab => (
                <button
                  key={tab}
                  className={`${styles.tab} ${requestTab === tab ? styles.tabActive : ''}`}
                  onClick={() => setRequestTab(tab as any)}
                >
                  {tab}
                </button>
              ))
            )}
          </div>

          {/* Feed */}
          <div className={styles.notesFeed}>
            {screenMode === 'gratitude' ? (
              MOCK_NOTES.map((note, i) => {
                const level = getLevelInfo(note.donorLevel);
                return (
                  <article
                    key={note.id}
                    className={styles.noteCard}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className={styles.noteHeader}>
                      <div className={styles.avatarCircle}>
                        <IoPerson size={18} color="#fff" />
                      </div>
                      <div className={styles.noteHeaderInfo}>
                        <div className={styles.noteNameRow}>
                          <p className={styles.noteSender}>{note.senderName}</p>
                          {note.validationBadge && (
                            <span className={styles.validationBadgeSmall} title="Validated Donor">
                              <IoCheckmarkCircle size={14} />
                            </span>
                          )}
                        </div>
                        <p className={styles.noteDate}>{note.date}</p>
                      </div>
                      <div className={styles.noteBadges}>
                        <span className={styles.donorLevelBadge} title={level.title}>
                          {level.icon} Lvl.{level.level}
                        </span>
                      </div>
                    </div>
                    <div className={styles.ratingRow}>
                      <div className={styles.ratingContainer}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          idx < note.rating
                            ? <IoStar key={idx} size={14} className={styles.starFilled} />
                            : <IoStarOutline key={idx} size={14} className={styles.starEmpty} />
                        ))}
                      </div>
                      <span className={styles.ratingPct}>{(note.rating / 5 * 100).toFixed(0)}%</span>
                    </div>
                    <p className={styles.noteMessage}>{note.message}</p>
                    <div className={styles.itemTag}>
                      <IoGiftOutline size={14} />
                      <span>{note.itemName}</span>
                    </div>
                    <div className={styles.noteActions}>
                      <button className={styles.actionBtn}>
                        <IoHeart size={18} />
                        <span>Applaud</span>
                      </button>
                      <button className={styles.actionBtn}>
                        <IoShareOutline size={18} />
                        <span>Share</span>
                      </button>
                    </div>
                  </article>
                );
              })
            ) : (
              MOCK_REQUESTS.map((req, i) => (
                <article
                  key={req.id}
                  className={styles.requestCard}
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={styles.noteHeader}>
                    <div className={styles.avatarCircle}>
                      <IoPerson size={18} color="#fff" />
                    </div>
                    <div className={styles.noteHeaderInfo}>
                      <p className={styles.noteSender}>{req.userName}</p>
                      <p className={styles.noteDate}>{req.date}</p>
                    </div>
                    <div className={`${styles.urgencyBadge} ${req.urgency === 'High' ? styles.urgencyHigh : ''}`}>
                      {req.urgency} Urgency
                    </div>
                  </div>
                  <p className={styles.noteMessage}>{req.request}</p>
                  <button className={styles.helpBtn}>
                    <IoHeart size={18} />
                    <span>Help Them</span>
                  </button>
                </article>
              ))
            )}
          </div>

          {/* Write CTA */}
          <div className={styles.writeCta}>
            <button 
              className={styles.writeBtn}
              onClick={() => {
                if (screenMode === 'help') {
                  window.location.href = '/create-request';
                }
              }}
            >
              <IoCreateOutline size={20} />
              {screenMode === 'help' ? 'Ask for Help' : 'Write a ThankU Note'}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}