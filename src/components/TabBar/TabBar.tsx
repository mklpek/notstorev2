import React from 'react';
import StoreIcon from '../Icons/StoreIcon';
import styles from './TabBar.module.css';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';

interface TabBarProps {
  activeTab?: 'store' | 'profile';
  onTabChange?: ((tab: 'store' | 'profile') => void) | undefined;
}

const TabBar: React.FC<TabBarProps> = ({ activeTab = 'store', onTabChange }) => {
  // Redux'tan Telegram kullanıcı bilgilerini al
  const userState = useSelector((state: RootState) => state.user);
  const user = userState.user;

  // Kullanıcı adını oluştur
  const displayName = user ? user.first_name || '' : 'Profile';

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
                src={user?.photoUrl || '/images/profile-image.png'}
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
          <span className={styles.text}>{displayName}</span>
        </div>
      </div>
    </div>
  );
};

export default TabBar;
