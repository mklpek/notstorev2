/******************************************************************************
 * File: ShareIcon.tsx
 * Layer: core
 * Desc: Share icon component for social sharing functionality
 ******************************************************************************/

import React from 'react';
import Icon from '../Icon';

interface ShareIconProps {
  className?: string | undefined;
}

/**
 * Share icon component
 * Used for social sharing functionality and sharing product information
 * @param className - Optional CSS class for styling
 * @returns JSX element containing share icon
 */
const ShareIcon: React.FC<ShareIconProps> = ({ className }) => {
  return <Icon name="share-icon" size={28} label="Share" className={className} />;
};

export default ShareIcon;
