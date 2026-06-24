'use client';

import React from 'react';
import Link from 'next/link';
import { IoHeart, IoHeartOutline, IoLocationOutline, IoStar } from 'react-icons/io5';
import styles from './DonationCard.module.css';

interface DonationCardProps {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  condition?: string;
  category?: string;
  createdAt: string;
  isFavorite?: boolean;
  onFavoritePress?: () => void;
  price?: number;
  rating?: string;
}

export default function DonationCard({
  id,
  title,
  imageUrl,
  location,
  condition,
  createdAt,
  isFavorite = false,
  onFavoritePress,
  price,
  rating = '4.5',
}: DonationCardProps) {
  const timeStr = new Date(createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className={styles.card} id={`donation-card-${id}`}>
      <Link href={`/item/${id}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          <img src={imageUrl} alt={title} className={styles.image} loading="lazy" />

          {/* Rating Badge with percentage tier */}
          {rating && (
            <div className={styles.ratingBadge}>
              <IoStar size={10} />
              <span>{rating} · {(parseFloat(rating) / 5 * 100).toFixed(0)}%</span>
            </div>
          )}

          {/* Favorite Button */}
          {onFavoritePress && (
            <button
              className={styles.favoriteBtn}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onFavoritePress();
              }}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              {isFavorite ? (
                <IoHeart size={16} className={styles.favIconActive} />
              ) : (
                <IoHeartOutline size={16} />
              )}
            </button>
          )}

          {/* Condition Badge */}
          {condition && (
            <div className={styles.conditionBadge}>{condition}</div>
          )}
        </div>
      </Link>

      <div className={styles.content}>
        <Link href={`/item/${id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{title}</h3>
        </Link>

        <div className={styles.priceRow}>
          <span className={styles.priceText}>
            {price ? `₹ ${price.toLocaleString('en-IN')}` : 'Free'}
          </span>
        </div>

        <div className={styles.metaRow}>
          <div className={styles.locationRow}>
            <IoLocationOutline size={12} />
            <span className={styles.metaText}>{location?.split(',')[0]}</span>
          </div>
          <span className={styles.metaText}>{timeStr}</span>
        </div>
      </div>
    </div>
  );
}
