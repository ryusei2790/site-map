import { defineConfig } from 'tsup';

export default defineConfig([
  // メインバンドル — CJS + ESM 両対応（import.meta を含まないパス）
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    target: 'es2020',
    // fast-xml-parser / comlink / idb はブラウザで動かすため bundle in
    noExternal: ['fast-xml-parser', 'comlink', 'idb'],
    // Worker クライアント（import.meta.url を使う）は ESM 専用エントリに分けて CJS 警告を回避
    esbuildOptions(opts) {
      opts.ignoreAnnotations = true;
    },
  },
  // Worker クライアント — ESM のみ（import.meta.url を使うため CJS 出力不可）
  {
    entry: { 'worker/client': 'src/worker/client.ts' },
    format: ['esm'],
    dts: true,
    sourcemap: true,
    target: 'es2020',
    noExternal: ['fast-xml-parser', 'comlink', 'idb'],
  },
  // Worker スレッドバンドル — ESM のみ・型定義不要
  {
    entry: { 'worker/siteMapWorker': 'src/worker/siteMapWorker.ts' },
    format: ['esm'],
    dts: false,
    sourcemap: true,
    target: 'es2020',
    noExternal: ['fast-xml-parser', 'comlink', 'idb'],
  },
]);
