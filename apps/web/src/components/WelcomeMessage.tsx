'use client';

import React, { useEffect, useState } from 'react';
import { IoClose, IoCheckmarkCircle, IoLogoWhatsapp, IoMail } from 'react-icons/io5';
import styles from './WelcomeMessage.module.css';

export default function WelcomeMessage() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('thanku-welcome-dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('thanku-welcome-dismissed', 'true');
  };

  if (!visible) return null;

  return (
    <div className={styles.overlay} onClick={handleDismiss}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={handleDismiss} aria-label="Close">
          <IoClose size={20} />
        </button>

        <div className={styles.iconContainer}>
          <IoCheckmarkCircle size={40} className={styles.icon} />
        </div>

        <h2 className={styles.title}>Welcome to ThankU!</h2>
        <p className={styles.message}>
          Thank you for downloading our app and we are going to do this type of services. 
          Please be updated.
        </p>

        <div className={styles.actions}>
          <a href="https://wa.me/1234567890" className={styles.whatsappBtn} target="_blank" rel="noopener noreferrer">
            <IoLogoWhatsapp size={18} />
            Join on WhatsApp
          </a>
          <a href="mailto:support@thanku.com" className={styles.emailBtn}>
            <IoMail size={18} />
            Email Us
          </a>
        </div>

        <button className={styles.dismissBtn} onClick={handleDismiss}>
          Got it!
        </button>
      </div>
    </div>
  );
}
