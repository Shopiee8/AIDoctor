'use client';
import { useContext } from 'react';
import { AuthContext } from '@/context/auth-context';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    user: context.user,
    userRole: context.userRole,
    loading: context.loading,
    signIn: context.signIn,
    signUp: context.signUp,
    signOut: context.signOut,
    googleSignIn: context.googleSignIn,
    refreshUser: context.refreshUser
  };
};
