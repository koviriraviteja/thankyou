'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IoLocationOutline, IoSearch, IoLocate, IoMapOutline } from 'react-icons/io5';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

const POPULAR_CITIES = [
  'Mumbai', 'Delhi', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur'
];

export default function LocationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSelectCity = (city: string) => {
    console.log('Selected city:', city);
    router.push('/');
  };

  return (
    <div className={styles.pageWrapper}>
      <Header />
      <main className={styles.main}>
        
        {/* Hero Section */}
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.iconWrapper}>
              <IoMapOutline size={40} />
            </div>
            <h1 className={styles.title}>Where are you looking for items?</h1>
            <p className={styles.subtitle}>Discover items being given away in your local community.</p>

            <div className={styles.searchBox}>
              <IoSearch size={22} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search for your city or zip code..."
                className={styles.searchInput}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className={styles.locateBtn}>
                <IoLocate size={18} />
                <span>Locate Me</span>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Cities */}
        <div className={styles.content}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Popular Cities</h2>
            <div className={styles.divider} />
          </div>

          <div className={styles.grid}>
            {POPULAR_CITIES.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase())).map(city => (
              <button
                key={city}
                className={styles.cityCard}
                onClick={() => handleSelectCity(city)}
              >
                <div className={styles.cityIcon}>
                  <IoLocationOutline size={20} />
                </div>
                <span className={styles.cityName}>{city}</span>
              </button>
            ))}
          </div>
          
          {POPULAR_CITIES.filter(city => city.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className={styles.emptyState}>
              <p>No cities found matching "{searchQuery}"</p>
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
