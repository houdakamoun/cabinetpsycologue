export interface User {
  id: number;
  email: string;
  role: 'ADMIN' | 'ASSISTANT';
  firstName?: string;
  lastName?: string;
  photo?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
