'use client';

import React from 'react';
import Link from 'next/link';
import { IoChevronForward, IoSearchOutline, IoFilterOutline } from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DonationCard from '@/components/DonationCard';
import styles from './page.module.css';

const MOCK_RESULTS = [
  {
    id: '1', title: 'Vintage Wooden Bookshelf', imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop',
    location: 'Anna Nagar, Chennai', condition: 'Like New', category: 'Furniture', createdAt: '2025-06-18T10:00:00Z', rating: '4.8',
  },
  {
    id: '5', title: 'IKEA Study Desk with Drawers', imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
    location: 'Connaught Place, Delhi', condition: 'Good', category: 'Furniture', createdAt: '2025-06-14T12:00:00Z', rating: '4.3',
  },
  {
    id: '8', title: 'Medical Pulse Oximeter', imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop',
    location: 'HSR Layout, Bengaluru', condition: 'New', category: 'Medical', createdAt: '2025-06-11T11:00:00Z', rating: '4.4',
  },
  {
    id: '9', title: 'Acoustic Guitar with Soft Case', imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&h=300&fit=crop',
    location: 'Banjara Hills, Hyderabad', condition: 'Good', category: 'Other', createdAt: '2025-06-10T10:00:00Z', rating: '4.5',
  },
  {
    id: '10', title: 'Set of 4 Ceramic Dining Plates', imageUrl: 'https://images.unsplash.com/photo-1616421443657-b4d21e8d1a1b?w=400&h=300&fit=crop',
    location: 'Vasant Vihar, Delhi', condition: 'Like New', category: 'Kitchen', createdAt: '2025-06-09T14:30:00Z', rating: '4.8',
  },
  {
    id: '11', title: 'Men\'s Winter Jacket (Size L)', imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop',
    location: 'Andheri West, Mumbai', condition: 'Good', category: 'Clothing', createdAt: '2025-06-08T09:15:00Z', rating: '4.2',
  },
  {
    id: '12', title: 'Indoor Potted Monstera Plant', imageUrl: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=400&h=300&fit=crop',
    location: 'Indiranagar, Bengaluru', condition: 'Like New', category: 'Plants', createdAt: '2025-06-07T16:45:00Z', rating: '4.9',
  },
  {
    id: '13', title: 'Box of Non-perishable Groceries', imageUrl: 'https://images.unsplash.com/photo-1584473457406-6240486418e9?w=400&h=300&fit=crop',
    location: 'T Nagar, Chennai', condition: 'New', category: 'Food', createdAt: '2025-06-06T11:20:00Z', rating: '5.0',
  },
  {
    id: '14', title: 'Dumbbell Set (2x 5kg)', imageUrl: 'https://images.unsplash.com/photo-1638202993928-7267aad84c31?w=400&h=300&fit=crop',
    location: 'Koregaon Park, Pune', condition: 'Good', category: 'Sports', createdAt: '2025-06-05T08:30:00Z', rating: '4.6',
  },
  {
    id: '15', title: 'Unopened First Aid Kit', imageUrl: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?w=400&h=300&fit=crop',
    location: 'Gachibowli, Hyderabad', condition: 'New', category: 'Medical', createdAt: '2025-06-04T13:10:00Z', rating: '4.7',
  },
  {
    id: '16', title: 'Board Games Bundle (Monopoly, Uno)', imageUrl: 'https://images.unsplash.com/photo-1611891487122-207578351cc9?w=400&h=300&fit=crop',
    location: 'Juhu, Mumbai', condition: 'Like New', category: 'Toys', createdAt: '2025-06-03T17:00:00Z', rating: '4.9',
  },
];

export default function SearchPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <IoChevronForward size={12} />
            <span>Search Results</span>
          </nav>

          <div className={styles.layout}>
            {/* Sidebar Filters */}
            <aside className={styles.sidebar}>
              <div className={styles.filterHeader}>
                <IoFilterOutline size={20} />
                <h2 className={styles.filterTitle}>Filters</h2>
              </div>
              
              <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>Category</h3>
                <div className={styles.filterOptions}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked /> Furniture
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" /> Electronics
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" /> Books
                  </label>
                </div>
              </div>

              <div className={styles.filterGroup}>
                <h3 className={styles.filterLabel}>Condition</h3>
                <div className={styles.filterOptions}>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" /> New
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked /> Like New
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input type="checkbox" defaultChecked /> Good
                  </label>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className={styles.content}>
              <div className={styles.searchHeader}>
                <h1 className={styles.searchTitle}>Results for &quot;Furniture&quot;</h1>
                <span className={styles.resultCount}>{MOCK_RESULTS.length} items found</span>
              </div>

              <div className={styles.productGrid}>
                {MOCK_RESULTS.map((product) => (
                  <DonationCard key={product.id} {...product} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
