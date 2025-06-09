import React from 'react';

export default function SafeArea({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="tg-safe-area"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {children}
    </div>
  );
}
