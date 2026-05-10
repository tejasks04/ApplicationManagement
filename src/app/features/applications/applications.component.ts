import { Component, inject, signal, computed } from '@angular/core';
import { AppService }    from '../../core/services/app.service';
import { UserService }   from '../../core/services/user.service';
import { Application }   from '../../core/models/app.model';
import { BadgeComponent } from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './applications.component.html',
})
export class ApplicationsComponent {
  private appSvc  = inject(AppService);
  private userSvc = inject(UserService);

  apps     = this.appSvc.apps;
  selected = signal<Application | null>(null);

  appUsers = computed(() => {
    const sel = this.selected();
    if (!sel) return [];
    return this.userSvc.usersForApp(sel.id);
  });

  appUserCount  = (id: number) => this.userSvc.users().filter(u => u.apps.includes(id)).length;
  appActiveCount = (id: number) => this.userSvc.users().filter(u => u.apps.includes(id) && u.status === 'active').length;
  activeRatio   = (id: number) => {
    const t = this.appUserCount(id);
    return t > 0 ? (this.appActiveCount(id) / t) * 100 : 0;
  };

  select(app: Application): void   { this.selected.set(app); }
  deselect(): void                 { this.selected.set(null); }
  isSelected(app: Application): boolean { return this.selected()?.id === app.id; }
}
