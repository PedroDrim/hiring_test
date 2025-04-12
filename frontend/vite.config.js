import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import configs from 'react-x-twitter';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.mp3'], // Allow Vite to handle .mp3 files as static assets
  server: {
    hmr: {
      overlay: false, // Disable the error overlay in development
    },
  },
});
