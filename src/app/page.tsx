import { redirect } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 86400

export default function RootPage() {
  // 固定で日本語トップへ。自動判定は行わない
  redirect('/ja')
}

