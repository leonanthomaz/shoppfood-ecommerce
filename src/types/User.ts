import { AddressDTO } from "./Address";

export interface User {
  id: number;
  storeId: number;
  name: string;
  email: string;
  password?: string;
  telephone: string;
}

export interface UserDetailsDTO {
  id: number;
  name: string;
  email: string;
  password?: string;
  telephone: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
  address?: AddressDTO;
}

export interface AuthContextState {
  authenticated: boolean;
  user: UserDetailsDTO | null;
}

export interface AuthContextActions {
  type: 'LOGIN' | 'LOGOUT' | 'SET_USER';
  payload?: any;
}

export interface AuthResponse {
  token: string;
}