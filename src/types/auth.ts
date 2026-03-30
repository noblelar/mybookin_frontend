export type AuthRole = 'ADMIN' | 'BUSINESS_OWNER' | 'CUSTOMER' | string

export interface BackendUserProfileResponse {
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string | null
  auth_provider: string
  roles: string[]
  created_at: string
  updated_at: string
}

export interface BackendAuthResponse extends BackendUserProfileResponse {
  access_token: string
  token_type: string
  expires_at: string
}

export interface AuthUser {
  userId: string
  firstName: string
  lastName: string
  email: string
  phone: string | null
  authProvider: string
  roles: AuthRole[]
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  user: AuthUser
  expiresAt: string
}

export interface AuthCookiePayload {
  accessToken: string
  tokenType: string
  expiresAt: string
  user: AuthUser
}

export interface AuthActionSuccessResponse {
  message: string
  session: AuthSession
  redirectTo: string
}

export interface SessionResponse {
  authenticated: boolean
  session: AuthSession | null
}

export interface ApiErrorResponse {
  message: string
}
