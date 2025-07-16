'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getCroppedImg } from '@/utils/image-crop'
import { X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { Area } from 'react-easy-crop'
import Cropper from 'react-easy-crop'

interface AvatarUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  currentAvatar?: string
  className?: string
}

export function AvatarUpload({ value, onChange, currentAvatar, className }: AvatarUploadProps) {
  const [open, setOpen] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  useEffect(() => {
    if (!value) {
      setImage(null)
    }
  }, [value])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string)
        setOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024 // 5MB
  })

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCrop = useCallback(async () => {
    if (image && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels)
        onChange(croppedImage)
        setOpen(false)
      } catch (e) {
        console.error('Error cropping image', e)
      }
    }
  }, [image, croppedAreaPixels, onChange])

  const handleRemove = useCallback(() => {
    onChange(null)
    setImage(null)
  }, [onChange])

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <div {...getRootProps()} className={cn('flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed', 'bg-background border-border hover:border-primary', isDragActive && 'border-primary', 'transition-colors duration-200')}>
          <input {...getInputProps()} />
          {value ? (
            <img src={URL.createObjectURL(value)} alt="Avatar preview" className="h-full w-full rounded-full object-cover" />
          ) : currentAvatar ? (
            <img src={currentAvatar} alt="Current avatar" className="h-full w-full rounded-full object-cover" />
          ) : (
            <div className={cn('text-center text-sm', 'text-muted-foreground')}>
              {isDragActive ? (
                'Drop the image here'
              ) : (
                <>
                  Drag & drop or
                  <br />
                  click to upload
                </>
              )}
            </div>
          )}
        </div>

        {(value || currentAvatar) && (
          <button type="button" onClick={handleRemove} className={cn('absolute -top-2 -right-2 rounded-full p-1 shadow-sm', 'bg-destructive text-destructive-foreground', 'hover:bg-destructive/90', 'transition-colors duration-200')} aria-label="Remove avatar">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop your avatar</DialogTitle>
          </DialogHeader>

          <div className="relative h-64 w-full">
            {image && (
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
                classes={{
                  containerClassName: 'bg-background',
                  cropAreaClassName: 'border-2 border-primary'
                }}
              />
            )}
          </div>

          <div className="space-y-2 p-4">
            <label className="text-foreground block text-sm font-medium">Zoom: {zoom.toFixed(1)}</label>
            <input type="range" min="1" max="3" step="0.1" value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className={cn('dark:accent-primary accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700')} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleCrop}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
