/*
=========================================
CRM AI CORE
Authentication Types
=========================================
*/

export interface SignupRequest {
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthSession {
  userId: string;

  email: string;

  organizationId?: string;

  workspaceId?: string;

  role?: string;
}

export interface AuthResult {
  success: boolean;

  message: string;

  session?: AuthSession;

  error?: string;
}