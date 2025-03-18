// types/user.ts
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  date_joined: string;
  password?: string; // Only used for registration
}
