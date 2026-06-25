import React from 'react';
import Link from 'next/link';
import { IoHeart, IoLogoGithub, IoLogoTwitter, IoLogoInstagram, IoLogoWhatsapp, IoMail } from 'react-icons/io5';
import Image from 'next/image';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="ThankU Logo" width={28} height={28} />
            <span className={styles.logoText}>ThankU</span>
          </Link>
          <p className={styles.brandDesc}>
            A social service employment platform where giving creates jobs and 
            gratitude grows. Every donation builds livelihoods.
          </p>
          <div className={styles.socialLinks}>
            <a href="https://wa.me/1234567890" className={styles.socialLink} aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><IoLogoWhatsapp size={18} /></a>
            <a href="mailto:support@thanku.com" className={styles.socialLink} aria-label="Email"><IoMail size={18} /></a>
            <a href="#" className={styles.socialLink} aria-label="Instagram"><IoLogoInstagram size={18} /></a>
          </div>
        </div>

        {/* Links Columns */}
        <div className={styles.linksGrid}>
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Discover</h4>
            <Link href="/" className={styles.footerLink}>Browse Items</Link>
            <Link href="/community" className={styles.footerLink}>Community Wall</Link>
            <Link href="/post" className={styles.footerLink}>Donate an Item</Link>
            <Link href="/leaderboard" className={styles.footerLink}>Donation Levels</Link>
          </div>
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Support</h4>
            <Link href="/help" className={styles.footerLink}>Help Center</Link>
            <Link href="/safety" className={styles.footerLink}>Safety Tips</Link>
            <a href="https://wa.me/1234567890" className={styles.footerLink} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="mailto:support@thanku.com" className={styles.footerLink}>Email Us</a>
          </div>
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Legal</h4>
            <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
            <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="/cookies" className={styles.footerLink}>Cookie Policy</Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <p className={styles.copyright}>
          © {new Date().getFullYear()} ThankU. Made with <IoHeart size={12} className={styles.heartIcon} /> in India.
        </p>
      </div>
    </footer>
  );
}
