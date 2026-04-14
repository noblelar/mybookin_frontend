import type { Business, BusinessHoursDay } from '@/types/business'
import type { BusinessMedia } from '@/types/media'
import type { Service, ServiceCategory } from '@/types/service'
import type { StaffMember } from '@/types/staff'

export interface DiscoveryBusinessSummary {
  business: Business
  activeServiceCount: number
  startingPrice: string | null
  featuredServiceName: string | null
  logoImageUrl: string | null
  coverImageUrl: string | null
}

export interface DiscoveryBusinessListResponse {
  businesses: DiscoveryBusinessSummary[]
  availableCategories: string[]
}

export interface DiscoveryBusinessDetailResponse {
  business: Business
  businessHours: BusinessHoursDay[]
  media: BusinessMedia[]
  categories: ServiceCategory[]
  services: Service[]
  staffMembers: StaffMember[]
}
