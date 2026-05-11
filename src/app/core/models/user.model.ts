// export interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: 'admin' | 'user';
//   status: 'active' | 'inactive';
//   apps: number[];          // array of Application IDs
//   lastLogin: string;
// }

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  apps: number[];
  /** ISO-8601 datetime string, e.g. "2024-06-01T09:00" — matches datetime-local input format */
  startDate?: string;
  /** ISO-8601 datetime string — must be after startDate when both are set */
  endDate?: string;
  lastLogin: string;
}
