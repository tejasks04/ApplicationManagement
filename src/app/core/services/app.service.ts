import { Injectable, signal } from '@angular/core';
import { Application } from '../models/app.model';

@Injectable({ providedIn: 'root' })
export class AppService {
  private _apps = signal<Application[]>([
    { id: 1, name: 'HR Portal',       icon: '👥', category: 'HR',      status: 'active'   },
    { id: 2, name: 'Finance Suite',   icon: '💰', category: 'Finance', status: 'active'   },
    { id: 3, name: 'CRM Pro',         icon: '🤝', category: 'Sales',   status: 'active'   },
    { id: 4, name: 'Inventory Mgr',   icon: '📦', category: 'Ops',     status: 'active'   },
    { id: 5, name: 'Dev Console',     icon: '💻', category: 'IT',      status: 'active'   },
    { id: 6, name: 'Analytics Hub',   icon: '📊', category: 'BI',      status: 'inactive' },
    { id: 7, name: 'Support Desk',    icon: '🎧', category: 'Support', status: 'active'   },
    { id: 8, name: 'Project Tracker', icon: '📋', category: 'PM',      status: 'active'   },
  ]);

  readonly apps = this._apps.asReadonly();
}
