/******************************************************************************
 * File: MainLayout.tsx
 * Layer: layout
 * Desc: Main application layout with header, content area, and tab bar navigation
 ******************************************************************************/

import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import TabBar from './TabBar';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  onCartClick?: () => void;
}

/**
 * Main application layout component
 * Provides consistent layout structure with header, content, and tab bar
 * @param onCartClick - Optional callback when cart button is clicked
 * @returns JSX element containing main layout structure
 */
const MainLayout: React.FC<MainLayoutProps> = ({ onCartClick }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeTab: 'store' | 'profile' = pathname.startsWith('/profile') ? 'profile' : 'store';
  const showHeader = activeTab === 'store';

  /**
   * Handles search open state changes
   * @param isOpen - Whether search is currently open
   */
  const handleSearchOpenChange = (isOpen: boolean) => {
    setIsSearchOpen(isOpen);
  };

  /**
   * Handles tab navigation
   * @param tab - Target tab ('store' or 'profile')
   */
  const handleTabChange = (tab: 'store' | 'profile') => {
    navigate(tab === 'store' ? '/' : '/profile');
  };

  return (
    <div className={`${styles.mainLayout} tg-pad-top`}>
      {showHeader && (
        <Header {...(onCartClick && { onCartClick })} onSearchOpen={handleSearchOpenChange} />
      )}
      <main
        className={`
        ${styles.content} 
        ${!showHeader ? styles.contentNoHeader : ''}
      `}
      >
        <Outlet />
      </main>
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default MainLayout;
