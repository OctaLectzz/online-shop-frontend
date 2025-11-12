'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getCroppedImg } from '@/utils/image-crop'
import { X } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { Area } from 'react-easy-crop'
import Cropper from 'react-easy-crop'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

interface ImageUploadProps {
  value: File | null
  onChange: (file: File | null) => void
  currentImage?: string
  className?: string
}

export function ImageCircleUpload({ value, onChange, currentImage, className }: ImageUploadProps) {
  const { t } = useTranslation()
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

  const onDropRejected = useCallback(() => {
    alert(t('public.image.validateImageMaxSize'))
  }, [t])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: import.meta.env.VITE_MAX_FILE_KB * 1024
  })

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleCrop = useCallback(async () => {
    if (image && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels)

        const file = croppedImage instanceof File ? croppedImage : new File([croppedImage], 'image.jpg', { type: 'image/jpeg' })

        if (file.size > import.meta.env.VITE_MAX_FILE_KB * 1024) {
          toast.error(t('public.image.validateImageCroppedMaxSize'))
          return
        }

        onChange(croppedImage)
        setOpen(false)
      } catch (e) {
        console.error('Error cropping image', e)
      }
    }
  }, [t, image, croppedAreaPixels, onChange])

  const handleRemove = useCallback(() => {
    onChange(null)
    setImage(null)
  }, [onChange])

  return (
    <div className={cn('space-y-2', className)}>
      <div className="relative">
        <div {...getRootProps()} className={cn('my-4 flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-dashed', 'bg-background border-border hover:border-primary', isDragActive && 'border-primary', 'transition-colors duration-200')}>
          <input {...getInputProps()} />
          {value ? (
            <img src={URL.createObjectURL(value)} alt="Image preview" className="h-full w-full rounded-full object-cover" />
          ) : currentImage ? (
            <img src={currentImage} alt="Current image" className="h-full w-full rounded-full object-cover" />
          ) : (
            <div className={cn('text-center text-sm', 'text-muted-foreground')}>
              {isDragActive ? (
                t('public.image.dropText')
              ) : (
                <>
                  {t('public.image.dragAndDropText')} {t('public.orText')}
                  <br />
                  {t('public.image.clickToUploadText')}
                </>
              )}
            </div>
          )}
        </div>

        {(value || currentImage) && (
          <button type="button" onClick={handleRemove} className={cn('absolute -top-2 -right-2 rounded-full p-1 shadow-sm', 'bg-destructive text-destructive-foreground', 'hover:bg-destructive/90', 'transition-colors duration-200')} aria-label="Remove image">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('public.image.imageText')}</DialogTitle>
            <DialogDescription>{t('public.image.cropDesc')}</DialogDescription>
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
              {t('public.cancelText')}
            </Button>
            <Button type="button" onClick={handleCrop}>
              {t('public.saveText')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
