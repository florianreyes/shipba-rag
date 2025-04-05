import Image from 'next/image'

type MeshIconProps = {
  variant?: 'white' | 'black'
  width?: number
  height?: number
  className?: string
}

export function MeshIcon({ 
  variant = 'white', 
  width = 100, 
  height = 100,
  className = ''
}: MeshIconProps) {
  return (
    <Image 
      src={`/mesh-icon-${variant}.png`}
      alt="Mesh Icon" 
      width={width} 
      height={height}
      className={className}
    />
  )
} 