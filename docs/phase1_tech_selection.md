# Phase 1：技術選定フェーズ

> プロジェクト：**site-map**
> 作成日：2026-06-08
> ステータス：🟡 進行中（ユーザー合意待ち）

---

## 前提（Phase 0 からの引き継ぎ）

- **採用案**：案C（ハイブリッド型）
- **配布形態**：npm パッケージ（vanilla core + React/Vue adapter）
- **段階的リリース**：v0.1 = クライアント完結 MVP / v0.2 = Worker+IndexedDB / v1.0 = ホスト型 API
- **非機能要件**：複数サイトへの汎用配布、拡張性最優先、フレームワーク非依存、クラウド移行前提、Docker による開発環境構築

---

## 1-1. 技術スタックの全列挙

### A. 言語・型システム
- TypeScript（5.x）
- JavaScript（ESM）
- Rust → WebAssembly（コア部分のみ）

### B. パッケージマネージャ
- npm
- pnpm
- yarn (berry)
- bun

### C. モノレポ管理（core + adapter を1リポジトリで配布）
- pnpm workspace + Turborepo
- pnpm workspace + Nx
- pnpm workspace のみ（薄い構成）
- Lerna（メンテ縮小傾向）
- Rush

### D. バンドラ・ビルドツール（ライブラリ用）
- tsup（esbuild ベース、ライブラリ向け定番）
- Vite（library mode）
- Rollup
- esbuild（直接）
- unbuild
- Parcel

### E. UI ライブラリ adapter
- React adapter（React 18+）
- Vue adapter（Vue 3+）
- Svelte adapter（将来）
- SolidJS adapter（将来）
- Preact adapter（将来 / 軽量化用）
- Vanilla JS adapter（フレームワーク無し環境向け）

### F. ツリー UI コンポーネント
- 自前実装（再帰コンポーネント + ARIA tree role）
- react-arborist
- react-complex-tree
- @minoru/react-dnd-treeview
- rc-tree
- D3.js（dendrogram / collapsible tree）

### G. スタイリング戦略（**ホストサイトの CSS と干渉しないことが必須**）
- **Shadow DOM** + 内包 CSS（最強の隔離）
- CSS Modules（クラス名衝突回避のみ）
- Tailwind CSS（プレフィックス運用 + Shadow DOM 内）
- vanilla-extract（型安全 CSS-in-JS）
- Emotion / styled-components（ランタイム CSS-in-JS）
- 素の CSS（BEM 命名）

### H. sitemap.xml パーサ
- fast-xml-parser
- @rgrove/parse-xml
- sax-js（ストリーミング）
- xmldom + 自前正規表現
- 自前正規表現（軽量だが脆弱）

### I. HTTP クライアント（fetch ラッパー）
- ブラウザネイティブ `fetch`
- ky（軽量）
- axios（重め、Node でも動く）
- ofetch（unjs）

### J. DOM クロール戦略
- 同一オリジン `fetch` → `DOMParser` で内部リンク抽出
- Service Worker 経由でクロール
- iframe 経由でクロール（CORS の関係で非推奨）

### K. Web Worker 抽象化
- 生の Web Worker API
- Comlink（Worker の関数を main から呼び出すラッパー）
- partytown（3rd-party スクリプトを Worker に逃がす用途、今回は不一致）
- workerize（古いがシンプル）

### L. キャッシュ層（IndexedDB）
- idb（最小ラッパー）
- idb-keyval（key-value 専用）
- Dexie（高機能 ORM ライク）
- localForage（旧来の polyfill）
- 生の IndexedDB

### M. ホスト型 API（v1.0、オプション）
- Cloudflare Workers + KV / D1
- Vercel Edge Functions + KV
- AWS Lambda + DynamoDB
- Supabase Edge Functions
- Deno Deploy + KV

### N. テスト
- **unit**：Vitest / Jest / node:test
- **コンポーネント**：Vitest + Testing Library / Storybook test
- **E2E（ブラウザ実機）**：Playwright / Cypress / Puppeteer
- **ビジュアルリグレッション**：Chromatic / Playwright visual / Percy

