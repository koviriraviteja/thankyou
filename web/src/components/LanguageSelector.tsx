'use client';

import React, { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import styles from './LanguageSelector.module.css';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'mr', label: 'मराठी' },
  { code: 'gu', label: 'ગુજરાતી' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'മലയാളം' },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState('en');

  const current = LANGUAGES.find(l => l.code === selected) || LANGUAGES[0];

  return (
    <div className={styles.container}>
      <button
        className={styles.trigger}
        onClick={() => setOpen(!open)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        aria-label="Select language"
      >
        <span className={styles.triggerLabel}>{current.code.toUpperCase()}</span>
        <IoChevronDown size={12} className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`} />
      </button>

      {open && (
        <div className={styles.dropdown}>
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              className={`${styles.option} ${selected === lang.code ? styles.optionActive : ''}`}
              onClick={() => {
                setSelected(lang.code);
                setOpen(false);
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
