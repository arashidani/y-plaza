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

Docker環境での開発を推奨します：

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

## 使用技術

- **Next.js 15** - React フレームワーク (App Router)
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **shadcn/ui** - UIコンポーネント
- **Storybook** - コンポーネント開発・ドキュメント
- **i18n対応準備** - 日本語/英語/ポルトガル語対応予定
- **Prettier** - コードフォーマッター
- **ESLint** - コード品質
- **Docker** - 開発環境の統一
- **pnpm** - パッケージマネージャー

## デプロイ

このプロジェクトは [Vercel](https://vercel.com/) にデプロイされています。  
`main` ブランチに push すると、自動的に本番環境が更新されます。

- デプロイ先URLや詳細はVercelの管理画面を確認する
