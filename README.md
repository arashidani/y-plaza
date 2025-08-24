## はじめに

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

## 使用技術

- **Next.js 15** - React フレームワーク (App Router)
- **TypeScript** - 型安全性
- **Tailwind CSS 4** - スタイリング
- **shadcn/ui** - UIコンポーネント
- **Prettier** - コードフォーマッター
- **ESLint** - コード品質
- **Docker** - 開発環境の統一
- **pnpm** - パッケージマネージャー

## デプロイ
