import type { BackendAuthResponse } from '@/types/auth'

export interface BackendAdminUserResponse {
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  auth_provider: string
  roles: string[]
  is_active: boolean
  protected: boolean
  removable_admin: boolean
  created_at: string
  updated_at: string
}

export interface BackendAdminInvitationResponse {
  id: string
  email: string
  role_name: string
  status: string
  invited_by_user_id: string
  invited_by_email: string
  accepted_by_user_id?: string | null
  expires_at: string
  accepted_at?: string | null
  revoked_at?: string | null
  created_at: string
  updated_at: string
}

export interface BackendAdminAccessSummaryResponse {
  admins: BackendAdminUserResponse[]
  invitations: BackendAdminInvitationResponse[]
}

export interface BackendCreateAdminInvitationResponse {
  invitation: BackendAdminInvitationResponse
  token: string
}

export interface BackendAcceptAdminInvitationResponse {
  invitation: BackendAdminInvitationResponse
  auth: BackendAuthResponse
}

export interface BackendRemoveAdminRoleResponse {
  user: BackendAdminUserResponse
}

export interface AdminManagedUser {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  authProvider: string
  roles: string[]
  isActive: boolean
  protected: boolean
  removableAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface AdminInvitation {
  id: string
  email: string
  roleName: string
  status: string
  invitedByUserId: string
  invitedByEmail: string
  acceptedByUserId: string | null
  expiresAt: string
  acceptedAt: string | null
  revokedAt: string | null
  createdAt: string
  updatedAt: string
  inviteUrl?: string
}

export interface AdminAccessSummaryResponse {
  admins: AdminManagedUser[]
  invitations: AdminInvitation[]
}

export interface AdminInvitationCreateSuccessResponse {
  message: string
  invitation: AdminInvitation
}

export interface AdminRoleRemovalSuccessResponse {
  message: string
  user: AdminManagedUser
}
