'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  IoCloseOutline, IoArrowBack, IoCameraOutline, IoLocationOutline,
  IoChevronForward, IoHeartOutline, IoCloseCircle,
} from 'react-icons/io5';
import Header from '@/components/Header';
import styles from './page.module.css';

const CATEGORIES = [
  'Furniture', 'Electronics', 'Books', 'Clothing', 'Toys',
  'Kitchen', 'Sports', 'Medical', 'Nature/Plants', 'Food', 'Miscellaneous',
];

const CONDITIONS = ['New', 'Like New', 'Good', 'Used'];
const TRANSPORT_TAGS = ['Fits in a bag', 'Fits in a sedan', 'Needs a truck'];

export default function PostPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [condition, setCondition] = useState('Good');
  const [transportTag, setTransportTag] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newImages = Array.from(files).map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages].slice(0, 12));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Step 1: Category Selection
  if (step === 1) {
    return (
      <>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.header}>
              <Link href="/" className={styles.headerAction}>
                <IoCloseOutline size={24} />
              </Link>
              <h1 className={styles.headerTitle}>What are you donating?</h1>
              <div style={{ width: 24 }} />
            </div>

            <div className={styles.categoryList}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={styles.categoryItem}
                  onClick={() => { setCategory(cat); setStep(2); }}
                >
                  <div className={styles.categoryItemIcon}>📦</div>
                  <span className={styles.categoryItemText}>{cat}</span>
                  <IoChevronForward size={18} className={styles.categoryChevron} />
                </button>
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  // Step 2: Item Details
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.header}>
            <button className={styles.headerAction} onClick={() => setStep(1)}>
              <IoArrowBack size={24} />
            </button>
            <h1 className={styles.headerTitle}>Include some details</h1>
            <div style={{ width: 24 }} />
          </div>

          <div className={styles.formContent}>
            {/* Category Badge */}
            <div className={styles.selectedCategory}>
              <span>Category: <strong>{category}</strong></span>
              <button onClick={() => setStep(1)} className={styles.changeCat}>Change</button>
            </div>

            {/* Photo Upload */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Photos (up to 12)</label>
              <div className={styles.imageRow}>
                {images.length < 12 && (
                  <label className={styles.uploadBtn} htmlFor="image-upload">
                    <IoCameraOutline size={28} />
                    <span>Add</span>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      multiple
                      className={styles.fileInput}
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
                {images.map((uri, i) => (
                  <div key={i} className={styles.imagePreview}>
                    <img src={uri} alt={`Upload ${i + 1}`} className={styles.previewImg} />
                    <button className={styles.removeImgBtn} onClick={() => removeImage(i)}>
                      <IoCloseCircle size={22} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="post-title">Title *</label>
              <input
                type="text"
                id="post-title"
                className={styles.textInput}
                placeholder="What are you giving away?"
                value={title}
                onChange={e => setTitle(e.target.value.slice(0, 70))}
              />
              <span className={styles.charCount}>{title.length}/70</span>
            </div>

            {/* Description */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="post-description">Description</label>
              <textarea
                id="post-description"
                className={`${styles.textInput} ${styles.textArea}`}
                placeholder="Share the story of this item. Why are you giving it away?"
                value={description}
                onChange={e => setDescription(e.target.value.slice(0, 4000))}
                rows={5}
              />
              <span className={styles.charCount}>{description.length}/4000</span>
            </div>

            {/* Condition */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Condition</label>
              <div className={styles.pillRow}>
                {CONDITIONS.map(c => (
                  <button
                    key={c}
                    className={`${styles.pill} ${condition === c ? styles.pillActive : ''}`}
                    onClick={() => setCondition(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Transport Tag */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Transportation Needed</label>
              <div className={styles.pillRow}>
                {TRANSPORT_TAGS.map(t => (
                  <button
                    key={t}
                    className={`${styles.pill} ${transportTag === t ? styles.pillActive : ''}`}
                    onClick={() => setTransportTag(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="post-location">Location *</label>
              <div className={styles.locationInput}>
                <IoLocationOutline size={18} />
                <input
                  type="text"
                  id="post-location"
                  className={styles.locationTextInput}
                  placeholder="e.g. Anna Nagar, Chennai"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer CTA */}
          <div className={styles.footer}>
            <button className={styles.postBtn} disabled={!title || !location}>
              <IoHeartOutline size={20} />
              <span>Post Donation</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
