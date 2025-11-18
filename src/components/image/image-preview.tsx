import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/utils/get-initials'
import { useEffect, useRef, useState } from 'react'
import Viewer from 'viewerjs'

type Props = {
  src?: string
  alt?: string
  initials?: string
  className?: string
  shape?: 'square' | 'round'
  enablePreview?: boolean
  showSkeleton?: boolean
  blurPlaceholder?: boolean
}

/**
 * Image with Viewer.js preview.
 */
export default function ImagePreview({ src, alt, initials = 'NA', className, shape = 'square', enablePreview = true, showSkeleton = true, blurPlaceholder = true }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const viewerRef = useRef<Viewer | null>(null)

  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

  const radiusClass = shape === 'round' ? 'rounded-full' : 'rounded-md'
  const sizeClass = className ?? 'h-10 w-10'

  useEffect(() => {
    setIsLoaded(false)
    setHasError(false)
  }, [src])

  useEffect(() => {
    if (!enablePreview || !src || !imgRef.current) return

    const viewer = new Viewer(imgRef.current, {
      navbar: false,
      toolbar: true,
      title: false,
      movable: true,
      zoomable: true,
      scalable: false,
      fullscreen: true,
      toggleOnDblclick: false
    })

    viewerRef.current = viewer

    return () => {
      viewer.destroy()
      viewerRef.current = null
    }
  }, [src, enablePreview])

  const handleClick = () => {
    if (!enablePreview || !src) return
    viewerRef.current?.show()
  }

  if (!src || hasError) {
    return (
      <Avatar className={`${sizeClass} ${radiusClass}`}>
        <AvatarFallback className={radiusClass}>{getInitials(initials)}</AvatarFallback>
      </Avatar>
    )
  }

  return (
    <div className={`relative inline-block ${sizeClass}`}>
      {showSkeleton && !isLoaded && <div className={`bg-muted absolute inset-0 animate-pulse ${radiusClass}`} />}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        onClick={handleClick}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`${sizeClass} ${radiusClass} ${blurPlaceholder && !isLoaded ? 'blur-sm' : 'blur-0'} cursor-zoom-in border object-cover transition-all duration-300`}
        style={{ cursor: enablePreview ? 'zoom-in' : 'default' }}
      />
    </div>
  )
}
