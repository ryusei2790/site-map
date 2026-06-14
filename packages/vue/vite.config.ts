import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    vue(),
    dts({ rollupTypes: true, tsconfigPath: './tsconfig.json' }),
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // vue と @site-map/core はバンドルに含めない（peerDependency として使う）
      external: ['vue', '@site-map/core'],
      output: {
        globals: {
          vue: 'Vue',
          '@site-map/core': 'SiteMapCore',
        },
      },
    },
  },
});
