import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import solidSvg from "vite-plugin-solid-svg";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [solid(), solidSvg()],
  resolve: {
    alias: [{ find: '@', replacement: path.resolve(__dirname, './src') }],
  },
})
