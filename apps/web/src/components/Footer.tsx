import React from 'react';
import Link from 'next/link';
import { IoHeart, IoLogoGithub, IoLogoTwitter, IoLogoInstagram } from 'react-icons/io5';
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
            A community where giving creates happiness and gratitude grows. Every small act of kindness matters.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Twitter"><IoLogoTwitter size={18} /></a>
            <a href="#" className={styles.socialLink} aria-label="Instagram"><IoLogoInstagram size={18} /></a>
            <a href="#" className={styles.socialLink} aria-label="GitHub"><IoLogoGithub size={18} /></a>
          </div>
        </div>

        {/* Links Columns */}
        <div className={styles.linksGrid}>
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Discover</h4>
            <Link href="/" className={styles.footerLink}>Browse Items</Link>
            <Link href="/community" className={styles.footerLink}>Community Wall</Link>
            <Link href="/post" className={styles.footerLink}>Donate an Item</Link>
          </div>
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Support</h4>
            <Link href="/help" className={styles.footerLink}>Help Center</Link>
            <Link href="/safety" className={styles.footerLink}>Safety Tips</Link>
            <Link href="#" className={styles.footerLink}>Contact Us</Link>
          </div>
          <div className={styles.linksCol}>
            <h4 className={styles.colTitle}>Legal</h4>
            <Link href="#" className={styles.footerLink}>Terms of Service</Link>
            <Link href="#" className={styles.footerLink}>Privacy Policy</Link>
            <Link href="#" className={styles.footerLink}>Cookie Policy</Link>
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
