import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';

// Build timestamp replacement plugin
const buildTimestampPlugin = () => {
  return {
    name: 'build-timestamp',
    generateBundle() {
      // Bu plugin build sırasında timestamp'i replace eder
    },
    transformIndexHtml(html: string) {
      // BUILD_TIMESTAMP_PLACEHOLDER'ı gerçek timestamp ile değiştir
      return html.replace('BUILD_TIMESTAMP_PLACEHOLDER', Date.now().toString());
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const buildTimestamp = Date.now();

  return {
    plugins: [
      react(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[name]', // <use xlinkHref="#icon-basket">
        svgoOptions: {
          plugins: [
            {
              name: 'cleanupIDs',
              active: true,
            },
            {
              name: 'removeViewBox',
              active: false, // viewBox kaldırılmamalı, bu hesaplamaları bozabilir
            },
            {
              name: 'removeDimensions',
              active: true,
            },
          ],
        },
      }),
      buildTimestampPlugin(),
    ],
    // Font dosyalarının asset olarak işlenmesi için
    assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.otf'],
    build: {
      // Üretim için optimizasyonlar
      minify: isProduction ? 'terser' : false,
      sourcemap: !isProduction,
      rollupOptions: {
        output: {
          // Daha güçlü hash sistemi - timestamp ekle
          entryFileNames: `assets/[name]-[hash]-${buildTimestamp}.js`,
          chunkFileNames: `assets/[name]-[hash]-${buildTimestamp}.js`,
          manualChunks: {
            // Temel kütüphaneleri ayrı chunk'lara böl
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'redux-vendor': ['@reduxjs/toolkit', 'react-redux', 'redux-persist'],
            'ui-vendor': ['react-loading-skeleton', 'react-window', 'react-virtualized-auto-sizer'],
          },
          // Asset dosyalarının isimlendirme formatı
          assetFileNames: assetInfo => {
            if (!assetInfo.name) {
              return `assets/[name].[hash][extname]`;
            }

            if (/\.(woff|woff2|ttf|otf)$/.test(assetInfo.name)) {
              return `fonts/[name].[hash][extname]`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `images/[name].[hash][extname]`;
            }
            return `assets/[name].[hash][extname]`;
          },
        },
      },
    },
    define: {
      // React üretim modunda gereksiz uyarıları kaldırır
      ...(isProduction && {
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      // Build timestamp'i global olarak tanımla
      __BUILD_TIMESTAMP__: JSON.stringify(buildTimestamp),
    },
  };
});
