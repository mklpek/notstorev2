import { isTelegram } from '../utils/isTelegram';
import type { ReactNode } from 'react';

interface SafeFrameProps {
  children: ReactNode;
}

/**
 * SafeFrame - Telegram Mini App için safe area wrapper
 * Localhost'ta hiçbir etki yapmaz, sadece Telegram içinde safe area padding'i uygular
 */
export default function SafeFrame({ children }: SafeFrameProps) {
  return (
    <div
      id="safe-frame"
      className={isTelegram() ? 'tg-app' : ''}
      data-tg={isTelegram() ? 'true' : undefined}
    >
      {children}
    </div>
  );
}
