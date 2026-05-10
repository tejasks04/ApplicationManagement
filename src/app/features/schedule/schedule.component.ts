import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduleService } from '../../core/services/schedule.service';
import { AppService } from '../../core/services/app.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './schedule.component.html'
})
export class ScheduleComponent implements OnDestroy {
  private scheduleSvc = inject(ScheduleService);
  private appSvc      = inject(AppService);

  private now    = signal(new Date());
  private ticker = setInterval(() => this.now.set(new Date()), 60_000);

  slots = computed(() => {
    const now = this.now();
    return this.scheduleSvc.schedule().map(slot => {
      const msLeft      = slot.expiryAt.getTime() - now.getTime();
      const isExpired   = msLeft <= 0;
      const hoursLeft   = Math.floor(msLeft / 3_600_000);
      const minutesLeft = Math.floor((msLeft % 3_600_000) / 60_000);

      return {
        ...slot,
        isExpired,
        hoursLeft,
        minutesLeft,
        expiryLabel: slot.expiryAt.toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', hour12: true,
          month: 'short', day: 'numeric'
        }),
        addedLabel: slot.addedAt.toLocaleTimeString('en-IN', {
          hour: '2-digit', minute: '2-digit', hour12: true,
          month: 'short', day: 'numeric'
        }),
      };
    });
  });

  hasSlots    = computed(() => this.slots().length > 0);
  activeCount = computed(() => this.slots().filter(s => !s.isExpired).length);
  expiredCount = computed(() => this.slots().filter(s => s.isExpired).length);

  removeSlot(id: number): void {
    this.scheduleSvc.removeSlot(id);
  }

  ngOnDestroy(): void {
    clearInterval(this.ticker);
  }
}
