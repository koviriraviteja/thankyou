'use client';

import React, { useState } from 'react';
import { IoHeart, IoPerson, IoStar, IoStarOutline, IoShareOutline, IoGiftOutline, IoCreateOutline } from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

type TabFilter = 'All' | 'Received' | 'Given';

const MOCK_NOTES = [
  {
    id: '1', senderName: 'Priya Sharma', date: 'May 12, 2025',
    message: 'Rahul is amazing! The chair is perfect and was just what I needed. Thank you so much! 💛',
    rating: 5, itemName: 'Wooden Chair',
  },
  {
    id: '2', senderName: 'Anita Verma', date: 'May 11, 2025',
    message: 'Thank you for the books! My kids are going to love reading them. 😊🙏',
    rating: 5, itemName: "Children's Books Set",
  },
  {
    id: '3', senderName: 'Karthik Ramesh', date: 'May 10, 2025',
    message: 'Very kind person and easy to coordinate with. Highly recommended! 😊👍',
    rating: 5, itemName: 'Study Table',
  },
  {
    id: '4', senderName: 'Meena Lakshmi', date: 'May 8, 2025',
    message: 'This community is so wonderful! I received a beautiful set of curtains. Feeling blessed 🙏✨',
    rating: 5, itemName: 'Window Curtains',
  },
  {
    id: '5', senderName: 'Arjun Patel', date: 'May 7, 2025',
    message: 'Got an amazing kitchen mixer. Works perfectly! ThankU for making this platform ❤️',
    rating: 4, itemName: 'Kitchen Mixer',
  },
];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabFilter>('All');

  return (
    <>
      <Header />

      <main className={styles.main}>
        {/* Page Header */}
        <div className={styles.pageHeader}>
          <div className={styles.headerContent}>
            <h1 className={styles.pageTitle}>Gratitude Wall</h1>
            <p className={styles.pageSubtitle}>Kind words from our community</p>
          </div>
        </div>

        <div className={styles.container}>
          {/* Tabs */}
          <div className={styles.tabContainer}>
            {(['All', 'Received', 'Given'] as TabFilter[]).map(tab => (
              <button
                key={tab}
                className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Notes Feed */}
          <div className={styles.notesFeed}>
            {MOCK_NOTES.map((note, i) => (
              <article
                key={note.id}
                className={styles.noteCard}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                {/* Header */}
                <div className={styles.noteHeader}>
                  <div className={styles.avatarCircle}>
                    <IoPerson size={18} color="#fff" />
                  </div>
                  <div className={styles.noteHeaderInfo}>
                    <p className={styles.noteSender}>{note.senderName}</p>
                    <p className={styles.noteDate}>{note.date}</p>
                  </div>
                  <div className={styles.ratingContainer}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      i < note.rating
                        ? <IoStar key={i} size={14} className={styles.starFilled} />
                        : <IoStarOutline key={i} size={14} className={styles.starEmpty} />
                    ))}
                  </div>
                </div>

                {/* Message */}
                <p className={styles.noteMessage}>{note.message}</p>

                {/* Item Tag */}
                <div className={styles.itemTag}>
                  <IoGiftOutline size={14} />
                  <span>{note.itemName}</span>
                </div>

                {/* Actions */}
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
            ))}
          </div>

          {/* Write CTA */}
          <div className={styles.writeCta}>
            <button className={styles.writeBtn}>
              <IoCreateOutline size={20} />
              Write a ThankU Note
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
