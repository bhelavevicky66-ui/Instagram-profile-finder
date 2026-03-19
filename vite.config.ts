import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/ig-api': {
            target: 'https://www.instagram.com',
            changeOrigin: true,
            secure: true,
            rewrite: (path) => path.replace(/^\/ig-api/, ''),
            headers: {
              'x-ig-app-id': '936619743392459',
              'user-agent': 'Mozilla/5.0',
              'accept': 'application/json, text/plain, */*',
            },
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
