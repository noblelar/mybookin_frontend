import type { Business } from '@/types/business'
import type { Service, ServiceCategory } from '@/types/service'
import type { StaffMember } from '@/types/staff'

export interface DiscoveryBusinessSummary {
  business: Business
  activeServiceCount: number
  startingPrice: string | null
  featuredServiceName: string | null
}

export interface DiscoveryBusinessListResponse {
  businesses: DiscoveryBusinessSummary[]
  availableCategories: string[]
}

export interface DiscoveryBusinessDetailResponse {
  business: Business
  categories: ServiceCategory[]
  services: Service[]
  staffMembers: StaffMember[]
}
