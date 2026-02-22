import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, path.resolve(__dirname, '..'), '');
  
  // Get the absolute path to the root of your project
  const rootDir = path.resolve(__dirname, '..');
  const srcDir = path.resolve(rootDir, 'src');
  
  return {
    // Set the project root directory
    root: rootDir,
    
    // Tell Vite where your public assets are
    publicDir: path.resolve(rootDir, 'public'),
    
    plugins: [react()],
    
    css: {
      postcss: './config/postcss.config.js',
    },
    
    resolve: {
      alias: {
        '@': srcDir,
      },
    },
    
    server: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    
    build: {
      // Where to put the built files
      outDir: path.resolve(rootDir, 'dist'),
      
      // Generate source maps except in production
      sourcemap: mode !== 'production',
      
      // Where to put the assets in dist folder
      assetsDir: 'assets',
      
      // Copy all files from public to dist
      copyPublicDir: true,
      
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'maps-vendor': ['leaflet', 'mapbox-gl', 'react-leaflet'],
          },
        },
      },
    },
  };
});