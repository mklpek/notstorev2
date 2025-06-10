import React from 'react';
import { useSafeAreaContext } from './useSafeArea.tsx';

// Safe Area değerlerini JavaScript'te kullanma örneği
export const SafeAreaExample: React.FC = () => {
  const { top, right, bottom, left } = useSafeAreaContext();

  return (
    <div style={{ padding: '16px' }}>
      <h3>Safe Area Değerleri</h3>
      <p>Top: {top}px</p>
      <p>Right: {right}px</p>
      <p>Bottom: {bottom}px</p>
      <p>Left: {left}px</p>

      {/* CSS değişkenlerini de kullanabilirsiniz */}
      <div
        style={{
          marginTop: 'var(--tg-safe-area-inset-top)',
          marginBottom: 'var(--tg-safe-area-inset-bottom)',
          padding: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
        }}
      >
        Bu div hem JavaScript değerlerini hem de CSS değişkenlerini kullanır
      </div>
    </div>
  );
};