### O. ドキュメント / プレイグラウンド
- Storybook（コンポーネント + docs アドオン）
- Ladle（軽量 Storybook 代替）
- Histoire（Vue ファースト）
- VitePress（マニュアル / API リファレンス）
- Astro Starlight（同上）

### P. リリース管理
- changesets（モノレポと相性◎）
- semantic-release
- release-please
- 手動 `npm publish`

### Q. CI/CD
- GitHub Actions
- GitLab CI
- CircleCI

### R. 開発環境（Docker 前提）
- **ベース**：node:22-bookworm-slim（or node:lts-alpine）
- **HTTPS ローカル**：mkcert + Caddy（sitemap.xml クロールで TLS テスト）
- **テストサイト**：nginx で固定 HTML を提供 + sitemap.xml モック
- **docker-compose**：Node 開発コンテナ + テスト用 nginx コンテナの 2 サービス構成

### S. ロギング / 計測（v0.2 以降）
- ブラウザ console（dev mode）
- Sentry（任意・運営者側オプション）
- 独自イベントバス（オプトイン）

---

## 1-2. 類似ツール比較 → 各カテゴリ3候補に絞る

各カテゴリで **「拡張性 / 開発コスト / クラウド互換性」** の3軸で評価。

### A. 言語 ── ✅ TypeScript で確定

| 候補 | 拡張性 | 開発コスト | クラウド互換性 | 採用判断 |
|------|:---:|:---:|:---:|---|
| **TypeScript** | ◎ | ◯ | ◎ | ✅ **採用**：型安全・エコシステム最大 |
| JavaScript (ESM) | ◯ | ◎ | ◎ | ❌ 大規模で型不在は致命的 |
| Rust → WASM | ◎ | ✕ | ◯ | ❌ オーバースペック、コアの軽量さに不一致 |

### B. パッケージマネージャ ── 3候補

| 候補 | メリット | デメリット |
|------|---------|----------|
| **pnpm**（推奨） | ディスク効率◎ / workspace 標準 / Cloudflare 等で標準化 | 一部の CI 環境で追加設定必要 |
| npm | デファクト / 設定ゼロ | workspace のシンボリックリンク扱いが弱い |
| bun | 高速 / Native | エコシステム成熟度が低い、エッジで使えない場面あり |

**→ 推奨：pnpm**（モノレポ + Cloudflare との相性、Mywork プロジェクト全体での統一）

### C. モノレポ管理 ── 3候補

| 候補 | 特徴 |
|------|------|
| **pnpm workspace + Turborepo**（推奨） | 軽量・タスクキャッシュ・GH Actions と相性◎ |
| pnpm workspace のみ | 最小構成、規模が小さければ十分 |
| pnpm workspace + Nx | 高機能だがオーバースペック気味 |

**→ 推奨：pnpm workspace + Turborepo**

### D. バンドラ ── 3候補

| 候補 | 特徴 |
|------|------|
| **tsup**（推奨） | esbuild ベース、ライブラリ向け定番、設定最小 |
| Vite (library mode) | dev server も同居できる、Playground との統合性◎ |
| unbuild | Nuxt エコシステム発、`build.config.ts` でモジュール構成宣言可 |

**→ 推奨：tsup**（library 向けに枯れている。Storybook/Vite は別途）

### E. UI adapter ── 初期は React のみ、拡張余地は残す

| 候補 | 採用タイミング |
|------|--------------|
| **React adapter** | ✅ v0.1 から（最大ユーザー基盤） |
| **Vue adapter** | ✅ v0.2 で追加 |
| Vanilla JS adapter | ✅ v0.1 から（core そのものを export） |
| Svelte / Solid | v1.x 以降の拡張 |

→ **vanilla core を最重要視**。React/Vue adapter はそれを薄く包む。

### F. ツリー UI ── 3候補

| 候補 | 特徴 |
|------|------|
| **自前実装**（推奨） | Shadow DOM 内で完全制御、依存を増やさない、ARIA tree role に準拠 |
| react-arborist | 仮想スクロール対応、巨大ツリー向け |
| react-complex-tree | DnD・編集機能あり（今回は不要） |

**→ 推奨：自前実装**（依存最小化＋ Shadow DOM 内完全制御）
※ v1.x で 1万ノード超え対応する場合 react-arborist の仮想スクロールパターンを取り込む

