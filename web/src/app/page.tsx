'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  IoBedOutline, IoTvOutline, IoBookOutline, IoShirtOutline,
  IoHappyOutline, IoRestaurantOutline, IoFootballOutline,
  IoMedkitOutline, IoLeafOutline, IoNutritionOutline,
  IoCubeOutline, IoChevronForward, IoArrowForwardCircle, IoSparkles,
  IoGridOutline, IoCheckmarkCircle,
} from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DonationCard from '@/components/DonationCard';
import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import styles from './page.module.css';

const CATEGORIES = [
  { id: '1', name: 'Furniture', icon: IoBedOutline },
  { id: '2', name: 'Electronics', icon: IoTvOutline },
  { id: '3', name: 'Books', icon: IoBookOutline },
  { id: '4', name: 'Clothing', icon: IoShirtOutline },
  { id: '5', name: 'Toys', icon: IoHappyOutline },
  { id: '6', name: 'Kitchen', icon: IoRestaurantOutline },
  { id: '7', name: 'Sports', icon: IoFootballOutline },
  { id: '8', name: 'Medical', icon: IoMedkitOutline },
  { id: '9', name: 'Plants', icon: IoLeafOutline },
  { id: '10', name: 'Food', icon: IoNutritionOutline },
  { id: '11', name: 'Other', icon: IoCubeOutline },
];

