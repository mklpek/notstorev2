import React from 'react';
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

  const handleSearchOpenChange = (isOpen: boolean) => {
    // Bu değer şu anda kullanılmıyor ancak ileride kullanılabilir
    console.log('Search open state changed:', isOpen);
  };

  const handleTabChange = (tab: 'store' | 'profile') => {
    navigate(tab === 'store' ? '/' : '/profile');
  };

  return (
    <div className={styles.mainLayout}>
      {/* Telegram Safe Area Padding */}
      <div className="tg-pad-top" />

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
