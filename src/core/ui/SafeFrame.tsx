import { isTelegram } from '../utils/isTelegram';
import type { ReactNode } from 'react';

interface SafeFrameProps {
  children: ReactNode;
}

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
