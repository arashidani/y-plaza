import Image from 'next/image'

interface FlagProps {
  countryCode: string
  className?: string
  style?: React.CSSProperties
  alt?: string
  role?: string
}

const flagMap: Record<string, string> = {
  JP: '/flags/jp.svg',
  US: '/flags/us.svg', 
  BR: '/flags/br.svg',
}

const countryNames: Record<string, string> = {
  JP: 'Japan',
  US: 'United States',
  BR: 'Brazil',
}

export function Flag({ countryCode, className, style, alt, role }: FlagProps) {
  const flagSrc = flagMap[countryCode.toUpperCase()]
  const countryName = countryNames[countryCode.toUpperCase()]
  
  if (!flagSrc) {
    return null
  }

  return (
    <Image
      src={flagSrc}
      alt={alt || (alt === '' ? '' : `${countryName} flag`)}
      width={16}
      height={12}
      className={className}
      style={style}
      // デフォルト言語のみプリオリティ上げる
      priority={countryCode === 'JP'}
      loading={countryCode === 'JP' ? 'eager' : 'lazy'}
      sizes="16px"
      {...(alt === '' || role === 'presentation' ? { role: 'presentation', 'aria-hidden': true } : { role: role || 'img' })}
    />
  )
}