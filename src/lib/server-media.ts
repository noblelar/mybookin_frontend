import type {
  BackendBusinessMediaResponse,
  BusinessMedia,
  BusinessMediaType,
  UploadSignatureResponse,
} from '@/types/media'

export const toBusinessMedia = (media: BackendBusinessMediaResponse): BusinessMedia => {
  return {
    id: media.id,
    businessId: media.business_id,
    mediaType: media.media_type,
    url: media.url,
    publicId: media.public_id,
    sortOrder: media.sort_order,
    createdAt: media.created_at,
  }
}

export const toUploadSignatureResponse = (payload: unknown): UploadSignatureResponse => {
  const record = payload as Record<string, unknown>

  return {
    cloudName: String(record.cloud_name ?? ''),
    apiKey: String(record.api_key ?? ''),
    timestamp: Number(record.timestamp ?? 0),
    signature: String(record.signature ?? ''),
    folder: String(record.folder ?? ''),
    mediaType: String(record.media_type ?? 'GALLERY') as BusinessMediaType,
  }
}
