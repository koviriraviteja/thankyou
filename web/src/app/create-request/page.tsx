'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { IoCameraOutline } from 'react-icons/io5';
import styles from './page.module.css';

const CATEGORIES = ['Education', 'Medical', 'Food', 'Household', 'Emergency', 'Other'];
const URGENCY_LEVELS = ['Low', 'Medium', 'High'];

export default function CreateRequestPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [urgency, setUrgency] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !category || !urgency) {
      alert('Please fill out all fields to post your request.');
      return;
    }
    // Mock submit
    alert('Request Posted! Your community has been notified. We hope you get the help you need soon.');
    window.location.href = '/community';
  };

  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.formCard}>
            <div className={styles.header}>
              <button className={styles.cancelText} onClick={() => window.history.back()}>Cancel</button>
              <h1 className={styles.headerTitle}>Ask for Help</h1>
              <button className={styles.postText} onClick={handlePost}>Post</button>
            </div>

            <form className={styles.content} onSubmit={handlePost}>
              {/* Title */}
              <label className={styles.label}>What do you need help with?</label>
              <input
                className={styles.textInput}
                placeholder="e.g., Need 5 notebooks for 10th grade"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={60}
              />

              {/* Description */}
              <label className={styles.label}>Describe your situation</label>
              <textarea
                className={styles.textArea}
                placeholder="Share why you need this and how it will help you..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
              />

              {/* Category */}
              <label className={styles.label}>Category</label>
              <div className={styles.pillContainer}>
                {CATEGORIES.map(cat => (
                  <button
                    type="button"
                    key={cat}
                    className={`${styles.pill} ${category === cat ? styles.pillActive : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Urgency */}
              <label className={styles.label}>Urgency Level</label>
              <div className={styles.pillContainer}>
                {URGENCY_LEVELS.map(level => (
                  <button
                    type="button"
                    key={level}
                    className={`${styles.pill} ${urgency === level ? styles.pillActive : ''}`}
                    onClick={() => setUrgency(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>

              {/* Add Media */}
              <label className={styles.label}>Add Photos (Optional)</label>
              <button type="button" className={styles.mediaUpload}>
                <IoCameraOutline size={32} className={styles.primaryColor} />
                <span className={styles.mediaUploadText}>Tap to add photo</span>
              </button>

            </form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
