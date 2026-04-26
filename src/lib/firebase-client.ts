'use client'

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut,
  type Auth,
} from 'firebase/auth'

export type SocialProvider = 'google' | 'apple'

type FirebasePublicConfig = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket?: string
  messagingSenderId?: string
  appId: string
  measurementId?: string
}

export class FirebaseClientConfigError extends Error {
  constructor(message = 'Firebase web configuration is incomplete.') {
    super(message)
    this.name = 'FirebaseClientConfigError'
  }
}

const firebasePublicConfig: FirebasePublicConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() ?? '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() ?? '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() ?? '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || undefined,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || undefined,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() ?? '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim() || undefined,
}

const requiredFirebaseKeys: Array<keyof FirebasePublicConfig> = [
  'apiKey',
  'authDomain',
  'projectId',
  'appId',
]

export const isFirebaseClientConfigured = () => {
  return requiredFirebaseKeys.every((key) => {
    const value = firebasePublicConfig[key]
    return typeof value === 'string' && value.length > 0
  })
}

const getFirebaseApp = (): FirebaseApp => {
  if (!isFirebaseClientConfigured()) {
    throw new FirebaseClientConfigError(
      'Firebase web app keys are missing. Add the NEXT_PUBLIC_FIREBASE_* values to frontend/mybookins/.env.'
    )
  }

  return getApps().length ? getApp() : initializeApp(firebasePublicConfig)
}

export const getFirebaseAuth = (): Auth => {
  const auth = getAuth(getFirebaseApp())
  auth.languageCode = 'en'
  return auth
}

const buildProvider = (provider: SocialProvider) => {
  if (provider === 'google') {
    const googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    })
    googleProvider.addScope('email')
    googleProvider.addScope('profile')
    return googleProvider
  }

  const appleProvider = new OAuthProvider('apple.com')
  appleProvider.addScope('email')
  appleProvider.addScope('name')
  return appleProvider
}

export const signInWithFirebaseSocialProvider = async (provider: SocialProvider) => {
  const auth = getFirebaseAuth()
  const providerInstance = buildProvider(provider)
  const credential = await signInWithPopup(auth, providerInstance)
  const firebaseIdToken = await credential.user.getIdToken(true)

  await signOut(auth).catch(() => undefined)

  return {
    firebaseIdToken,
    email: credential.user.email?.trim() ?? '',
    displayName: credential.user.displayName?.trim() ?? '',
  }
}

export const getSocialProviderLabel = (provider: SocialProvider) => {
  return provider === 'google' ? 'Google' : 'Apple'
}
