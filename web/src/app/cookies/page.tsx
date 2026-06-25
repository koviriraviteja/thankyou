import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function CookiesPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Cookie Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: June 24, 2026</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. What Are Cookies</h2>
            <p className={styles.text}>
              Cookies are small text files stored on your device to enhance your browsing experience. 
              They help us remember your preferences and improve platform functionality.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Types of Cookies We Use</h2>
            <p className={styles.text}>
              <strong>Essential Cookies:</strong> Required for platform operation, including authentication and security.<br />
              <strong>Preference Cookies:</strong> Remember your theme selection and language preferences.<br />
              <strong>Analytics Cookies:</strong> Help us understand platform usage to improve our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Managing Cookies</h2>
            <p className={styles.text}>
              You can control cookies through your browser settings. Disabling essential cookies 
              may affect platform functionality.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Third-Party Cookies</h2>
            <p className={styles.text}>
              We do not use third-party tracking cookies. Analytics are conducted through 
              first-party data collection.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Updates</h2>
            <p className={styles.text}>
              This policy may be updated periodically. Continued use of the platform constitutes 
              acceptance of any changes.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Contact</h2>
            <p className={styles.text}>
              For questions about our cookie policy, contact us at support@thanku.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
