import React from 'react';
import { isTelegram } from '../utils/isTelegram';
import { useSafeAreaContext } from '../hooks/useSafeArea';

/**
 * SafeAreaDebug - SafeFrame'in çalışıp çalışmadığını test etmek için debug bileşeni
 * Geliştirme aşamasında kullanılır, production'da kaldırılabilir
 */
export const SafeAreaDebug: React.FC = () => {
  const { top, right, bottom, left } = useSafeAreaContext();
  const isInTelegram = isTelegram();

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        padding: '8px',
        borderRadius: '4px',
        fontSize: '12px',
        zIndex: 9999,
        fontFamily: 'monospace',
      }}
    >
      <div>🔍 SafeFrame Debug</div>
      <div>Telegram: {isInTelegram ? '✅' : '❌'}</div>
      <div>Top: {top}px</div>
      <div>Right: {right}px</div>
      <div>Bottom: {bottom}px</div>
      <div>Left: {left}px</div>
      <div>SafeFrame ID: {document.getElementById('safe-frame') ? '✅' : '❌'}</div>
      <div>TG Class: {document.querySelector('.tg-app') ? '✅' : '❌'}</div>
    </div>
  );
};

export default SafeAreaDebug;
