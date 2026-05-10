import { Component, inject, computed } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AppService }  from '../../core/services/app.service';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { BadgeComponent }    from '../../shared/components/badge/badge.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [StatCardComponent, BadgeComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  private userSvc = inject(UserService);
  private appSvc  = inject(AppService);

  users  = this.userSvc.users;
  apps   = this.appSvc.apps;

  totalUsers    = computed(() => this.users().length);
  activeUsers   = computed(() => this.userSvc.activeUsers().length);
  inactiveUsers = computed(() => this.userSvc.inactiveUsers().length);
  totalApps     = computed(() => this.apps().length);
  runningApps   = computed(() => this.apps().filter(a => a.status === 'active').length);

  appUserCount   = (appId: number) => this.users().filter(u => u.apps.includes(appId)).length;
  appActiveCount = (appId: number) => this.users().filter(u => u.apps.includes(appId) && u.status === 'active').length;
  activeRatio    = (appId: number) => {
    const total = this.appUserCount(appId);
    return total > 0 ? (this.appActiveCount(appId) / total) * 100 : 0;
  };

  weeklyTrend = [
    { day: 'Mon', active: 7, inactive: 3 },
    { day: 'Tue', active: 8, inactive: 2 },
    { day: 'Wed', active: 6, inactive: 4 },
    { day: 'Thu', active: 9, inactive: 1 },
    { day: 'Fri', active: 7, inactive: 3 },
    { day: 'Sat', active: 4, inactive: 6 },
    { day: 'Sun', active: 5, inactive: 5 },
  ];

  barHeight = (val: number) => `${(val / 10) * 100}%`;
}
