import { useEffect, useRef } from 'react'
import Viewer from 'viewerjs'

type Props = {
  src?: string
  alt?: string
  className?: string
}

/**
 * Renders an <img> that, when clicked, opens a Viewer.js preview.
 */
export default function ImagePreview({ src, alt, className }: Props) {
  const imgRef = useRef<HTMLImageElement | null>(null)
  const viewerRef = useRef<Viewer | null>(null)

  useEffect(() => {
    if (!imgRef.current) return

    // Init viewer on the <img> itself
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
  }, [])

  const handleClick = () => {
    if (!src) return
    viewerRef.current?.show()
  }

  return <img ref={imgRef} src={src} alt={alt} onClick={handleClick} className={className ?? 'cursor-zoom-in'} style={{ cursor: src ? 'zoom-in' : 'default' }} />
}
