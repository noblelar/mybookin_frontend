import type {
  BackendStaffInvitationResponse,
  BackendStaffMemberResponse,
  BackendStaffShiftResponse,
  BackendTimeOffResponse,
  BackendUserSummaryResponse,
  StaffInvitation,
  StaffMember,
  StaffShift,
  TimeOff,
  UserSummary,
} from '@/types/staff'

export const toUserSummary = (user: BackendUserSummaryResponse): UserSummary => {
  return {
    userId: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
  }
}

export const toStaffMember = (staffMember: BackendStaffMemberResponse): StaffMember => {
  return {
    id: staffMember.id,
    businessId: staffMember.business_id,
    userId: staffMember.user_id,
    displayName: staffMember.display_name,
    roleTitle: staffMember.role_title,
    isActive: staffMember.is_active,
    createdAt: staffMember.created_at,
  }
}

export const toStaffShift = (shift: BackendStaffShiftResponse): StaffShift => {
  return {
    id: shift.id,
    staffMemberId: shift.staff_member_id,
    shiftDate: shift.shift_date,
    startTime: shift.start_time,
    endTime: shift.end_time,
    isOff: shift.is_off,
  }
}

export const toTimeOff = (timeOff: BackendTimeOffResponse): TimeOff => {
  return {
    id: timeOff.id,
    businessId: timeOff.business_id,
    staffMemberId: timeOff.staff_member_id,
    startAt: timeOff.start_at,
    endAt: timeOff.end_at,
    reason: timeOff.reason,
  }
}

export const toStaffInvitation = (
  invitation: BackendStaffInvitationResponse,
  inviteUrl?: string
): StaffInvitation => {
  return {
    id: invitation.id,
    businessId: invitation.business_id,
    email: invitation.email,
    displayName: invitation.display_name,
    roleTitle: invitation.role_title,
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

export const buildStaffInviteUrl = (origin: string, token: string) => {
  const url = new URL('/accept-staff-invite', origin)
  url.searchParams.set('token', token)
  return url.toString()
}
