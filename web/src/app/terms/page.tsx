import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last Updated: June 24, 2026</p>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p className={styles.text}>
              By accessing or using ThankU (&ldquo;the Platform&rdquo;), you agree to be bound by these Terms of Service. 
              If you do not agree, please do not use our services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Platform Mission</h2>
            <p className={styles.text}>
              ThankU is a social service employment platform that connects donors with recipients. 
              Our mission is to create employment opportunities through community-driven donations. 
              All items listed are given freely as donations.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. User Responsibilities</h2>
            <p className={styles.text}>
              Users must provide accurate information when registering. You are responsible for 
              maintaining the confidentiality of your account. You agree not to misuse the platform 
              for fraudulent or illegal activities.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Donations & Listings</h2>
            <p className={styles.text}>
              All items listed on ThankU are free donations. Users may list items they genuinely 
              wish to give away. Donors and recipients coordinate pickup/delivery directly. 
              The platform facilitates connections but is not responsible for transactions between users.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Rating System</h2>
            <p className={styles.text}>
              Our rating system uses percentage-based tiers (1% increments) to ensure fair 
              and granular feedback. Ratings reflect user reliability and community standing.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Donation Levels</h2>
            <p className={styles.text}>
              The platform features 200 donation levels to recognize community contributors. 
              Higher levels unlock additional platform features and recognition badges.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Validation & Quality</h2>
            <p className={styles.text}>
              We maintain a 2-3% validation rate to ensure service quality. Listings may be 
              reviewed periodically to maintain platform standards. Our target satisfaction rate 
              is 90-95%.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Limitation of Liability</h2>
            <p className={styles.text}>
              ThankU is provided &ldquo;as is&rdquo; without warranties. We are not liable for disputes 
              between users, loss of items, or any damages arising from platform use.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Changes to Terms</h2>
            <p className={styles.text}>
              We reserve the right to modify these terms at any time. Users will be notified 
              of material changes via email or platform notification.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Contact</h2>
            <p className={styles.text}>
              For questions about these terms, contact us at support@thanku.com or via WhatsApp.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
