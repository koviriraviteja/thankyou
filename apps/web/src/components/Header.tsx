'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { IoSearch, IoNotificationsOutline, IoChatbubbleEllipsesOutline, IoLocationOutline, IoChevronDown, IoAdd, IoPersonCircleOutline, IoMenuOutline, IoCloseOutline, IoMoonOutline, IoSunnyOutline } from 'react-icons/io5';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import styles from './Header.module.css';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        {/* Left Section */}
        <div className={styles.headerLeft}>
          <Link href="/" className={styles.logo}>
            <Image src="/logo.png" alt="ThankU Logo" width={44} height={44} className={styles.logoImage} />
            <span className={styles.logoText}>ThankU</span>
          </Link>

          {/* Location Selector (Desktop) */}
          <Link href="/location" className={styles.locationSelector} id="header-location-selector">
            <IoLocationOutline size={16} />
            <span className={styles.locationText}>India</span>
            <IoChevronDown size={14} className={styles.locationChevron} />
          </Link>
        </div>

        {/* Center Section: Search Bar */}
        <div className={`${styles.searchContainer} ${searchFocused ? styles.searchFocused : ''}`}>
          <div className={styles.searchAiBadge}>AI</div>
          <IoSearch size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search furniture, electronics, books..."
            className={styles.searchInput}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            id="header-search-input"
          />
        </div>

        {/* Right Section: Actions */}
        <div className={styles.desktopActions}>
          <button 
            className={styles.iconBtn} 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle Theme"
          >
            {mounted && (theme === 'dark' ? <IoSunnyOutline size={22} /> : <IoMoonOutline size={22} />)}
          </button>

          <Link href="/messages" className={styles.iconBtn} id="header-messages-btn" title="Messages">
            <IoChatbubbleEllipsesOutline size={22} />
            <span className={styles.badge}>3</span>
          </Link>

          <Link href="/notifications" className={styles.iconBtn} id="header-notifications-btn" title="Notifications">
            <IoNotificationsOutline size={22} />
          </Link>

          <Link href="/login" className={styles.iconBtn} id="header-profile-btn" title="Profile">
            <IoPersonCircleOutline size={24} />
          </Link>

          <Link href="/post" className={styles.postBtn} id="header-post-btn">
            <IoAdd size={20} />
            <span>Donate</span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          id="header-mobile-menu-btn"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <IoCloseOutline size={26} /> : <IoMenuOutline size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSearchContainer}>
            <IoSearch size={18} />
            <input
              type="text"
              placeholder="Search items..."
              className={styles.mobileSearchInput}
              id="mobile-search-input"
            />
          </div>
          <nav className={styles.mobileNav}>
            <Link href="/" className={styles.mobileNavItem} onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link href="/community" className={styles.mobileNavItem} onClick={() => setMobileMenuOpen(false)}>Community</Link>
            <Link href="/messages" className={styles.mobileNavItem} onClick={() => setMobileMenuOpen(false)}>Messages</Link>
            <Link href="/my-giving" className={styles.mobileNavItem} onClick={() => setMobileMenuOpen(false)}>My Giving</Link>
            <Link href="/profile" className={styles.mobileNavItem} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
            <button 
              className={styles.mobileNavItem} 
              style={{ textAlign: 'left' }}
              onClick={() => {
                setTheme(theme === 'dark' ? 'light' : 'dark');
                setMobileMenuOpen(false);
              }}
            >
              Toggle Theme
            </button>
          </nav>
          <Link href="/post" className={styles.mobilePostBtn} onClick={() => setMobileMenuOpen(false)}>
            <IoAdd size={20} />
            Donate an Item
          </Link>
        </div>
      )}
    </header>
  );
}
