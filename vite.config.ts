import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

function resolveGoogleMapsApiKey(env: Record<string, string>): string {
  return (
    env.VITE_GOOGLE_MAPS_API_KEY ||
    env.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
    env.GOOGLE_MAPS_PLATFORM_KEY ||
    env.GOOGLE_API_KEY ||
    ''
  );
}

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');
  const googleMapsApiKey = resolveGoogleMapsApiKey(env);

  return {
    plugins: [react(), tailwindcss()],
    envPrefix: ['VITE_', 'GOOGLE_'],
    define: {
      'process.env.GOOGLE_MAPS_PLATFORM_KEY': JSON.stringify(googleMapsApiKey),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
