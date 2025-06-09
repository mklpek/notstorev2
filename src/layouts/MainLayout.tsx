import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import TabBar from '../components/TabBar';
import styles from './MainLayout.module.css';

interface MainLayoutProps {
  onCartClick?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onCartClick }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeTab: 'store' | 'profile' = pathname.startsWith('/profile') ? 'profile' : 'store';
  const showHeader = activeTab === 'store';

  const handleSearchOpenChange = (isOpen: boolean) => {
    setIsSearchOpen(isOpen);
  };

  const handleTabChange = (tab: 'store' | 'profile') => {
    navigate(tab === 'store' ? '/' : '/profile');
  };

  return (
    <div className={styles.mainLayout}>
      {/* Görünmez safe-area padding */}
      <div className={styles.tgSafePad} />

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