### G. スタイリング ── ✅ Shadow DOM + 内包 CSS で確定

| 候補 | 採用判断 |
|------|---------|
| **Shadow DOM + 内包 CSS / CSS-in-JS** | ✅ **採用**：ホストサイトの CSS と完全隔離。プラグインに必須 |
| Tailwind（プレフィックス） | ❌ ホスト側の Tailwind と衝突しうる |
| Emotion / styled-components | ❌ Shadow DOM 内では shadow root への style 注入が要工夫 |

**Shadow DOM 内の具体ツール**：
- vanilla-extract（型安全・ビルド時 CSS） ★推奨
- CSS Modules（既存メタファ流用）
- 生 CSS

**→ 推奨：Shadow DOM + vanilla-extract**

### H. sitemap.xml パーサ ── 3候補

| 候補 | 特徴 |
|------|------|
| **fast-xml-parser**（推奨） | サイズ小・ブラウザで動く・速い |
| @rgrove/parse-xml | XML 仕様厳密、エラー詳細 |
| sax-js | ストリーミング（巨大 sitemap 用） |

**→ 推奨：fast-xml-parser**（10MB 程度の sitemap_index なら十分）

### I. HTTP クライアント ── ✅ ネイティブ fetch で確定

理由：依存削減・ブラウザ環境で動作・ky / axios は不要な hop

### J. DOM クロール ── ✅ `fetch + DOMParser` で確定

理由：標準 API のみ、Worker 内でも動く

### K. Worker 抽象化 ── 3候補

| 候補 | 特徴 |
|------|------|
| **Comlink**（推奨） | Worker 内関数を main から `await` で呼べる、デファクト |
| 生 Web Worker | 依存ゼロだが postMessage の温度感を生で書く必要 |
| workerize / threads.js | やや古い |

**→ 推奨：Comlink**（v0.2 以降）

### L. キャッシュ層 ── 3候補

| 候補 | 特徴 |
|------|------|
| **idb**（推奨） | Promise ラップだけの最小実装、サイズ極小 |
| idb-keyval | key-value 専用、シンプルだが構造化クエリ不可 |
| Dexie | 高機能、けど今回は ORM 不要 |

**→ 推奨：idb**（v0.2 以降）

### M. ホスト型 API（v1.0）── 3候補

| 候補 | 特徴 |
|------|------|
| **Cloudflare Workers + KV / D1**（推奨） | エッジ実行、Mywork プロジェクト全体で統一、無料枠厚い |
| Vercel Edge + KV | Next.js プロジェクトとの統合は良いが、本プロジェクトとは独立 |
| Deno Deploy + KV | 軽量、Node 互換、エコシステムは Cloudflare ほど厚くない |

**→ 推奨：Cloudflare Workers + KV**（v1.0 で実装）
※ クラウド互換性は CLAUDE.md の方針に従い Cloudflare 一本化

### N. テスト ── 3層構成で確定

| 層 | ツール |
|------|------|
| **unit / integration** | Vitest（Vite ベース、JSDOM/happy-dom 切替） |
| **component / interaction** | Vitest + Testing Library（React/Vue） |
| **E2E（実ブラウザ）** | Playwright（クロスブラウザ） |

### O. ドキュメント・プレイグラウンド ── 3候補

| 候補 | 特徴 |
|------|------|
| **Storybook**（推奨） | コンポーネント開発のデファクト、Playwright integration あり |
| Ladle | 軽量、起動速い、Storybook と互換 |
| Histoire | Vue 中心 |

**→ 推奨：Storybook**（Playwright と組み合わせ visual regression も可）

### P. リリース管理 ── ✅ changesets で確定

理由：モノレポ + 複数パッケージ（core / react / vue）を独立バージョニングできる唯一の現実解

### Q. CI/CD ── ✅ GitHub Actions で確定

理由：GitHub と統合、無料枠厚い、Mywork プロジェクト全体で統一

### R. 開発環境 Docker ── ✅ 確定

```
docker-compose.yml
├─ dev      : node:22-bookworm-slim + pnpm + Storybook (port 6006) + Vitest UI (port 51204)
└─ testsite : nginx:alpine + 固定 HTML + sitemap.xml モック (port 8080)
```

