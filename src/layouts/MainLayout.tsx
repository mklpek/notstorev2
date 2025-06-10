import React, { useCallback } from 'react';
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

  const activeTab: 'store' | 'profile' = pathname.startsWith('/profile') ? 'profile' : 'store';
  const showHeader = activeTab === 'store';

  // Boş callback - ileride kullanılabilir
  const handleSearchOpenChange = useCallback(() => {
    // Search functionality için ileride aktif edilecek
  }, []);

  const handleTabChange = (tab: 'store' | 'profile') => {
    navigate(tab === 'store' ? '/' : '/profile');
  };

  return (
    <div className={styles.mainLayout}>
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
