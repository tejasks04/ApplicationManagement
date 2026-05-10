import { Component, inject, signal, computed } from '@angular/core';
import { UserService }     from '../../core/services/user.service';
import { AppService }      from '../../core/services/app.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { User }            from '../../core/models/user.model';
import { BadgeComponent }  from '../../shared/components/badge/badge.component';
import { UserModalComponent, ModalMode } from './user-model/user-modal.component';

const BLANK_USER: Omit<User, 'id'> = {
  name: '',
  email: '',
  role: 'user',
  status: 'active',
  apps: [],
  lastLogin: 'Never',
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
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRole   = role   === 'all' || u.role   === role;
      const matchStatus = status === 'all' || u.status === status;
      return matchSearch && matchRole && matchStatus;
    });
  });

  modalMode = signal<ModalMode>('add');
  modalUser = signal<User | null>(null);
  showModal = computed(() => this.modalUser() !== null);

  appName = (id: number) => this.appSvc.apps().find(a => a.id === id);

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

      // Resolve app names from IDs and create a schedule slot
      const appNames = user.apps
        .map(appId => this.appSvc.apps().find(a => a.id === appId)?.name)
        .filter((name): name is string => !!name);

      this.scheduleSvc.addUserSlot(user.name, appNames);
    }

    this.modalUser.set(null);
  }

  onModalCancel(): void {
    this.modalUser.set(null);
  }

  updateModalUser(user: User): void {
    this.modalUser.set(user);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  }
}
