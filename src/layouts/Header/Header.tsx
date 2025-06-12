/******************************************************************************
 * File: Header.tsx
 * Layer: layout
 * Desc: Main application header with search functionality and cart integration
 ******************************************************************************/

import React, { useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppSelector } from '../../core/store/hooks';
import { selectCartCount } from '../../features/cart/selectors';
import SearchIcon from '../../core/ui/Icons/SearchIcon';
import BasketIcon from '../../core/ui/Icons/BasketIcon';
import DeleteIcon from '../../core/ui/Icons/DeleteIcon';
import styles from './Header.module.css';

interface HeaderProps {
  onCartClick?: () => void;
  onSearchOpen?: (isOpen: boolean) => void;
}

/**
 * Main application header component
 * Handles search functionality, cart display, and navigation
 * @param onCartClick - Optional callback when cart button is clicked
 * @param onSearchOpen - Optional callback when search state changes
 * @returns JSX element containing header with search and cart functionality
 */
const Header: React.FC<HeaderProps> = ({ onCartClick, onSearchOpen }) => {
  // Use URL search params - to get search parameter from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Get total number of items in cart
  const cartCount = useAppSelector(selectCartCount);

  // Check if search bar is open from URL
  const isSearchOpen = !!query || searchParams.has('search');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    // Notify parent component about search state
    if (onSearchOpen) {
      onSearchOpen(isSearchOpen);
    }
  }, [isSearchOpen, onSearchOpen]);

  /**
   * Handles search button click
   * Adds search parameter to URL when search button is clicked
   */
  const handleSearchClick = () => {
    setSearchParams({ search: 'true' }, { replace: true });
  };

  /**
   * Handles search close
   * Clears all query parameters
   */
  const handleSearchClose = () => {
    setSearchParams({}, { replace: true });
  };

  /**
   * Handles input value changes
   * Updates URL parameters based on input value
   * @param e - Input change event
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      // Add as q parameter if input has value
      setSearchParams({ q: value }, { replace: true });
    } else {
      // Stay in search mode but remove q parameter if input is empty
      setSearchParams({ search: 'true' }, { replace: true });
    }
  };

  /**
   * Handles keyboard events
   * Closes search on Escape key
   * @param e - Keyboard event
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSearchClose();
    }
  };

  /**
   * Handles input clear button
   * Clears input value and stays in search mode
   */
  const handleClearInput = () => {
    setSearchParams({ search: 'true' }, { replace: true });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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
              <button
                className={styles.clearButton}
                onClick={handleClearInput}
                aria-label="Clear search"
              >
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
  );
};

export default Header;
