import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last Updated: June 24, 2026</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <p className={styles.text}>
              We collect information you provide when registering: name, phone number, email address, 
              and location data. We also collect usage data to improve our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <p className={styles.text}>
              Your information is used to facilitate donations, connect users, send welcome messages, 
              and improve platform experience. We may use your email and WhatsApp for service communications.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Data Sharing</h2>
            <p className={styles.text}>
              We do not sell your personal data. Information shared between users (name, contact details) 
              is limited to what is necessary for donation coordination.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Security</h2>
            <p className={styles.text}>
              We implement industry-standard security measures to protect your data. 
              However, no online platform can guarantee complete security.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Your Rights</h2>
            <p className={styles.text}>
              You may request access, correction, or deletion of your data at any time. 
              Contact us at support@thanku.com for data-related requests.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Cookies</h2>
            <p className={styles.text}>
              We use essential cookies for platform functionality. See our Cookie Policy for details.
              By using the platform, you consent to our use of cookies.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Contact</h2>
            <p className={styles.text}>
              For privacy concerns, contact us at privacy@thanku.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
