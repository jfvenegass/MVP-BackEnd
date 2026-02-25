// src/personalTracking/auth/interfaces/auth-response.interface.ts
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;           // authExternoId
    email: string;
    name: string;
    role: string;
    avatarUrl?: string | null;
    phoneNumber?: string | null;
    birthDate?: string | null;
    gender?: string | null;
    country?: string | null;
    city?: string | null;
    address?: string | null;
  };
}