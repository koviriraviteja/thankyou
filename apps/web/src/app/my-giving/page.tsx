'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IoCheckmarkCircleOutline, IoTrashOutline, IoPencil, IoLocationOutline, IoHeart } from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

type ActiveTab = 'DONATIONS' | 'FAVORITES';

const MOCK_DONATIONS = [
  {
    id: '1', title: 'Vintage Wooden Bookshelf', imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=200&h=200&fit=crop',
    location: 'Anna Nagar, Chennai', isDonated: false, date: 'Jun 18, 2025'
  },
  {
    id: '2', title: 'Samsung Galaxy S21 Ultra', imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=200&h=200&fit=crop',
    location: 'Koramangala, Bengaluru', isDonated: true, date: 'Jun 17, 2025'
  }
];

const MOCK_FAVORITES = [
  {
    id: '3', title: 'Harry Potter Complete Box Set', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop',
    location: 'Bandra, Mumbai'
  }
];

export default function MyGivingPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('DONATIONS');

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1 className={styles.title}>My Giving</h1>
          </div>

          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'DONATIONS' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('DONATIONS')}
            >
              My Donations
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'FAVORITES' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('FAVORITES')}
            >
              Saved Items
            </button>
          </div>

          <div className={styles.content}>
            {activeTab === 'DONATIONS' ? (
              <div className={styles.grid}>
                {MOCK_DONATIONS.map((item) => (
                  <div key={item.id} className={styles.card}>
                    <div className={styles.cardBody}>
                      <img src={item.imageUrl} alt={item.title} className={styles.cardImage} />
                      <div className={styles.cardInfo}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <div className={styles.statusPill} style={{
                          backgroundColor: item.isDonated ? '#ECFDF5' : 'var(--color-highlight)',
                          color: item.isDonated ? 'var(--color-success)' : 'var(--color-primary)'
                        }}>
                          {item.isDonated ? 'Donated 🎉' : 'Active'}
                        </div>
                        <div className={styles.meta}>
                          <IoLocationOutline size={14} />
                          <span>{item.location.split(',')[0]}</span>
                          <span>•</span>
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.cardActions}>
                      {!item.isDonated && (
                        <>
                          <button className={styles.primaryAction}>
                            <IoCheckmarkCircleOutline size={18} />
                            <span>Mark Donated</span>
                          </button>
                          <button className={styles.secondaryAction}>
                            <IoPencil size={16} />
                            <span>Edit</span>
                          </button>
                        </>
                      )}
                      <button className={styles.dangerAction}>
                        <IoTrashOutline size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.grid}>
                {MOCK_FAVORITES.map((item) => (
                  <div key={item.id} className={styles.card}>
                    <div className={styles.cardBody}>
                      <img src={item.imageUrl} alt={item.title} className={styles.cardImage} />
                      <div className={styles.cardInfo}>
                        <h3 className={styles.cardTitle}>{item.title}</h3>
                        <div className={styles.meta}>
                          <IoLocationOutline size={14} />
                          <span>{item.location}</span>
                        </div>
                      </div>
                      <button className={styles.favIconBtn}>
                        <IoHeart size={24} color="var(--color-coral)" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
