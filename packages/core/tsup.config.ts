import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  // ブラウザ + Node SSR 双方で動作するよう target を broad に
  target: 'es2020',
  // fast-xml-parser は bundle in（ブラウザで動かすため）
  noExternal: ['fast-xml-parser'],
});
