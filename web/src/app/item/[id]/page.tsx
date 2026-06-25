'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  IoArrowBack, IoShareOutline, IoHeart, IoHeartOutline,
  IoLocationOutline, IoShieldCheckmark, IoStar,
  IoChatbubbleOutline, IoHandLeftOutline, IoChevronForward,
  IoPerson,
} from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

// Mock product data (would come from API / SSR in production)
const MOCK_PRODUCT = {
  id: '1',
  title: 'Vintage Wooden Bookshelf — 3 Shelf',
  description: 'Beautiful solid wood bookshelf in excellent condition. Perfect for a study room or living area. Bought 2 years ago from a local carpenter. Giving it away because I\'m moving to a smaller apartment. It has three spacious shelves that can hold books, plants, and decorative items. Dimensions: 4ft x 2ft x 1ft.',
  images: [
    'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop',
  ],
  location: 'Anna Nagar, Chennai',
  condition: 'Like New',
  category: 'Furniture',
  createdAt: '2025-06-18T10:00:00Z',
  donorName: 'Rahul Kumar',
  donorRating: 4.8,
  donorDonations: 24,
};

export default function ProductDetailPage() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const product = MOCK_PRODUCT;
  const dateStr = new Date(product.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <IoChevronForward size={12} />
            <Link href={`/search?category=${product.category}`}>{product.category}</Link>
            <IoChevronForward size={12} />
            <span>{product.title}</span>
          </nav>

          <div className={styles.layout}>
            {/* ─── Left: Image Gallery ─────────────────────────── */}
            <div className={styles.gallerySection}>
              <div className={styles.mainImage}>
                <img
                  src={product.images[activeImageIndex]}
                  alt={product.title}
                  className={styles.mainImg}
                />
                {/* Pagination */}
                <div className={styles.imagePagination}>
                  {activeImageIndex + 1} / {product.images.length}
                </div>

                {/* Nav Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      className={`${styles.navArrow} ${styles.navArrowLeft}`}
                      onClick={() => setActiveImageIndex(i => i === 0 ? product.images.length - 1 : i - 1)}
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      className={`${styles.navArrow} ${styles.navArrowRight}`}
                      onClick={() => setActiveImageIndex(i => i === product.images.length - 1 ? 0 : i + 1)}
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              <div className={styles.thumbnails}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    className={`${styles.thumbnail} ${i === activeImageIndex ? styles.thumbnailActive : ''}`}
                    onClick={() => setActiveImageIndex(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} className={styles.thumbImg} />
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Right: Details ──────────────────────────────── */}
            <div className={styles.detailsSection}>
              {/* Badges */}
              <div className={styles.badgeRow}>
                <span className={styles.freeBadge}>FREE</span>
                {product.condition && (
                  <span className={styles.conditionBadge}>{product.condition}</span>
                )}
              </div>

              {/* Title & Meta */}
              <h1 className={styles.itemTitle}>{product.title}</h1>
              <div className={styles.metaRow}>
                <IoLocationOutline size={16} className={styles.metaIcon} />
                <span className={styles.metaText}>{product.location}</span>
                <span className={styles.metaDot}>•</span>
                <span className={styles.metaText}>{dateStr}</span>
              </div>

              {/* Actions */}
              <div className={styles.actionBar}>
                <button
                  className={styles.favBtn}
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  {isFavorite ? <IoHeart size={20} className={styles.favActive} /> : <IoHeartOutline size={20} />}
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button className={styles.shareBtn}>
                  <IoShareOutline size={20} />
                  Share
                </button>
              </div>

              {/* Description */}
              <div className={styles.descSection}>
                <h2 className={styles.descTitle}>About this item</h2>
                <p className={styles.descText}>{product.description}</p>
              </div>

              {/* Donor Card */}
              <div className={styles.donorCard}>
                <h2 className={styles.donorCardTitle}>Donor</h2>
                <div className={styles.donorRow}>
                  <div className={styles.donorAvatar}>
                    <IoPerson size={24} color="#fff" />
                  </div>
                  <div className={styles.donorInfo}>
                    <div className={styles.donorNameRow}>
                      <span className={styles.donorName}>{product.donorName}</span>
                      <IoShieldCheckmark size={16} className={styles.verifiedIcon} />
                    </div>
                    <div className={styles.donorStars}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <IoStar key={i} size={13} className={styles.starIcon} />
                      ))}
                      <span className={styles.donorRating}>{product.donorRating}</span>
                      <span className={styles.donorDonations}> • {product.donorDonations} items donated</span>
                    </div>
                  </div>
                  <IoChevronForward size={18} className={styles.donorChevron} />
                </div>
              </div>

              {/* Safety Notice */}
              <div className={styles.safetyCard}>
                <IoShieldCheckmark size={20} className={styles.safetyIcon} />
                <p className={styles.safetyText}>
                  Always meet in public places. Check the item before accepting.
                </p>
              </div>

              {/* CTA Bar */}
              <div className={styles.ctaBar}>
                <button className={styles.chatBtn}>
                  <IoChatbubbleOutline size={22} />
                </button>
                <button className={styles.requestBtn}>
                  <IoHandLeftOutline size={20} />
                  <span>Request Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
