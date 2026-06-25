'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IoArrowForward, IoLogoGoogle, IoPhonePortraitOutline } from 'react-icons/io5';
import Image from 'next/image';
import styles from './page.module.css';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'welcome' | 'phone' | 'otp'>('welcome');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const renderLeftHero = () => (
    <div className={styles.leftHero}>
      <Link href="/" className={styles.logoContainer}>
        <Image src="/logo.png" alt="ThankU Logo" width={48} height={48} className={styles.logoImage} />
        <span className={styles.brandName}>ThankU</span>
      </Link>
      
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Give Freely.<br/>Help Genuinely.</h1>
        <p className={styles.heroSubtitle}>
          Join a community where giving creates happiness and the things you no longer need become treasures for someone else.
        </p>
      </div>
      
      <div className={styles.heroIllustration}>
        <div className={styles.illustrationRing} />
        <div className={styles.illustrationCenter}>
          <span className={styles.illustrationEmoji}>🤝</span>
        </div>
      </div>
    </div>
  );

  const renderFormContent = () => {
    if (step === 'welcome') {
      return (
        <div className={styles.formContent}>
          <div className={styles.welcomeHeader}>
            <h2 className={styles.formTitle}>Welcome Back</h2>
            <p className={styles.formSubtitle}>Log in or create an account to start giving and receiving.</p>
          </div>

          <div className={styles.actionSection}>
            <button className={styles.primaryBtn} onClick={() => setStep('phone')}>
              <span>Get Started</span>
              <IoArrowForward size={18} />
            </button>

            <div className={styles.divider}><span>OR</span></div>

            <button className={styles.googleBtn}>
              <IoLogoGoogle size={18} />
              <span>Continue with Google</span>
            </button>

            <button className={styles.textLink} onClick={() => setStep('phone')}>
              I already have an account
            </button>
          </div>
        </div>
      );
    }

    if (step === 'phone') {
      return (
        <div className={styles.formContent}>
          <button className={styles.backBtn} onClick={() => setStep('welcome')}>← Back</button>
          
          <div className={styles.formIcon}>
            <IoPhonePortraitOutline size={32} />
          </div>
          <h2 className={styles.formTitle}>Enter your phone number</h2>
          <p className={styles.formSubtitle}>We'll send you a verification code to confirm your identity.</p>

          <div className={styles.phoneInputGroup}>
            <span className={styles.countryCode}>+91</span>
            <input
              type="tel"
              placeholder="Mobile number"
              className={styles.phoneInput}
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              id="login-phone-input"
              autoFocus
            />
          </div>

          <button
            className={styles.primaryBtn}
            onClick={() => setStep('otp')}
            disabled={phone.length !== 10}
          >
            <span>Send OTP</span>
            <IoArrowForward size={18} />
          </button>
        </div>
      );
    }

    // OTP Step
    return (
      <div className={styles.formContent}>
        <button className={styles.backBtn} onClick={() => setStep('phone')}>← Back</button>
        
        <h2 className={styles.formTitle}>Verify your number</h2>
        <p className={styles.formSubtitle}>
          Enter the 6-digit code sent to <strong>+91 {phone}</strong>
        </p>

        <div className={styles.otpGroup}>
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              className={styles.otpInput}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <button className={styles.primaryBtn}>
          <span>Verify</span>
          <IoArrowForward size={18} />
        </button>

        <button className={styles.textLink}>
          Didn't receive? Resend in 30s
        </button>
      </div>
    );
  };

  return (
    <div className={styles.page}>
      <Link href="/" className={styles.skipBtn}>Skip to home</Link>
      
      <div className={styles.splitContainer}>
        {renderLeftHero()}
        
        <div className={styles.rightForm}>
          {renderFormContent()}
          
          {/* Footer inside right form */}
          <p className={styles.legalText}>
            By continuing, you agree to our{' '}
            <a href="#" className={styles.legalLink}>Terms</a> and{' '}
            <a href="#" className={styles.legalLink}>Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
