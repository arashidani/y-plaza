import Image from 'next/image'

interface FlagProps {
  countryCode: string
  className?: string
  style?: React.CSSProperties
}

const flagMap: Record<string, string> = {
  JP: '/flags/jp.svg',
  US: '/flags/us.svg', 
  BR: '/flags/br.svg',
}

export function Flag({ countryCode, className, style }: FlagProps) {
  const flagSrc = flagMap[countryCode.toUpperCase()]
  
  if (!flagSrc) {
    return null
  }

  return (
    <Image
      src={flagSrc}
      alt={`${countryCode} flag`}
      width={16}
      height={12}
      className={className}
      style={style}
      priority
    />
  )
}