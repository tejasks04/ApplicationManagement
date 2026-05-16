export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'scheduled';
  apps: number[];
  startDate?: string;  // ISO date e.g. '2026-05-16'
  endDate?: string;    // ISO date e.g. '2026-05-20'
  lastLogin: string;
}
