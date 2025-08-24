FROM node:20-alpine

# pnpmをインストール
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

# 作業ディレクトリを設定
WORKDIR /app

# 依存関係ファイルをコピー
COPY package.json pnpm-lock.yaml ./

# 依存関係をインストール
RUN pnpm install --force

# ソースコードをコピー
COPY . .

# 本番用ビルド
RUN pnpm build

# 本番用の軽量イメージ
FROM node:20-alpine AS runner

# pnpmをインストール
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate

WORKDIR /app

# 非rootユーザーを作成
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 必要なファイルをコピー
COPY --from=0 /app/public ./public
COPY --from=0 --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=0 --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]