'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import {
  IoBedOutline, IoTvOutline, IoBookOutline, IoShirtOutline,
  IoHappyOutline, IoRestaurantOutline, IoFootballOutline,
  IoMedkitOutline, IoLeafOutline, IoNutritionOutline,
  IoCubeOutline, IoChevronForward
} from 'react-icons/io5';
import styles from './page.module.css';

const CATEGORIES = [
  { id: '1', name: 'Furniture', icon: IoBedOutline, count: '1,240' },
  { id: '2', name: 'Electronics', icon: IoTvOutline, count: '890' },
  { id: '3', name: 'Books', icon: IoBookOutline, count: '3,450' },
  { id: '4', name: 'Clothing', icon: IoShirtOutline, count: '5,600' },
  { id: '5', name: 'Toys', icon: IoHappyOutline, count: '720' },
  { id: '6', name: 'Kitchen', icon: IoRestaurantOutline, count: '430' },
  { id: '7', name: 'Sports', icon: IoFootballOutline, count: '210' },
  { id: '8', name: 'Medical', icon: IoMedkitOutline, count: '150' },
  { id: '9', name: 'Plants', icon: IoLeafOutline, count: '340' },
  { id: '10', name: 'Food', icon: IoNutritionOutline, count: '1,120' },
  { id: '11', name: 'Other', icon: IoCubeOutline, count: '560' },
];

export default function CategoriesPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Categories</h1>
          <p className={styles.subtitle}>Browse items by category to find exactly what you need.</p>
        </div>

        <div className={styles.grid}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <Link href={`/search?category=${cat.name}`} key={cat.id} className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Icon size={32} />
                </div>
                <div className={styles.info}>
                  <h3 className={styles.name}>{cat.name}</h3>
                  <p className={styles.count}>{cat.count} items</p>
                </div>
                <IoChevronForward className={styles.chevron} />
              </Link>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
