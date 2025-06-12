/******************************************************************************
 * File: ApiErrorMessage.tsx
 * Layer: core
 * Desc: API error message component with retry functionality and status-based messaging
 ******************************************************************************/

import React from 'react';
import styles from './ApiErrorMessage.module.css';

interface ApiErrorMessageProps {
  error: any;
  onRetry?: () => void;
  customMessage?: string;
}

/**
 * API error message component
 * Displays user-friendly error messages based on HTTP status codes
 * Includes optional retry functionality for failed requests
 * @param error - Error object containing status and message information
 * @param onRetry - Optional callback function for retry button
 * @param customMessage - Optional custom error message to override default
 * @returns JSX element containing error message and optional retry button
 */
const ApiErrorMessage: React.FC<ApiErrorMessageProps> = ({ error, onRetry, customMessage }) => {
  /**
   * Determines appropriate error message based on HTTP status code
   * @returns User-friendly error message string
   */
  const getErrorMessage = () => {
    if (customMessage) return customMessage;

    if (!error) return 'An unknown error occurred';

    // Determine message based on status code
    if (error.status === 404) {
      return 'The requested resource was not found';
    } else if (error.status >= 500) {
      return 'Server error occurred, please try again later';
    } else if (error.status === 401 || error.status === 403) {
      return 'You do not have permission for this operation';
    }

    return 'An error occurred, please try again';
  };

  return (
    <div className={styles.errorContainer}>
      <div className={styles.iconContainer}>
        <svg
          className={styles.icon}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <line
            x1="12"
            y1="7"
            x2="12"
            y2="13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
        </svg>
      </div>
      <div className={styles.textContainer}>
        <h2 className={styles.title}>Error Occurred</h2>
        <p className={styles.description}>{getErrorMessage()}</p>
      </div>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
};

export default ApiErrorMessage;
