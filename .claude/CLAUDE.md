# Coding Guidelines

## コメントスタイル

### TODOコメントの配置
TODOコメントは対象行の上の行に記述すること。

**❌ 悪い例:**
```typescript
name: '', // TODO: アプリケーション名を設定
description: '', // TODO: アプリケーション説明を設定
```

**✅ 良い例:**
```typescript
// TODO: アプリケーション名を設定
name: '',
// TODO: アプリケーション説明を設定
description: '',
```

### 将来実装予定のコメントについて
「将来的に...」のような曖昧な表現は避け、具体的なTODOコメントに置き換えること。

**❌ 悪い例:**
```typescript
// 将来的にnext-intlなどのライブラリで置き換え予定
export function getCurrentLocale() {
  return defaultLocale;
}

// 将来的にはここでi18nライブラリのrouter.push等を呼ぶ
setLocale(value);
```

**✅ 良い例:**
```typescript
// TODO: next-intlライブラリを導入して国際化対応
export function getCurrentLocale() {
  return defaultLocale;
}

// TODO: i18nルーター実装時にrouter.push()を追加
setLocale(value);
```

### 理由
- コードの可読性向上
- 複数行にわたるTODOコメントに対応
- 一貫したコメントスタイルの維持
- 具体的なアクションアイテムとして追跡可能
- 曖昧さを排除し、実装優先度を明確化