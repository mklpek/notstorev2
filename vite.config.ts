import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [
      react(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[name]',     // <use xlinkHref="#icon-basket">
        svgoOptions: {
          plugins: [
            {
              name: 'cleanupIDs',
              active: true
            },
            {
              name: 'removeViewBox',
              active: false // viewBox kaldırılmamalı, bu hesaplamaları bozabilir
            },
            {
              name: 'removeDimensions',
              active: true // width/height çıkar, viewBox kullan
            },
          ]
        },
      }),
    ],
    build: {
      // Üretim için optimizasyonlar
      minify: isProduction ? 'terser' : false,
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          manualChunks: {
            // Temel kütüphaneleri ayrı chunk'lara böl
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
            'ui-vendor': ['react-loading-skeleton', 'react-window', 'react-virtualized-auto-sizer'],
          },
        },
      },
    },
    define: {
      // React üretim modunda gereksiz uyarıları kaldırır
      ...(isProduction && {
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    },
  };
}); 