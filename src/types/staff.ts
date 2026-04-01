export interface BackendStaffMemberResponse {
  id: string
  business_id: string
  user_id: string
  display_name: string
  role_title: string
  is_active: boolean
  created_at: string
}

export interface BackendStaffShiftResponse {
  id: string
  staff_member_id: string
  shift_date: string
  start_time: string
  end_time: string
  is_off: boolean
}

export interface BackendTimeOffResponse {
  id: string
  business_id: string
  staff_member_id: string
  start_at: string
  end_at: string
  reason: string
}

export interface BackendStaffInvitationResponse {
  id: string
  business_id: string
  email: string
  display_name: string
  role_title: string
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

export interface BackendUserSummaryResponse {
  user_id: string
  first_name: string
  last_name: string
  email: string
}

export interface BackendOnboardStaffResponse {
  outcome: 'STAFF_MEMBER_CREATED' | 'STAFF_MEMBER_EXISTS' | 'INVITATION_CREATED'
  user?: BackendUserSummaryResponse
  staff_member?: BackendStaffMemberResponse
  invitation?: BackendStaffInvitationResponse
  token?: string
}

export interface BackendAcceptStaffInvitationResponse {
  invitation: BackendStaffInvitationResponse
  staff_member: BackendStaffMemberResponse
}

export interface UserSummary {
  userId: string
  firstName: string
  lastName: string
  email: string
}

export interface StaffMember {
  id: string
  businessId: string
  userId: string
  displayName: string
  roleTitle: string
  isActive: boolean
  createdAt: string
}

export interface StaffShift {
  id: string
  staffMemberId: string
  shiftDate: string
  startTime: string
  endTime: string
  isOff: boolean
}

export interface TimeOff {
  id: string
  businessId: string
  staffMemberId: string
  startAt: string
  endAt: string
  reason: string
}

export interface StaffInvitation {
  id: string
  businessId: string
  email: string
  displayName: string
  roleTitle: string
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

export interface OnboardStaffByEmailPayload {
  email: string
  display_name: string
  role_title: string
}

export interface UpdateStaffMemberPayload {
  display_name: string
  role_title: string
}

export interface UpdateStaffMemberActivePayload {
  is_active: boolean
}

export interface ReplaceServiceStaffPayload {
  staff_member_ids: string[]
}

export interface CreateStaffShiftPayload {
  shift_date: string
  start_time: string
  end_time: string
  is_off: boolean
}

export interface CreateTimeOffPayload {
  start_at: string
  end_at: string
  reason: string
}

export interface StaffListResponse {
  staffMembers: StaffMember[]
}

export interface StaffInvitationListResponse {
  invitations: StaffInvitation[]
}

export interface StaffShiftListResponse {
  shifts: StaffShift[]
}

export interface TimeOffListResponse {
  timeOff: TimeOff[]
}

export interface StaffMutationResponse {
  message: string
  staffMember: StaffMember
}

export interface StaffShiftMutationResponse {
  message: string
  shift: StaffShift
}

export interface TimeOffMutationResponse {
  message: string
  timeOff: TimeOff
}

export interface ServiceStaffAssignmentResponse {
  message: string
  staffMembers: StaffMember[]
}

export interface StaffSelfStatusResponse {
  exists: boolean
  staffMember: StaffMember | null
}

export interface StaffSelfMutationResponse {
  message: string
  staffMember: StaffMember
}

export interface OnboardStaffSuccessResponse {
  message: string
  outcome: 'STAFF_MEMBER_CREATED' | 'STAFF_MEMBER_EXISTS' | 'INVITATION_CREATED'
  user: UserSummary | null
  staffMember: StaffMember | null
  invitation: StaffInvitation | null
}

export interface AcceptStaffInvitationSuccessResponse {
  message: string
  invitation: StaffInvitation
  staffMember: StaffMember
  redirectTo: string
}
