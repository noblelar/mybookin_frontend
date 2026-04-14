export type BusinessMediaType = 'LOGO' | 'COVER' | 'GALLERY'

export interface BackendBusinessMediaResponse {
  id: string
  business_id: string
  media_type: BusinessMediaType
  url: string
  public_id: string
  sort_order: number
  created_at: string
}

export interface BusinessMedia {
  id: string
  businessId: string
  mediaType: BusinessMediaType
  url: string
  publicId: string
  sortOrder: number
  createdAt: string
}

export interface CreateBusinessMediaPayload {
  media_type: BusinessMediaType
  url: string
  public_id: string
}

export interface ReorderBusinessMediaPayload {
  media_ids: string[]
}

export interface SignUploadPayload {
  media_type: BusinessMediaType
}

export interface UploadSignatureResponse {
  cloudName: string
  apiKey: string
  timestamp: number
  signature: string
  folder: string
  mediaType: BusinessMediaType
}

export interface BusinessMediaListResponse {
  media: BusinessMedia[]
}

export interface BusinessMediaMutationResponse {
  message: string
  media: BusinessMedia
}

export interface BusinessMediaReorderResponse {
  message: string
  media: BusinessMedia[]
}
