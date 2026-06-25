'use client';

import React from 'react';
import Link from 'next/link';
import { IoChevronForward, IoHelpBuoyOutline, IoMailOutline, IoChatbubblesOutline } from 'react-icons/io5';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import styles from './page.module.css';

const MOCK_FAQS = [
  {
    question: 'How do I post a donation?',
    answer: 'Click on the "Post Donation" button in the header, fill out the details about your item, add some clear photos, and publish your listing. It will instantly become visible to your local community.'
  },
  {
    question: 'Is everything really free?',
    answer: 'Yes! ThankU is built on the spirit of giving. All items listed on the platform must be given away completely free of charge. No money should exchange hands.'
  },
  {
    question: 'How do I arrange pickup?',
    answer: 'Once you connect with someone via messages, you can arrange a safe public meeting spot or coordinate a pickup directly through the chat.'
  },
  {
    question: 'Can I request items?',
    answer: 'Currently, the platform focuses on individuals posting items they want to give away. You can browse and search for items, and message the donor if you are interested.'
  }
];

export default function HelpPage() {
  return (
    <>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          {/* Breadcrumb */}
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <IoChevronForward size={12} />
            <span>Help Center</span>
          </nav>

          <div className={styles.headerSection}>
            <div className={styles.iconWrapper}>
              <IoHelpBuoyOutline size={48} color="var(--color-primary)" />
            </div>
            <h1 className={styles.title}>How can we help you?</h1>
            <p className={styles.subtitle}>Find answers to common questions or reach out to our support team.</p>
          </div>

          <div className={styles.faqSection}>
            <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {MOCK_FAQS.map((faq, index) => (
                <div key={index} className={styles.faqItem}>
                  <h3 className={styles.faqQuestion}>{faq.question}</h3>
                  <p className={styles.faqAnswer}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.contactSection}>
            <h2 className={styles.sectionTitle}>Still need help?</h2>
            <div className={styles.contactCards}>
              <div className={styles.contactCard}>
                <IoMailOutline size={32} className={styles.contactIcon} />
                <h3 className={styles.contactTitle}>Email Support</h3>
                <p className={styles.contactDesc}>Drop us an email and we&apos;ll get back to you within 24 hours.</p>
                <a href="mailto:support@thanku.app" className={styles.contactLink}>support@thanku.app</a>
              </div>
              <div className={styles.contactCard}>
                <IoChatbubblesOutline size={32} className={styles.contactIcon} />
                <h3 className={styles.contactTitle}>Community Forum</h3>
                <p className={styles.contactDesc}>Ask questions and get answers from other ThankU members.</p>
                <Link href="/community" className={styles.contactLink}>Go to Forum</Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
