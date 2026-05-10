export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  apps: number[];          // array of Application IDs
  lastLogin: string;
}
