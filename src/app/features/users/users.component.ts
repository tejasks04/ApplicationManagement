import { Component, inject, signal, computed } from '@angular/core';
import * as XLSX from 'xlsx';

import { UserService }     from '../../core/services/user.service';
import { AppService }      from '../../core/services/app.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { User }            from '../../core/models/user.model';
import { BadgeComponent }  from '../../shared/components/badge/badge.component';
import { UserModalComponent, ModalMode } from './user-model/user-modal.component';

const BLANK_USER: Omit<User, 'id'> = {
  name: '', email: '', role: 'user', status: 'active',
  apps: [], lastLogin: 'Never', startDate: undefined, endDate: undefined,
};

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [BadgeComponent, UserModalComponent],
  templateUrl: './users.component.html',
})
export class UsersComponent {

  private userSvc     = inject(UserService);
  private scheduleSvc = inject(ScheduleService);
  appSvc              = inject(AppService);

  users        = this.userSvc.users;
  search       = signal('');
  roleFilter   = signal<string>('all');
  statusFilter = signal<string>('all');

  filteredUsers = computed(() => {
    const q      = this.search().toLowerCase().trim();
    const role   = this.roleFilter();
    const status = this.statusFilter();

    return this.users().filter(u => {
      const matchSearch  = !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
      const matchRole    = role   === 'all' || u.role   === role;
      const matchStatus  = status === 'all' || u.status === status;
      return matchSearch && matchRole && matchStatus;
    });
  });

  reportLabel = computed(() => {
    const parts: string[] = [];
    if (this.statusFilter() !== 'all') parts.push(this.statusFilter());
    if (this.roleFilter()   !== 'all') parts.push(this.roleFilter());
    return parts.length
      ? parts.map(p => p[0].toUpperCase() + p.slice(1)).join(' + ')
      : 'All';
  });

  modalMode = signal<ModalMode>('add');
  modalUser = signal<User | null>(null);
  showModal = computed(() => this.modalUser() !== null);

  appName = (id: number) => this.appSvc.apps().find(a => a.id === id);

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  }

  isExpired(endDate: string): boolean {
    return new Date(endDate) < new Date();
  }

  openAdd(): void {
    this.modalMode.set('add');
    this.modalUser.set({ id: 0, ...BLANK_USER } as User);
  }

  openEdit(user: User): void {
    this.modalMode.set('edit');
    this.modalUser.set({ ...user });
  }

  onModalSave(user: User): void {
    if (this.modalMode() === 'edit') {
      this.userSvc.updateUser(user);
    } else {
      const { id, ...rest } = user;
      this.userSvc.addUser(rest);

      const appNames = user.apps
        .map(appId => this.appSvc.apps().find(a => a.id === appId)?.name)
        .filter((n): n is string => !!n);
      this.scheduleSvc.addUserSlot(user.name, appNames);
    }
    this.modalUser.set(null);
  }

  onModalCancel(): void { this.modalUser.set(null); }

  updateModalUser(user: User): void { this.modalUser.set(user); }

  getInitials(name: string): string {
    return name.split(' ').map(p => p[0]).join('').toUpperCase();
  }

  generateReport(): void {
    const users   = this.filteredUsers();
    const allApps = this.appSvc.apps();
    const fmt     = (dt?: string) => dt ? new Date(dt).toLocaleDateString() : 'N/A';

    const duration = (start?: string, end?: string): string => {
      if (!start || !end) return 'N/A';
      const ms = new Date(end).getTime() - new Date(start).getTime();
      if (ms <= 0) return 'Invalid';
      const d = Math.floor(ms / 86_400_000);
      const h = Math.floor((ms % 86_400_000) / 3_600_000);
      return [d && `${d}d`, h && `${h}h`].filter(Boolean).join(' ') || '< 1h';
    };

    const resolveApps = (ids: number[]) =>
      ids.map(id => allApps.find(a => a.id === id))
         .filter(Boolean).map(a => `${a!.icon} ${a!.name}`).join(', ') || 'None';

    const listRows = [
      [`User Report — ${this.reportLabel()}`],
      [`Generated: ${new Date().toLocaleString()}`, '', `Total: ${users.length}`],
      [],
      ['#','Name','Email','Role','Status','Start Date','End Date','Duration','Last Login','Apps'],
      ...users.map((u, i) => [
        i+1, u.name, u.email, u.role, u.status,
        fmt(u.startDate), fmt(u.endDate),
        duration(u.startDate, u.endDate),
        u.lastLogin, resolveApps(u.apps),
      ]),
    ];

    const listSheet = XLSX.utils.aoa_to_sheet(listRows);
    listSheet['!cols'] = [
      {wch:4},{wch:20},{wch:28},{wch:8},{wch:12},
      {wch:14},{wch:14},{wch:12},{wch:18},{wch:40},
    ];
    listSheet['!merges'] = [{s:{r:0,c:0},e:{r:0,c:9}}];

    const all = this.users();
    const count = (role: string, status: string) =>
      all.filter(u =>
        (role   === 'all' || u.role   === role) &&
        (status === 'all' || u.status === status)
      ).length;

    const summaryRows = [
      ['Summary'], [],
      ['',       'Active',                'Inactive',                'Scheduled',                 'Total'],
      ['Admin',  count('admin','active'), count('admin','inactive'), count('admin','scheduled'),  count('admin','all')],
      ['User',   count('user','active'),  count('user','inactive'),  count('user','scheduled'),   count('user','all')],
      ['Total',  count('all','active'),   count('all','inactive'),   count('all','scheduled'),    count('all','all')],
    ];

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);
    summarySheet['!cols'] = [{wch:12},{wch:12},{wch:12},{wch:14},{wch:10}];
    summarySheet['!merges'] = [{s:{r:0,c:0},e:{r:0,c:4}}];

    const appRows = [
      ['Name','Role','Status',...allApps.map(a=>`${a.icon} ${a.name}`)],
      ...users.map(u=>[u.name,u.role,u.status,...allApps.map(a=>u.apps.includes(a.id)?'✓':'')]),
    ];
    const appSheet = XLSX.utils.aoa_to_sheet(appRows);
    appSheet['!cols'] = [{wch:20},{wch:8},{wch:12},...allApps.map(()=>({wch:16}))];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, listSheet, 'User List');
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');
    XLSX.utils.book_append_sheet(wb, appSheet, 'App Access');

    const slug = [
      this.statusFilter() !== 'all' ? this.statusFilter() : '',
      this.roleFilter()   !== 'all' ? this.roleFilter()   : '',
    ].filter(Boolean).join('_') || 'all';

    XLSX.writeFile(wb, `users_report_${slug}_${Date.now()}.xlsx`);
  }
}
