import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { CircleSkeleton, TextSkeleton, ImageSkeleton } from './SkeletonElements';
import styles from './AccountPageSkeleton.module.css';

interface AccountPageSkeletonProps {
  showHistory?: boolean;
  historyItemCount?: number;
}

const AccountPageSkeleton: React.FC<AccountPageSkeletonProps> = ({ 
  showHistory = false, 
  historyItemCount = 6 
}) => {
  return (
    <div className={styles.accountPageSkeleton}>
      {/* Account Header Skeleton */}
      <div className={styles.accountHeaderSkeleton}>
        {/* Avatar Skeleton */}
        <div className={styles.avatarSkeleton}>
          <CircleSkeleton size={120} />
        </div>
        
        {/* Name Skeleton */}
        <div className={styles.infoSkeleton}>
          <TextSkeleton width={80} height={32} />
        </div>
      </div>

      {/* Content Area Skeleton */}
      {showHistory ? (
        // History Content Skeleton
        <div className={styles.historyContainerSkeleton}>
          {/* History Header Skeleton */}
          <div className={styles.historyHeaderSkeleton}>
            <TextSkeleton width={70} height={24} />
          </div>
          
          {/* History Items Skeleton */}
          <div className={styles.historyItemsSkeleton}>
            {Array.from({ length: historyItemCount }).map((_, index) => (
              <div key={index} className={styles.historyLineSkeleton}>
                {/* History Item Avatar */}
                <ImageSkeleton borderRadius={12} />
                
                {/* History Item Info */}
                <div className={styles.historyInfoSkeleton}>
                  <div className={styles.productInfoSkeleton}>
                    <TextSkeleton width={60} height={14} />
                    <TextSkeleton width={120} height={16} />
                  </div>
                  <div className={styles.purchaseInfoSkeleton}>
                    <TextSkeleton width={80} height={14} />
                    <TextSkeleton width={60} height={16} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // No History Content Skeleton
        <div className={styles.collectionsSkeleton}>
          <div className={styles.emojiPlaceholderSkeleton}>
            <div className={styles.placeholderBodySkeleton}>
              <div className={styles.textFrameSkeleton}>
                <TextSkeleton width={180} height={32} />
                <TextSkeleton width={140} height={22} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// React DevTools için komponent adı
AccountPageSkeleton.displayName = 'AccountPageSkeleton';

export default AccountPageSkeleton; 