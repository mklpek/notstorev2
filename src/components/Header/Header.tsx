import React, { useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import { selectCartCount } from '../../features/cart/selectors'
import SearchIcon from '../Icons/SearchIcon'
import BasketIcon from '../Icons/BasketIcon'
import DeleteIcon from '../Icons/DeleteIcon'
import styles from './Header.module.css'

interface HeaderProps {
  onCartClick?: () => void
  onSearchOpen?: (isOpen: boolean) => void
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onSearchOpen }) => {
  // URL search params kullanımı - arama parametresini URL'den almak için
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  // Sepetteki toplam ürün sayısını al
  const cartCount = useAppSelector(selectCartCount);
  
  // Arama barının açık olup olmadığını URL'den al
  const isSearchOpen = !!query || searchParams.has('search');
  
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    // Search durumunu parent bileşene bildir
    if (onSearchOpen) {
      onSearchOpen(isSearchOpen);
    }
  }, [isSearchOpen, onSearchOpen]);

  const handleSearchClick = () => {
    // Arama butonuna tıklandığında search parametresini URL'e ekle
    setSearchParams({ search: 'true' }, { replace: true });
  }

  const handleSearchClose = () => {
    // Tüm query parametrelerini temizle
    setSearchParams({}, { replace: true });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      // Input değeri varsa q parametresi olarak ekle
      setSearchParams({ q: value }, { replace: true });
    } else {
      // Input boşsa arama modunda kal ama q parametresini kaldır
      setSearchParams({ search: 'true' }, { replace: true });
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSearchClose();
    }
  }

  const handleClearInput = () => {
    // Input değerini temizle ve search modunda kal
    setSearchParams({ search: 'true' }, { replace: true });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }

  return (
    <header className={`${styles.header} ${isSearchOpen ? styles.searchOpen : ''}`}>
      {isSearchOpen ? (
        <div className={styles.searchContainer}>
          <div className={styles.searchInput}>
            <div className={styles.searchIcon}>
              <SearchIcon />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Search"
              className={styles.input}
              autoFocus
            />
            {query && (
              <button className={styles.clearButton} onClick={handleClearInput} aria-label="Clear search">
                <DeleteIcon />
              </button>
            )}
          </div>
          <button className={styles.cancelButton} onClick={handleSearchClose}>
            Cancel
          </button>
        </div>
      ) : (
        <>
          <div className={styles.headerLeft}>
            <h1 className={styles.headerTitle}>Not Store</h1>
          </div>
          <div className={styles.headerButtons}>
            <button className={styles.headerButton} onClick={handleSearchClick}>
              <SearchIcon />
            </button>
            <button className={styles.headerButton} onClick={onCartClick}>
              {cartCount > 0 ? (
                <div className={styles.cartCountContainer}>
                  <span className={styles.cartCount}>{cartCount}</span>
                </div>
              ) : (
                <BasketIcon />
              )}
            </button>
          </div>
        </>
      )}
    </header>
  )
}

export default Header 