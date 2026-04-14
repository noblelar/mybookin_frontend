import type { BusinessMedia, BusinessMediaType, UploadSignatureResponse } from '@/types/media'

export const getBusinessMediaByType = (
  media: BusinessMedia[],
  mediaType: BusinessMediaType
) => {
  return (
    [...media]
      .filter((item) => item.mediaType === mediaType)
      .sort((leftValue, rightValue) => leftValue.sortOrder - rightValue.sortOrder)[0] ?? null
  )
}

export const getBusinessLogoUrl = (media: BusinessMedia[]) =>
  getBusinessMediaByType(media, 'LOGO')?.url ?? null

export const getBusinessCoverUrl = (media: BusinessMedia[]) =>
  getBusinessMediaByType(media, 'COVER')?.url ?? null

export const getBusinessGallery = (media: BusinessMedia[]) =>
  [...media]
    .filter((item) => item.mediaType === 'GALLERY')
    .sort((leftValue, rightValue) => leftValue.sortOrder - rightValue.sortOrder)

type CloudinaryUploadResponse = {
  secure_url?: string
  public_id?: string
  error?: {
    message?: string
  }
}

export const uploadImageToCloudinary = async (
  file: File,
  signature: UploadSignatureResponse
) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('api_key', signature.apiKey)
  formData.append('timestamp', String(signature.timestamp))
  formData.append('signature', signature.signature)
  formData.append('folder', signature.folder)

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const payload = (await response.json()) as CloudinaryUploadResponse
  if (!response.ok) {
    throw new Error(payload.error?.message || 'Cloudinary upload failed.')
  }

  if (!payload.secure_url || !payload.public_id) {
    throw new Error('Cloudinary did not return a usable asset reference.')
  }

  return {
    url: payload.secure_url,
    publicId: payload.public_id,
  }
}
