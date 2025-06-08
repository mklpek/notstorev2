import React from 'react';

interface IconProps {
  name: string;
  size?: number;
  label?: string;          // erişilebilirlik için
  className?: string | undefined;
}

const Icon: React.FC<IconProps> = ({ name, size = 24, label, className }) => (
  <svg
    width={size}
    height={size}
    aria-hidden={label ? undefined : true}
    aria-label={label}
    role="img"
    className={className}
    style={{ fill: 'currentColor' }}   // Telegram tema rengi
    focusable="false"                 // Tab sırasına girmemesi için
  >
    <use xlinkHref={`#icon-${name}`} />  {/* sprite içindeki <symbol> */}
  </svg>
);

export default Icon; 