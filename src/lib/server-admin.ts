import type {
  AdminInvitation,
  AdminManagedUser,
  BackendAdminInvitationResponse,
  BackendAdminUserResponse,
} from '@/types/admin'

export const toAdminUser = (user: BackendAdminUserResponse): AdminManagedUser => {
  return {
    userId: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone ?? null,
    authProvider: user.auth_provider,
    roles: user.roles,
    isActive: user.is_active,
    protected: user.protected,
    removableAdmin: user.removable_admin,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  }
}

export const toAdminInvitation = (
  invitation: BackendAdminInvitationResponse,
  inviteUrl?: string
): AdminInvitation => {
  return {
    id: invitation.id,
    email: invitation.email,
    roleName: invitation.role_name,
    status: invitation.status,
    invitedByUserId: invitation.invited_by_user_id,
    invitedByEmail: invitation.invited_by_email,
    acceptedByUserId: invitation.accepted_by_user_id ?? null,
    expiresAt: invitation.expires_at,
    acceptedAt: invitation.accepted_at ?? null,
    revokedAt: invitation.revoked_at ?? null,
    createdAt: invitation.created_at,
    updatedAt: invitation.updated_at,
    inviteUrl,
  }
}

export const buildAdminInviteUrl = (origin: string, token: string) => {
  const url = new URL('/accept-admin-invite', origin)
  url.searchParams.set('token', token)
  return url.toString()
}