const MOCK_PRODUCTS = [
  {
    id: '1', title: 'Vintage Wooden Bookshelf', imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop',
    location: 'Anna Nagar, Chennai', condition: 'Like New', category: 'Furniture', createdAt: '2025-06-18T10:00:00Z', rating: '4.8',
  },
  {
    id: '2', title: 'Samsung Galaxy S21 Ultra', imageUrl: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&h=300&fit=crop',
    location: 'Koramangala, Bengaluru', condition: 'Good', category: 'Electronics', createdAt: '2025-06-17T14:00:00Z', rating: '4.5',
  },
  {
    id: '3', title: 'Harry Potter Complete Box Set', imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
    location: 'Bandra, Mumbai', condition: 'New', category: 'Books', createdAt: '2025-06-16T09:00:00Z', rating: '5.0',
  },
  {
    id: '4', title: 'Nike Running Shoes (Size 10)', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop',
    location: 'Jubilee Hills, Hyderabad', condition: 'Like New', category: 'Sports', createdAt: '2025-06-15T18:00:00Z', rating: '4.7',
  },
  {
    id: '5', title: 'IKEA Study Desk with Drawers', imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
    location: 'Connaught Place, Delhi', condition: 'Good', category: 'Furniture', createdAt: '2025-06-14T12:00:00Z', rating: '4.3',
  },
  {
    id: '6', title: 'KitchenAid Mixer — Barely Used', imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400&h=300&fit=crop',
    location: 'Salt Lake, Kolkata', condition: 'Like New', category: 'Kitchen', createdAt: '2025-06-13T08:00:00Z', rating: '4.9',
  },
  {
    id: '7', title: 'Children\'s Building Blocks Set', imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop',
    location: 'Adyar, Chennai', condition: 'Good', category: 'Toys', createdAt: '2025-06-12T15:00:00Z', rating: '4.6',
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

const IMPACT_STATS = [
  { value: '12,450+', label: 'Items Donated' },
  { value: '8,200+', label: 'People Helped' },
  { value: '320+', label: 'Communities' },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector(state => state.favorites.itemIds);

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id));
  };

  const filteredProducts = selectedCategory
    ? MOCK_PRODUCTS.filter(p => p.category === selectedCategory)
    : MOCK_PRODUCTS;

  return (
    <>
      <Header />

      <main className={styles.main}>
        {/* ─── Hero Banner ──────────────────────────────────── */}
        <section className={styles.heroBannerImageContainer} id="home-hero-banner">
          <div className={styles.heroImageWrapper}>
            <Image 
              src="/image.png" 
              alt="Give Freely. Help Genuinely. ThankU Banner" 
              width={1672} 
              height={941} 
              className={styles.heroBannerImage}
              priority
            />
            <div className={styles.heroOverlay}>
              <div className={styles.heroTag}>
                <IoSparkles size={14} />
                <span>Social Service Employment</span>
              </div>
              <h1 className={styles.heroTitle}>
                Give Freely.<br />Create Employment.
              </h1>
              <p className={styles.heroSubtitle}>
                A social service platform where your donations fund employment opportunities and build communities.
              </p>
              <div className={styles.heroActions}>
                <Link href="/post" className={styles.heroCta}>
                  <span>Give an Item</span>
                  <IoArrowForwardCircle size={20} />
                </Link>
                <Link href="#products" className={styles.heroSecondary}>
                  Browse Items
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Categories ───────────────────────────────────── */}
        <section className={styles.section} id="home-categories">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Categories</h2>
            <Link href="/categories" className={styles.seeAllLink}>
              See All <IoChevronForward size={14} />
            </Link>
          </div>

          <div className={styles.categoryGrid}>
            {CATEGORIES.map(cat => {
              const IconComponent = cat.icon;
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  className={`${styles.categoryItem} ${isActive ? styles.categoryItemActive : ''}`}
                  onClick={() => setSelectedCategory(isActive ? null : cat.name)}
                  id={`category-${cat.id}`}
                >
                  <div className={`${styles.categoryIcon} ${isActive ? styles.categoryIconActive : ''}`}>
                    <IconComponent size={26} />
                  </div>
                  <span className={`${styles.categoryName} ${isActive ? styles.categoryNameActive : ''}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* ─── Product Grid ─────────────────────────────────── */}
        <section className={styles.section} id="products">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              {selectedCategory ? `Showing ${selectedCategory}` : 'Recommended for you'}
            </h2>
            <Link href="/search" className={styles.seeAllLink}>
              See All <IoChevronForward size={14} />
            </Link>
          </div>

          <div className={styles.productGrid}>
            {filteredProducts.map((product, index) => (
              <div
                key={product.id}
                className={styles.productWrapper}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <DonationCard
                  {...product}
                  isFavorite={favoriteItems.includes(product.id)}
                  onFavoritePress={() => handleToggleFavorite(product.id)}
                />
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className={styles.emptyState}>
              <IoGridOutline size={48} className={styles.emptyIcon} />
              <p className={styles.emptyTitle}>No items found</p>
              <p className={styles.emptyBody}>Try selecting a different category.</p>
              <button
                className={styles.emptyCta}
                onClick={() => setSelectedCategory(null)}
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>

        {/* ─── Featured Promotions & Ads ─────────────────────── */}
        <section className={styles.section} id="home-promotions">
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Promotions</h2>
            <Link href="/" className={styles.seeAllLink}>
              Sponsor Us <IoChevronForward size={14} />
            </Link>
          </div>
          <div className={styles.adsCarousel}>
            <div className={styles.adCard}>
              <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=300&fit=crop" alt="Eco Store Ad" className={styles.adImage} />
              <div className={styles.adOverlay}>
                <span className={styles.adBadge}>Sponsored</span>
                <h3 className={styles.adTitle}>Local Eco Store</h3>
                <p className={styles.adDesc}>Get 20% off sustainable home goods.</p>
              </div>
            </div>
            <div className={styles.adCard}>
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=300&fit=crop" alt="Office Ad" className={styles.adImage} />
              <div className={styles.adOverlay}>
                <span className={styles.adBadge}>Partner NGO</span>
                <h3 className={styles.adTitle}>Build A School</h3>
                <p className={styles.adDesc}>Help us furnish 5 new classrooms.</p>
              </div>
            </div>
            <div className={styles.adCard}>
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=300&fit=crop" alt="Corporate Sponsor Ad" className={styles.adImage} />
              <div className={styles.adOverlay}>
                <span className={styles.adBadge}>Sponsored</span>
                <h3 className={styles.adTitle}>TechCorp Cares</h3>
                <p className={styles.adDesc}>Matching all education donations today.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Mission Section ──────────────────────────────── */}
        <section className={styles.missionSection} id="home-mission">
          <div className={styles.missionContent}>
            <div className={styles.missionIcon}>
              <IoHappyOutline size={32} />
            </div>
            <h2 className={styles.missionTitle}>Our Mission: Social Service Employment</h2>
            <p className={styles.missionDesc}>
              We connect people who want to give with those who need, creating employment opportunities 
              through community-driven donations. Every item donated helps build sustainable livelihoods.
            </p>
            <div className={styles.missionStats}>
              <div className={styles.missionStat}>
                <span className={styles.missionStatValue}>200</span>
                <span className={styles.missionStatLabel}>Donation Levels</span>
              </div>
              <div className={styles.missionStat}>
                <span className={styles.missionStatValue}>1%</span>
                <span className={styles.missionStatLabel}>Rating Tiers</span>
              </div>
              <div className={styles.missionStat}>
                <span className={styles.missionStatValue}>2-3%</span>
                <span className={styles.missionStatLabel}>Validation Rate</span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Community CTA ────────────────────────────────── */}
        <section className={styles.communityCta} id="home-community-cta">
          <div className={styles.communityContent}>
            <h2 className={styles.communityTitle}>Join the Gratitude Wall</h2>
            <p className={styles.communityDesc}>
              See the kind words from people who received items. Every ThankU note creates a ripple of positivity.
            </p>
            <Link href="/community" className={styles.communityBtn}>
              View Community
              <IoChevronForward size={16} />
            </Link>
          </div>
          <div className={styles.communityCards}>
            <div className={styles.miniCard}>
              <div className={styles.miniAvatar}>P</div>
              <div>
                <p className={styles.miniName}>Priya S.</p>
                <p className={styles.miniMsg}>&ldquo;The chair is perfect! Thank you! 💛&rdquo;</p>
              </div>
            </div>
            <div className={`${styles.miniCard} ${styles.miniCard2}`}>
              <div className={styles.miniAvatar}>K</div>
              <div>
                <p className={styles.miniName}>Karthik R.</p>
                <p className={styles.miniMsg}>&ldquo;Very kind person. Highly recommended! 👍&rdquo;</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
