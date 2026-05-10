import { Injectable, signal, computed, inject } from '@angular/core';
import { User } from '../models/user.model';
import { ScheduleService } from './schedule.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private scheduleSvc = inject(ScheduleService);

  private _users = signal<User[]>([
    { id:1,  name:'Alice Johnson', email:'alice@techcorp.com', role:'admin', status:'active',   apps:[1,2,3,4,5,6,7,8], lastLogin:'2025-01-08 08:45' },
    { id:2,  name:'Bob Smith',     email:'bob@techcorp.com',   role:'user',  status:'active',   apps:[1,3,7],           lastLogin:'2025-01-08 09:10' },
    { id:3,  name:'Carol White',   email:'carol@techcorp.com', role:'user',  status:'active',   apps:[2,4,8],           lastLogin:'2025-01-07 14:22' },
    { id:4,  name:'David Lee',     email:'david@techcorp.com', role:'admin', status:'active',   apps:[1,2,3,4,5,7,8],   lastLogin:'2025-01-08 07:55' },
    { id:5,  name:'Eva Martinez',  email:'eva@techcorp.com',   role:'user',  status:'active',   apps:[1,7],             lastLogin:'2025-01-05 11:30' },
    { id:6,  name:'Frank Brown',   email:'frank@techcorp.com', role:'user',  status:'active',   apps:[3,5,8],           lastLogin:'2025-01-08 08:00' },
    { id:7,  name:'Grace Kim',     email:'grace@techcorp.com', role:'user',  status:'active',   apps:[6],               lastLogin:'2025-01-03 16:45' },
    { id:8,  name:'Henry Davis',   email:'henry@techcorp.com', role:'user',  status:'active',   apps:[1,2,4,7],         lastLogin:'2025-01-08 09:30' },
    { id:9,  name:'Iris Chen',     email:'iris@techcorp.com',  role:'user',  status:'active',   apps:[3,5,6,8],         lastLogin:'2025-01-08 08:15' },
    { id:10, name:'Jake Wilson',   email:'jake@techcorp.com',  role:'user',  status:'active',   apps:[1],               lastLogin:'2025-01-02 10:00' },
  ]);

  // Derive status live from the expiry map — no manual status needed
  readonly users = computed(() => {
    const expiryMap = this.scheduleSvc.expiryMap();
    return this._users().map(u => ({
      ...u,
      status: expiryMap.get(u.name) === true ? 'inactive' : 'active' as 'active' | 'inactive',
    }));
  });

  readonly activeUsers   = computed(() => this.users().filter(u => u.status === 'active'));
  readonly inactiveUsers = computed(() => this.users().filter(u => u.status === 'inactive'));

  addUser(user: Omit<User, 'id'>): void {
    const id = Math.max(...this._users().map(u => u.id)) + 1;
    // Always add as active — schedule will control expiry
    this._users.update(u => [...u, { ...user, id, status: 'active' }]);
  }

  updateUser(updated: User): void {
    this._users.update(u => u.map(x => x.id === updated.id ? updated : x));
  }

  deleteUser(id: number): void {
    this._users.update(u => u.filter(x => x.id !== id));
  }

  usersForApp(appId: number): User[] {
    return this.users().filter(u => u.apps.includes(appId));
  }
}
