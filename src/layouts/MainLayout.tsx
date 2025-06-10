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

  const handleTabChange = (tab: 'store' | 'profile') => {
    navigate(tab === 'store' ? '/' : '/profile');
  };

  return (
    <div className={styles.mainLayout}>
      {showHeader && <Header {...(onCartClick && { onCartClick })} />}
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