---

## 1-3. クラウド互換性マップ

ローカル開発 / セルフホスト → クラウド配布 / ホスティングの移行パスを明示。
v0.x は npm 配布のみで完結し、v1.0 でホスト型 API を Cloudflare 上に展開する。

| 役割 | ローカル / 開発 | クラウド移行先 | 互換性 |
|------|----------------|---------------|:------:|
| パッケージ配布 | ローカルビルド（tsup） | **npm registry** | ◎（CI から `pnpm publish`） |
| バージョン管理 | git / changesets | **GitHub** + **changesets-action** | ◎ |
| CI/CD | ローカル `pnpm test` | **GitHub Actions**（matrix: Node 20/22） | ◎ |
| Playground / docs | Storybook（dev） | **GitHub Pages**（Storybook static export） | ◎ |
| sitemap.xml モック | nginx コンテナ（Docker） | **Cloudflare Pages**（テストフィクスチャ用静的サイト） | ◎ |
| ホスト型 API（v1.0） | wrangler dev | **Cloudflare Workers + KV / D1** | ◎ |
| クロール結果キャッシュ（v1.0） | IndexedDB（ブラウザ） | **Cloudflare KV / D1**（サーバー側プリビルド） | ◎ |
| 認証（v1.0 ダッシュボード） | なし | **Cloudflare Access** or **Auth.js + KV** | ◎ |
| 監視・ロギング | console | **Cloudflare Workers Logs / Sentry** | ◎ |

→ **CLAUDE.md のクラウド一本化方針に従い、サーバーサイドは Cloudflare に統一。**
→ v0.x の間は **クラウド依存ゼロ**（純粋な npm パッケージ）で完結し、運営者側に追加コストを発生させない。

---

## 推奨スタック総括

```
Phase 1 採用スタック（推奨）

【コア】
  - 言語           : TypeScript 5.x
  - パッケージ      : pnpm 9.x
  - モノレポ        : pnpm workspace + Turborepo
  - バンドラ        : tsup（library mode）

【UI】
  - adapter        : React 18+ / Vue 3+ / vanilla（core そのまま）
  - ツリー         : 自前実装（ARIA tree role 準拠）
  - スタイリング    : Shadow DOM + vanilla-extract

【クロール】
  - sitemap パーサ : fast-xml-parser
  - HTTP           : ネイティブ fetch
  - DOM 解析       : DOMParser（標準）
  - Worker         : Comlink（v0.2 以降）
  - キャッシュ      : idb / IndexedDB（v0.2 以降） + LocalStorage（v0.1）

【テスト】
  - unit / component : Vitest + Testing Library
  - E2E            : Playwright
  - docs / 開発UI   : Storybook

【配布 / CI】
  - リリース        : changesets
  - CI/CD          : GitHub Actions
  - docs ホスト    : GitHub Pages（Storybook static）

【v1.0（オプションサーバー）】
  - エッジ実行     : Cloudflare Workers
  - ストレージ     : Cloudflare KV（クロール結果キャッシュ） + D1（必要なら）

【開発環境】
  - Docker         : node:22-bookworm-slim + nginx:alpine (testsite)
  - HTTPS ローカル  : Caddy + mkcert
```

---

## ✅ Phase 1 完了確認

- [x] 1-1：技術スタック全列挙
- [x] 1-2：類似ツール比較 → 3候補に絞る
- [x] 1-3：クラウド互換性マップ作成

### 理解確認チェック
- [ ] 推奨スタックの「コア技術（TS / pnpm / Turborepo / tsup / Shadow DOM）」に同意できるか
- [ ] React adapter を v0.1 から、Vue adapter を v0.2 から、という段階リリースに違和感ないか
- [ ] v1.0 のホスト型 API を Cloudflare Workers に一本化する方針に同意できるか
- [ ] Docker（Node コンテナ + nginx テストサイトコンテナ）の開発環境構成に同意できるか

> ✅ 上記を理解したら「**承認**」と返信してください。
> 承認後、**Phase 2（アーキテクチャ設計 + Mermaid 図）** に進みます。
