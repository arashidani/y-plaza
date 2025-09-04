### ローカル開発

まず依存関係をインストールします：

```bash
pnpm install
```

開発サーバーを起動します：

```bash
pnpm dev:local
```

### Docker開発 (推奨)

Docker環境での開発を推奨します

```bash
# 開発環境を起動（ログ表示、Ctrl+Cで停止）
pnpm dev:docker

# バックグラウンドで実行（ターミナル解放、他作業可能）
pnpm dev:docker:bg

# バックグラウンド実行時に停止
pnpm dev:docker:down
```

ブラウザで[http://localhost:3000](http://localhost:3000)を開いて結果を確認してください。

### Storybookでのコンポーネント開発

UIコンポーネントの開発・確認にはStorybookを使用します：

```bash
# Storybookを起動
pnpm storybook

# Storybookをビルド
pnpm build-storybook
```

Storybookは[http://localhost:6006](http://localhost:6006)で起動します。

## 使用技術(抜粋)

[![My Skills](https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,docker,pnpm,vercel)](https://skillicons.dev)

### フレームワーク・ライブラリ

- ![Next.js](https://skillicons.dev/icons?i=nextjs&theme=light) **Next.js 15** - React フレームワーク (App Router)
- ![React](https://skillicons.dev/icons?i=react&theme=light) **React 19** - UI ライブラリ
- ![TypeScript](https://skillicons.dev/icons?i=typescript&theme=light) **TypeScript** - 型安全性

### スタイリング・UI

- ![Tailwind CSS](https://skillicons.dev/icons?i=tailwind&theme=light) **Tailwind CSS 4** - ユーティリティファーストCSS
- **shadcn/ui** - UIコンポーネント（Radix UI ベース）
- **Lucide React** - アイコンライブラリ

### 国際化・SEO

- **next-intl** - 国際化対応（日本語/英語/ポルトガル語）
- **next-sitemap** - サイトマップ生成

### 状態管理・データ処理

- **Zustand 5** - 軽量状態管理
- **Zod v4** - スキーマバリデーション

### マークダウン・コンテンツ

- ![Markdown](https://skillicons.dev/icons?i=md&theme=light) **MDX** - マークダウン + JSX
- **react-markdown** - マークダウンレンダリング
- **remark-gfm** - GitHub Flavored Markdown

### 開発・品質管理

- **Storybook 9** - コンポーネント開発・ドキュメント
- **ESLint** - コード品質
- **Prettier** - コードフォーマッター

### 分析・監視

- **Vercel Analytics** - アクセス解析
- **Vercel Speed Insights** - パフォーマンス監視

### 開発環境・ツール

- ![Docker](https://skillicons.dev/icons?i=docker&theme=light) **Docker** - 開発環境の統一
- ![pnpm](https://skillicons.dev/icons?i=pnpm&theme=light) **pnpm** - パッケージマネージャー
- **Turbopack** - 高速ビルド用

## デプロイ

このプロジェクトは![Vercel](https://skillicons.dev/icons?i=vercel&theme=light)にデプロイされています。  
`main` ブランチに push すると、自動的に本番環境が更新されます。

- デプロイ先URLや詳細はVercelの管理画面を確認すること
