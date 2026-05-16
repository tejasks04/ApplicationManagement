import { Injectable, signal, computed } from '@angular/core';
import { User } from '../models/user.model';

export function deriveStatus(user: Partial<User> & { startDate?: string; endDate?: string; status?: User['status'] }): User['status'] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = user.startDate ? new Date(user.startDate) : null;
  const end   = user.endDate   ? new Date(user.endDate)   : null;

  if (start || end) {
    if (start && today < start) return 'scheduled';  // future start
    if (end   && today > end)   return 'inactive';   // past end
    return 'active';                                  // within range
  }

  // No dates — use manual status as-is
  return user.status ?? 'active';
}

@Injectable({ providedIn: 'root' })
export class UserService {

  private _users = signal<User[]>([
    { id:1,  name:'Alice Johnson', email:'alice@techcorp.com', role:'admin', status:'active',   apps:[1,2,3,4,5,6,7,8], lastLogin:'2025-01-08 08:45' },
    { id:2,  name:'Bob Smith',     email:'bob@techcorp.com',   role:'user',  status:'active',   apps:[1,3,7],           lastLogin:'2025-01-08 09:10' },
    { id:3,  name:'Carol White',   email:'carol@techcorp.com', role:'user',  status:'active',   apps:[2,4,8],           lastLogin:'2025-01-07 14:22' },
    { id:4,  name:'David Lee',     email:'david@techcorp.com', role:'admin', status:'active',   apps:[1,2,3,4,5,7,8],   lastLogin:'2025-01-08 07:55' },
    { id:5,  name:'Eva Martinez',  email:'eva@techcorp.com',   role:'user',  status:'inactive', apps:[1,7],             lastLogin:'2025-01-05 11:30' },
    { id:6,  name:'Frank Brown',   email:'frank@techcorp.com', role:'user',  status:'active',   apps:[3,5,8],           lastLogin:'2025-01-08 08:00' },
    { id:7,  name:'Grace Kim',     email:'grace@techcorp.com', role:'user',  status:'inactive', apps:[6],               lastLogin:'2025-01-03 16:45' },
    { id:8,  name:'Henry Davis',   email:'henry@techcorp.com', role:'user',  status:'active',   apps:[1,2,4,7],         lastLogin:'2025-01-08 09:30' },
    { id:9,  name:'Iris Chen',     email:'iris@techcorp.com',  role:'user',  status:'active',   apps:[3,5,6,8],         lastLogin:'2025-01-08 08:15' },
    { id:10, name:'Jake Wilson',   email:'jake@techcorp.com',  role:'user',  status:'inactive', apps:[1],               lastLogin:'2025-01-02 10:00' },
  ]);

  readonly users = computed(() =>
    this._users().map(u => ({ ...u, status: deriveStatus(u) }))
  );

  readonly activeUsers    = computed(() => this.users().filter(u => u.status === 'active'));
  readonly inactiveUsers  = computed(() => this.users().filter(u => u.status === 'inactive'));
  readonly scheduledUsers = computed(() => this.users().filter(u => u.status === 'scheduled'));

  addUser(user: Omit<User, 'id'>): void {
    const id     = Math.max(...this._users().map(u => u.id)) + 1;
    const status = deriveStatus(user);
    this._users.update(u => [...u, { ...user, id, status }]);
  }

  updateUser(updated: User): void {
    const status = deriveStatus(updated);
    this._users.update(u =>
      u.map(x => x.id === updated.id ? { ...updated, status } : x)
    );
  }

  deleteUser(id: number): void {
    this._users.update(u => u.filter(x => x.id !== id));
  }

  usersForApp(appId: number): User[] {
    return this.users().filter(u => u.apps.includes(appId));
  }
}
