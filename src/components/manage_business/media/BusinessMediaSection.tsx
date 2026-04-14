'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getBusinessCoverUrl, getBusinessGallery, getBusinessLogoUrl, uploadImageToCloudinary } from '@/lib/media'
import { getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BusinessMedia,
  BusinessMediaListResponse,
  BusinessMediaMutationResponse,
  BusinessMediaReorderResponse,
  BusinessMediaType,
  UploadSignatureResponse,
} from '@/types/media'

type BusinessMediaSectionProps = {
  businessId: string | null
  businessName: string
}

const previewCardClasses =
  'overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm'

export default function BusinessMediaSection({
  businessId,
  businessName,
}: BusinessMediaSectionProps) {
  const [media, setMedia] = useState<BusinessMedia[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [isUploadingGallery, setIsUploadingGallery] = useState(false)
  const [reorderingMediaId, setReorderingMediaId] = useState<string | null>(null)
  const [deletingMediaId, setDeletingMediaId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const coverInputRef = useRef<HTMLInputElement | null>(null)
  const galleryInputRef = useRef<HTMLInputElement | null>(null)

  const logoMedia = useMemo(() => getBusinessLogoUrl(media), [media])
  const coverMedia = useMemo(() => getBusinessCoverUrl(media), [media])
  const galleryMedia = useMemo(() => getBusinessGallery(media), [media])

  useEffect(() => {
    if (!businessId) {
      setMedia([])
      return
    }

    let ignore = false

    async function loadMedia() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await fetch(`/api/businesses/${businessId}/media`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as BusinessMediaListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setMedia([])
          setErrorMessage(getApiErrorMessage(payload, 'We could not load business media right now.'))
          return
        }

        setMedia((payload as BusinessMediaListResponse).media)
      } catch {
        if (!ignore) {
          setMedia([])
          setErrorMessage('We could not load business media right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadMedia()

    return () => {
      ignore = true
    }
  }, [businessId])

  const applyMediaMutation = (nextMedia: BusinessMedia) => {
    setMedia((currentMedia) => {
      const withoutCurrentItem = currentMedia.filter((item) => item.id !== nextMedia.id)

      if (nextMedia.mediaType === 'GALLERY') {
        return [...withoutCurrentItem, nextMedia].sort(
          (leftValue, rightValue) =>
            leftValue.sortOrder - rightValue.sortOrder ||
            leftValue.createdAt.localeCompare(rightValue.createdAt)
        )
      }

      return [
        nextMedia,
        ...withoutCurrentItem.filter((item) => item.mediaType !== nextMedia.mediaType),
      ].sort((leftValue, rightValue) => {
        const leftRank = leftValue.mediaType === 'LOGO' ? 0 : leftValue.mediaType === 'COVER' ? 1 : 2
        const rightRank =
          rightValue.mediaType === 'LOGO' ? 0 : rightValue.mediaType === 'COVER' ? 1 : 2
        return (
          leftRank - rightRank ||
          leftValue.sortOrder - rightValue.sortOrder ||
          leftValue.createdAt.localeCompare(rightValue.createdAt)
        )
      })
    })
  }

  async function requestUploadSignature(mediaType: BusinessMediaType) {
    if (!businessId) throw new Error('No business selected.')

    const response = await fetch(`/api/businesses/${businessId}/media/sign-upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media_type: mediaType,
      }),
    })

    const payload = (await response.json()) as UploadSignatureResponse | ApiErrorResponse
    if (!response.ok) {
      throw new Error(getApiErrorMessage(payload, 'We could not prepare this upload right now.'))
    }

    return payload as UploadSignatureResponse
  }

  async function persistMedia(mediaType: BusinessMediaType, url: string, publicId: string) {
    if (!businessId) throw new Error('No business selected.')

    const response = await fetch(`/api/businesses/${businessId}/media`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        media_type: mediaType,
        url,
        public_id: publicId,
      }),
    })

    const payload = (await response.json()) as BusinessMediaMutationResponse | ApiErrorResponse
    if (!response.ok) {
      throw new Error(getApiErrorMessage(payload, 'We could not save this media item right now.'))
    }

    return (payload as BusinessMediaMutationResponse).media
  }

  async function handleMediaUpload(mediaType: BusinessMediaType, files: FileList | null) {
    if (!files?.length) return

    setErrorMessage(null)
    setSuccessMessage(null)

    if (mediaType === 'LOGO') setIsUploadingLogo(true)
    if (mediaType === 'COVER') setIsUploadingCover(true)
    if (mediaType === 'GALLERY') setIsUploadingGallery(true)

    try {
      const uploadTargets =
        mediaType === 'GALLERY' ? Array.from(files) : [Array.from(files)[0]].filter(Boolean)

      for (const file of uploadTargets) {
        const signature = await requestUploadSignature(mediaType)
        const uploadedAsset = await uploadImageToCloudinary(file, signature)
        const savedMedia = await persistMedia(mediaType, uploadedAsset.url, uploadedAsset.publicId)
        applyMediaMutation(savedMedia)
      }

      setSuccessMessage(
        mediaType === 'GALLERY'
          ? 'Gallery updated successfully.'
          : `${mediaType === 'LOGO' ? 'Logo' : 'Cover'} updated successfully.`
      )
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'We could not upload this media right now.'
      )
    } finally {
      if (mediaType === 'LOGO') {
        setIsUploadingLogo(false)
        if (logoInputRef.current) logoInputRef.current.value = ''
      }
      if (mediaType === 'COVER') {
        setIsUploadingCover(false)
        if (coverInputRef.current) coverInputRef.current.value = ''
      }
      if (mediaType === 'GALLERY') {
        setIsUploadingGallery(false)
        if (galleryInputRef.current) galleryInputRef.current.value = ''
      }
    }
  }

  async function handleDelete(mediaItem: BusinessMedia) {
    if (!businessId) return

    setDeletingMediaId(mediaItem.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/businesses/${businessId}/media/${mediaItem.id}`, {
        method: 'DELETE',
      })

      const payload = (await response.json()) as BusinessMediaMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not remove this media item right now.'))
        return
      }

      setMedia((currentMedia) => currentMedia.filter((item) => item.id !== mediaItem.id))
      setSuccessMessage('Media removed successfully.')
    } catch {
      setErrorMessage('We could not remove this media item right now.')
    } finally {
      setDeletingMediaId(null)
    }
  }

  async function handleMoveGallery(mediaItemId: string, offset: -1 | 1) {
    if (!businessId) return

    const currentGallery = getBusinessGallery(media)
    const currentIndex = currentGallery.findIndex((item) => item.id === mediaItemId)
    const nextIndex = currentIndex + offset

    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= currentGallery.length) {
      return
    }

    const reorderedGallery = [...currentGallery]
    const [movedItem] = reorderedGallery.splice(currentIndex, 1)
    reorderedGallery.splice(nextIndex, 0, movedItem)

    setReorderingMediaId(mediaItemId)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/businesses/${businessId}/media/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          media_ids: reorderedGallery.map((item) => item.id),
        }),
      })

      const payload = (await response.json()) as BusinessMediaReorderResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not reorder gallery media right now.'))
        return
      }

      setMedia((payload as BusinessMediaReorderResponse).media)
      setSuccessMessage('Gallery order updated successfully.')
    } catch {
      setErrorMessage('We could not reorder gallery media right now.')
    } finally {
      setReorderingMediaId(null)
    }
  }

  const renderEmptyPreview = (label: string) => (
    <div className="flex h-44 items-center justify-center bg-slate-100 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
      {label}
    </div>
  )

  const handleFileInputChange =
    (mediaType: BusinessMediaType) => (event: ChangeEvent<HTMLInputElement>) =>
      void handleMediaUpload(mediaType, event.target.files)

  return (
    <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-5 md:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            Business media
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
            Logo, cover, and gallery
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            These assets brand the discovery grid, the business profile, and customer booking surfaces.
            Upload a crisp logo, a strong cover image, and supporting gallery shots for {businessName}.
          </p>
        </div>
        {isLoading ? <span className="text-xs font-semibold text-slate-400">Loading...</span> : null}
      </div>

      {errorMessage ? (
        <Alert variant="destructive" className="mt-5 rounded-2xl">
          <AlertTitle>Media issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert className="mt-5 rounded-2xl">
          <AlertTitle>Media updated</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div className="grid gap-3">
          <div className={previewCardClasses}>
            {logoMedia ? (
              <div className="relative h-44">
                <Image src={logoMedia} alt={`${businessName} logo`} fill className="object-contain p-6" />
              </div>
            ) : (
              renderEmptyPreview('No logo uploaded')
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange('LOGO')}
            />
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={!businessId || isUploadingLogo}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploadingLogo ? 'Uploading logo...' : logoMedia ? 'Replace logo' : 'Upload logo'}
            </button>
            {logoMedia ? (
              <button
                type="button"
                onClick={() => {
                  const item = media.find((entry) => entry.mediaType === 'LOGO')
                  if (item) void handleDelete(item)
                }}
                disabled={deletingMediaId === media.find((entry) => entry.mediaType === 'LOGO')?.id}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Remove logo
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-3">
          <div className={previewCardClasses}>
            {coverMedia ? (
              <div className="relative h-44">
                <Image src={coverMedia} alt={`${businessName} cover`} fill className="object-cover" />
              </div>
            ) : (
              renderEmptyPreview('No cover uploaded')
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileInputChange('COVER')}
            />
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              disabled={!businessId || isUploadingCover}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploadingCover ? 'Uploading cover...' : coverMedia ? 'Replace cover' : 'Upload cover'}
            </button>
            {coverMedia ? (
              <button
                type="button"
                onClick={() => {
                  const item = media.find((entry) => entry.mediaType === 'COVER')
                  if (item) void handleDelete(item)
                }}
                disabled={deletingMediaId === media.find((entry) => entry.mediaType === 'COVER')?.id}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                Remove cover
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Gallery
            </p>
            <p className="mt-2 text-sm leading-relaxed text-slate-500">
              Add extra imagery to give customers a better sense of the business atmosphere and quality.
            </p>
          </div>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileInputChange('GALLERY')}
          />
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={!businessId || isUploadingGallery}
            className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploadingGallery ? 'Uploading gallery...' : 'Add gallery images'}
          </button>
        </div>

        {galleryMedia.length ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {galleryMedia.map((item, index) => (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                <div className="relative h-40">
                  <Image
                    src={item.url}
                    alt={`${businessName} gallery image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-wrap gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => void handleMoveGallery(item.id, -1)}
                    disabled={index === 0 || reorderingMediaId === item.id}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-3 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Move earlier
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleMoveGallery(item.id, 1)}
                    disabled={index === galleryMedia.length - 1 || reorderingMediaId === item.id}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-3 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Move later
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(item)}
                    disabled={deletingMediaId === item.id}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-red-200 px-3 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
            No gallery images uploaded yet.
          </div>
        )}
      </div>
    </section>
  )
}
