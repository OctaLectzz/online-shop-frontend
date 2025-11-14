'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { getCroppedImg } from '@/utils/image-crop'
import { Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { Area } from 'react-easy-crop'
import Cropper from 'react-easy-crop'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import ImagePreview from './image-preview'

interface MultiImageUploadProps {
  value: File[]
  onChange: (files: File[]) => void
  existingImages?: string[]
  onExistingChange?: (images: string[]) => void
  className?: string
}

export function MultiImageUpload({ value, onChange, existingImages, onExistingChange, className }: MultiImageUploadProps) {
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [queue, setQueue] = useState<File[]>([])

  const [localExistingImages, setLocalExistingImages] = useState<string[]>(existingImages ?? [])

  useEffect(() => {
    setLocalExistingImages(existingImages ?? [])
  }, [existingImages])

  const maxSizeBytes = useMemo(() => (import.meta.env.VITE_MAX_FILE_KB ? Number(import.meta.env.VITE_MAX_FILE_KB) * 1024 : 2 * 1024 * 1024), [])

  useEffect(() => {
    if (!imageSrc && queue.length > 0) {
      const file = queue[0]
      const reader = new FileReader()
      reader.onload = () => {
        setImageSrc(reader.result as string)
        setOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }, [queue, imageSrc])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!acceptedFiles.length) return
    setQueue((prev) => [...prev, ...acceptedFiles])
  }, [])

  const onDropRejected = useCallback(() => {
    toast.error(t('public.image.validateImageMaxSize'))
  }, [t])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 10,
    maxSize: maxSizeBytes
  })

  const onCropComplete = useCallback((_: Area, cropped: Area) => {
    setCroppedAreaPixels(cropped)
  }, [])

  const processNextInQueue = useCallback(() => {
    setQueue((prev) => prev.slice(1))
    setImageSrc(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
  }, [])

  const handleCrop = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels || queue.length === 0) return

    const currentFile = queue[0]

    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels)

      const file =
        croppedImage instanceof File
          ? croppedImage
          : new File([croppedImage], currentFile.name || 'image.jpg', {
              type: currentFile.type || 'image/jpeg'
            })

      if (file.size > maxSizeBytes) {
        toast.error(t('public.image.validateImageCroppedMaxSize'))
        processNextInQueue()
        return
      }

      onChange([...value, file])

      processNextInQueue()
    } catch (err) {
      console.error('Error cropping image', err)
      toast.error(t('public.image.cropErrorText'))
      processNextInQueue()
    }
  }, [imageSrc, croppedAreaPixels, queue, value, onChange, maxSizeBytes, t, processNextInQueue])

  const handleCloseDialog = () => {
    setOpen(false)
    setQueue([])
    setImageSrc(null)
    setZoom(1)
    setCrop({ x: 0, y: 0 })
  }

  const handleRemoveNewFile = (index: number) => {
    const newFiles = [...value]
    newFiles.splice(index, 1)
    onChange(newFiles)
  }

  const handleRemoveExisting = (index: number) => {
    const updated = [...localExistingImages]
    updated.splice(index, 1)
    setLocalExistingImages(updated)
    onExistingChange?.(updated)
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* Dropzone */}
      <div {...getRootProps()} className={cn('border-border bg-muted/40 text-muted-foreground flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed px-4 text-center text-sm transition-colors', 'hover:border-primary hover:bg-muted', isDragActive && 'border-primary bg-muted')}>
        <input {...getInputProps()} />
        <p className="font-medium">{t('public.image.dragAndDropMultiple')}</p>
        <p className="text-xs">
          {t('public.orText')} <span className="text-primary font-semibold">{t('public.image.clickToUploadText')}</span>
        </p>
        <p className="mt-1 text-[11px] opacity-70">
          {t('public.image.supportedFormats')}: JPG, PNG, WEBP • {t('public.image.maxSizeText', { size: import.meta.env.VITE_MAX_FILE_KB })}
        </p>
      </div>

      {/* Existing images (from server) */}
      {localExistingImages.length > 0 && (
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">{t('dashboard.product.existingImages')}</p>
          <div className="flex flex-wrap gap-2">
            {localExistingImages.map((img, i) => (
              <div key={i} className="relative">
                <ImagePreview src={img} alt={`existing-${i}`} className="h-24 w-24 rounded border object-cover" />
                <button type="button" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-0.5 shadow" onClick={() => handleRemoveExisting(i)} aria-label={t('public.image.removeImageText')}>
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New images (Files from form) */}
      {value.length > 0 && (
        <div className="space-y-1">
          <p className="text-muted-foreground text-xs font-medium">{t('dashboard.product.newImages')}</p>
          <div className="flex flex-wrap gap-2">
            {value.map((file, index) => {
              const url = URL.createObjectURL(file)
              return (
                <div key={index} className="relative">
                  <ImagePreview src={url} alt={`new-${index}`} className="h-24 w-24 rounded border object-cover" />
                  <button type="button" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 absolute -top-2 -right-2 rounded-full p-0.5 shadow" onClick={() => handleRemoveNewFile(index)} aria-label={t('public.image.removeImageText')}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Crop dialog */}
      <Dialog open={open && !!imageSrc} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('public.image.imageText')}</DialogTitle>
            <DialogDescription>{t('public.image.cropDesc')}</DialogDescription>
          </DialogHeader>

          <div className="bg-background relative h-64 w-full">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="rect"
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                showGrid={false}
                classes={{
                  containerClassName: 'bg-background',
                  cropAreaClassName: 'border-2 border-primary'
                }}
              />
            )}
          </div>

          <div className="space-y-2 p-4">
            <label className="block text-sm font-medium">Zoom: {zoom.toFixed(1)}</label>
            <input type="range" min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="accent-primary h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={handleCloseDialog}>
              {t('public.cancelText')}
            </Button>
            <Button type="button" onClick={handleCrop}>
              {queue.length > 1 ? t('public.image.saveAndNextText') : t('public.saveText')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
