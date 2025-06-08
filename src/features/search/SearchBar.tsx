/*
import React, { useState, useRef, useEffect } from 'react'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  isOpen: boolean
  onClose: () => void
  onSearch?: (query: string) => void
}

const SearchBar: React.FC<SearchBarProps> = ({ isOpen, onClose, onSearch }) => {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSearch = () => {
    if (onSearch) {
      onSearch(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleCancel = () => {
    setQuery('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchInput}>
        <div className={styles.searchIcon}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" 
              d="M10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3ZM1 10.5C1 5.25329 5.25329 1 10.5 1C15.7467 1 20 5.25329 20 10.5C20 15.7467 15.7467 20 10.5 20C5.25329 20 1 15.7467 1 10.5Z" 
              fill="white" 
            />
            <path fillRule="evenodd" clipRule="evenodd" 
              d="M15.7071 15.7071C16.0976 15.3166 16.0976 14.6834 15.7071 14.2929L14.2929 15.7071C14.6834 16.0976 15.3166 16.0976 15.7071 15.7071ZM14.2929 15.7071L15.7071 14.2929L19.7071 18.2929C20.0976 18.6834 20.0976 19.3166 19.7071 19.7071C19.3166 20.0976 18.6834 20.0976 18.2929 19.7071L14.2929 15.7071Z" 
              fill="white" 
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search"
          className={styles.input}
        />
        {query && (
          <div className={styles.typer}></div>
        )}
      </div>
      <button className={styles.cancelButton} onClick={handleCancel}>
        Cancel
      </button>
    </div>
  )
}

export default SearchBar
*/ 