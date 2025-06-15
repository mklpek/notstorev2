/******************************************************************************
 * File: useSafeArea/example.tsx
 * Layer: core
 * Desc: Example component demonstrating safe area usage with JavaScript and CSS
 ******************************************************************************/

import React from 'react';
import { useSafeAreaContext } from './index';

/**
 * Example component showing how to use Safe Area values in JavaScript
 * Demonstrates both JavaScript values and CSS variables usage
 * @returns JSX element displaying safe area values and usage examples
 */
export const SafeAreaExample: React.FC = () => {
  const { top, right, bottom, left } = useSafeAreaContext();

  return (
    <div style={{ padding: '16px' }}>
      <h3>Safe Area Values</h3>
      <p>Top: {top}px</p>
      <p>Right: {right}px</p>
      <p>Bottom: {bottom}px</p>
      <p>Left: {left}px</p>

      {/* You can also use CSS variables */}
      <div
        style={{
          marginTop: 'var(--tg-safe-area-inset-top)',
          marginBottom: 'var(--tg-safe-area-inset-bottom)',
          padding: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
        }}
      >
        This div uses both JavaScript values and CSS variables
      </div>
    </div>
  );
};
