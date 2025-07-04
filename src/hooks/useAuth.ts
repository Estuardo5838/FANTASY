import { useState, useEffect } from 'react'
import { useCodeAccess } from './useCodeAccess'

export function useAuth() {
  const { hasAccess } = useCodeAccess()
  
  // Simplified auth - just check if user has code access
  return {
    user: hasAccess ? { id: 'code-user', email: 'user@fantasyglitch.com' } : null,
    profile: hasAccess ? { 
      id: 'code-user', 
      email: 'user@fantasyglitch.com',
      full_name: 'Fantasy Manager',
      subscription_status: 'premium' as const,
      subscription_end: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    } : null,
    loading: false,
    signIn: async () => ({ data: null, error: null }),
    signUp: async () => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
    updateProfile: async () => ({ data: null, error: null }),
    isPremium: hasAccess, // Everyone with code access has premium
  }
}