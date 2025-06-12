/******************************************************************************
 * File: TabBar.tsx
 * Layer: layout
 * Desc: Bottom navigation tab bar with store and profile tabs
 ******************************************************************************/

import React from 'react';
import StoreIcon from '../../core/ui/Icons/StoreIcon';
import styles from './TabBar.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../core/store';

interface TabBarProps {
  activeTab?: 'store' | 'profile';
  onTabChange?: ((tab: 'store' | 'profile') => void) | undefined;
}

/**
 * Bottom navigation tab bar component
 * Provides navigation between store and profile sections
 * @param activeTab - Currently active tab (default: 'store')
 * @param onTabChange - Optional callback when tab is changed
 * @returns JSX element containing tab bar navigation
 */
const TabBar: React.FC<TabBarProps> = ({ activeTab = 'store', onTabChange }) => {
  // Get Telegram user information from Redux
  const userState = useSelector((state: RootState) => state.user);
  const user = userState.user;

  /**
   * Handles tab click events
   * @param tab - Tab identifier ('store' or 'profile')
   */
  const handleTabClick = (tab: 'store' | 'profile') => {
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div className={styles.tabBar}>
      <div className={styles.body}>
        {/* Store Tab */}
        <div
          className={`${styles.tab} ${activeTab === 'store' ? styles.active : styles.idle}`}
          onClick={() => handleTabClick('store')}
        >
          <div className={styles.iconContainer}>
            <StoreIcon className={styles.icon} />
          </div>
          <span className={styles.text}>Store</span>
        </div>

        {/* Profile Tab */}
        <div
          className={`${styles.tab} ${activeTab === 'profile' ? styles.active : styles.idle}`}
          onClick={() => handleTabClick('profile')}
        >
          <div className={styles.iconContainer}>
            <div className={styles.profileContainer}>
              <img
                src={
                  user?.photoUrl && user.photoUrl !== 'none'
                    ? user.photoUrl
                    : '/images/profile-avatar.png'
                }
                alt="Profile"
                className={styles.profileImage}
              />
              {user?.is_premium && (
                <div className={styles.premiumIndicator} title="Premium User">
                  ⭐
                </div>
              )}
            </div>
          </div>
          <span className={styles.text}>Profile</span>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
