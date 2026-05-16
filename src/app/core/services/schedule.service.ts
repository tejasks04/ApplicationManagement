import { Injectable, signal } from '@angular/core';
import { ScheduleSlot } from '../models/schedule.model';

const EXISTING_USERS = [
  { name: 'Alice Johnson',  apps: ['HR Portal','Finance Suite','CRM Pro','Inventory Mgr','Dev Console','Analytics Hub','Support Desk','Project Tracker'] },
  { name: 'Bob Smith',      apps: ['HR Portal','CRM Pro','Support Desk'] },
  { name: 'Carol White',    apps: ['Finance Suite','Inventory Mgr','Project Tracker'] },
  { name: 'David Lee',      apps: ['HR Portal','Finance Suite','CRM Pro','Inventory Mgr','Dev Console','Support Desk','Project Tracker'] },
  { name: 'Eva Martinez',   apps: ['HR Portal','Support Desk'] },
  { name: 'Frank Brown',    apps: ['CRM Pro','Dev Console','Project Tracker'] },
  { name: 'Grace Kim',      apps: ['Analytics Hub'] },
  { name: 'Henry Davis',    apps: ['HR Portal','Finance Suite','Inventory Mgr','Support Desk'] },
  { name: 'Iris Chen',      apps: ['CRM Pro','Dev Console','Analytics Hub','Project Tracker'] },
  { name: 'Jake Wilson',    apps: ['HR Portal'] },
];

@Injectable({ providedIn: 'root' })
export class ScheduleService {
  private _schedule = signal<ScheduleSlot[]>(this.seedSlots());

  readonly schedule = this._schedule.asReadonly();

  private seedSlots(): ScheduleSlot[] {
    const now = new Date();
    return EXISTING_USERS.map((u, i) => {
      const addedAt  = new Date(now.getTime() - (i + 1) * 60 * 60 * 1000);
      const expiryAt = new Date(addedAt.getTime() + 24 * 60 * 60 * 1000);
      return { id: i + 1, userName: u.name, appNames: u.apps, addedAt, expiryAt };
    });
  }

  addUserSlot(userName: string, appNames: string[]): void {
    const addedAt  = new Date();
    const expiryAt = new Date(addedAt.getTime() + 24 * 60 * 60 * 1000);
    this._schedule.update(slots => [
      ...slots,
      { id: Date.now(), userName, appNames, addedAt, expiryAt },
    ]);
  }

  removeSlot(id: number): void {
    this._schedule.update(slots => slots.filter(s => s.id !== id));
  }
}
