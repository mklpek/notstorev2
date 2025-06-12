/******************************************************************************
 * File: Button.tsx
 * Layer: core
 * Desc: Reusable button component with variant and size options
 ******************************************************************************/

import type { ReactNode, ButtonHTMLAttributes } from 'react';
import styles from './Button.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

/**
 * Reusable button component with customizable variants and sizes
 * Extends native button element with additional styling options
 * @param children - Button content (text, icons, etc.)
 * @param variant - Button style variant (primary or secondary)
 * @param size - Button size (small, medium, or large)
 * @param className - Additional CSS classes
 * @param props - Additional button HTML attributes
 * @returns JSX element containing styled button
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props
}: ButtonProps) => {
  const buttonClasses = [
    styles.button,
    variant === 'secondary' ? styles.secondary : '',
    size === 'small' ? styles.small : '',
    size === 'large' ? styles.large : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
