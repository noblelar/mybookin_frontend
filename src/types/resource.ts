export type ResourceType =
  | 'ROOM'
  | 'CHAIR'
  | 'BED'
  | 'TABLE'
  | 'STATION'
  | 'EQUIPMENT'
  | 'OTHER'

export interface BackendResourceResponse {
  id: string
  business_id: string
  type: ResourceType
  name: string
  capacity: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Resource {
  id: string
  businessId: string
  type: ResourceType
  name: string
  capacity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateResourcePayload {
  type: ResourceType
  name: string
  capacity: number
}

export type UpdateResourcePayload = CreateResourcePayload

export interface UpdateResourceActivePayload {
  is_active: boolean
}

export interface BackendServiceResourceRuleResponse {
  id: string
  service_id: string
  resource_id: string
  resource_type: ResourceType
  resource_name: string
  resource_capacity: number
  resource_is_active: boolean
  units_required: number
  created_at: string
  updated_at: string
}

export interface ServiceResourceRule {
  id: string
  serviceId: string
  resourceId: string
  resourceType: ResourceType
  resourceName: string
  resourceCapacity: number
  resourceIsActive: boolean
  unitsRequired: number
  createdAt: string
  updatedAt: string
}

export interface ReplaceServiceResourceRulesPayload {
  rules: Array<{
    resource_id: string
    units_required: number
  }>
}

export interface ResourceListResponse {
  resources: Resource[]
}

export interface ResourceMutationResponse {
  message: string
  resource: Resource
}

export interface ServiceResourceRuleListResponse {
  rules: ServiceResourceRule[]
}

export interface ServiceResourceRuleMutationResponse {
  message: string
  rules: ServiceResourceRule[]
}
