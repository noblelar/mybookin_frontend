import type {
  BackendResourceResponse,
  BackendServiceResourceRuleResponse,
  Resource,
  ServiceResourceRule,
} from '@/types/resource'

export const toResource = (resource: BackendResourceResponse): Resource => {
  return {
    id: resource.id,
    businessId: resource.business_id,
    type: resource.type,
    name: resource.name,
    capacity: resource.capacity,
    isActive: resource.is_active,
    createdAt: resource.created_at,
    updatedAt: resource.updated_at,
  }
}

export const toServiceResourceRule = (
  rule: BackendServiceResourceRuleResponse
): ServiceResourceRule => {
  return {
    id: rule.id,
    serviceId: rule.service_id,
    resourceId: rule.resource_id,
    resourceType: rule.resource_type,
    resourceName: rule.resource_name,
    resourceCapacity: rule.resource_capacity,
    resourceIsActive: rule.resource_is_active,
    unitsRequired: rule.units_required,
    createdAt: rule.created_at,
    updatedAt: rule.updated_at,
  }
}
