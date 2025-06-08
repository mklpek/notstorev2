import React from 'react'
import StoreIcon from '../Icons/StoreIcon'
import styles from './TabBar.module.css'

interface TabBarProps {
  activeTab?: 'store' | 'profile'
  onTabChange?: ((tab: 'store' | 'profile') => void) | undefined
}

const TabBar: React.FC<TabBarProps> = ({ activeTab = 'store', onTabChange }) => {
  const handleTabClick = (tab: 'store' | 'profile') => {
    if (onTabChange) {
      onTabChange(tab)
    }
  }

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
                src="/images/profile-image.png" 
                alt="Profile" 
                className={styles.profileImage}
              />
            </div>
          </div>
          <span className={styles.text}>Alex</span>
        </div>
      </div>
    </div>
  )
}

export default TabBar 