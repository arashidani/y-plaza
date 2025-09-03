import { cache } from 'react'
import { readFile } from 'fs/promises'
import { join } from 'path'

// ファイル読み込みをキャッシュ
export const getCachedFile = cache(async (filePath: string): Promise<string> => {
  try {
    const fullPath = join(process.cwd(), filePath)
    return await readFile(fullPath, 'utf8')
  } catch (error) {
    console.error(`Failed to read file: ${filePath}`, error)
    return ''
  }
})

// Markdown ファイル専用キャッシュ
export const getCachedMarkdown = cache(async (locale: string, type: 'privacy' | 'terms'): Promise<string> => {
  const filePath = `src/content/${type}-policy-${locale}.md`
  return getCachedFile(filePath)
})