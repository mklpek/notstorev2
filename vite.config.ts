import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

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
    ],
    // Font dosyalarının asset olarak işlenmesi için
    assetsInclude: ['**/*.woff', '**/*.woff2', '**/*.ttf', '**/*.otf'],
    // Server konfigürasyonu - CORS ve sıkışma
    server: {
      port: 5173,
      strictPort: false,
      cors: true,
      hmr: {
        overlay: true,
      },
      fs: {
        strict: false, // Kök dizin dışındaki dosyalara erişim
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'), // @ ile src dizinine erişim
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@reduxjs/toolkit',
        'react-redux',
        'redux-persist',
        'react-loading-skeleton',
      ],
      exclude: [], // @twa-dev/sdk artık hariç tutmuyoruz
      esbuildOptions: {
        // CommonJS modüllerini düzgün şekilde işlemek için
        plugins: [NodeModulesPolyfillPlugin()],
      },
    },
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
    },
  };
});
