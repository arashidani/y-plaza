import { redirect } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 86400

export default function RootPage() {
  // 常に既定言語のプレフィックスへ
  redirect('/ja')
}
