import { Component, input, output, model, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

import { User } from '../../../core/models/user.model';
import { AppService } from '../../../core/services/app.service';

export type ModalMode = 'edit' | 'add';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './user-modal.component.html',
})
export class UserModalComponent {

  mode = input.required<ModalMode>();

  user = model.required<User>();

  save = output<User>();

  cancel = output<void>();

  apps = inject(AppService).apps;

  isGeneratingReport = signal(false);

  // ── Validation ─────────────────────────────────────────────────────────────

  dateRangeError = computed(() => {
    const { startDate, endDate } = this.user();
    if (!startDate || !endDate) return false;
    return new Date(endDate) <= new Date(startDate);
  });

  // ── App access helpers ──────────────────────────────────────────────────────

  hasApp(appId: number): boolean {
    return this.user().apps.includes(appId);
  }

  toggleApp(appId: number): void {
    const current = this.user();
    const apps = current.apps.includes(appId)
      ? current.apps.filter(a => a !== appId)
      : [...current.apps, appId];
    this.user.set({ ...current, apps });
  }

  // ── Field updaters ──────────────────────────────────────────────────────────

  updateName(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.user.set({ ...this.user(), name: value });
  }

  updateEmail(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.user.set({ ...this.user(), email: value });
  }

  updateRole(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'admin' | 'user';
    this.user.set({ ...this.user(), role: value });
  }

  updateStatus(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as 'active' | 'inactive';
    this.user.set({ ...this.user(), status: value });
  }

  updateStartDate(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.user.set({ ...this.user(), startDate: value });
  }

  updateEndDate(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.user.set({ ...this.user(), endDate: value });
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  onSave(): void {
    if (this.dateRangeError()) return;
    this.save.emit(this.user());
  }

  onCancel(): void {
    this.cancel.emit();
  }

  // ── Report generation ───────────────────────────────────────────────────────

  // onGenerateReport(): void {
  //   this.isGeneratingReport.set(true);

  //   try {
  //     const u = this.user();
  //     const appNames = this.apps()
  //       .filter(a => u.apps.includes(a.id))
  //       .map(a => `${a.icon} ${a.name}`)
  //       .join(', ');

  //     const formatDt = (dt?: string) =>
  //       dt ? new Date(dt).toLocaleString() : 'N/A';

  //     // ── Sheet 1 – User Role Summary ────────────────────────────────────────
  //     const summaryRows = [
  //       ['User Role Report'],
  //       ['Generated At', new Date().toLocaleString()],
  //       [],
  //       ['Field', 'Value'],
  //       ['Name',       u.name],
  //       ['Email',      u.email],
  //       ['Role',       u.role],
  //       ['Status',     u.status],
  //       ['Start Date', formatDt(u.startDate)],
  //       ['End Date',   formatDt(u.endDate)],
  //       ['Duration',   this.computeDuration(u.startDate, u.endDate)],
  //       ['App Access', appNames || 'None'],
  //     ];

  //     const summarySheet = XLSX.utils.aoa_to_sheet(summaryRows);

  //     // Style header row (bold title + column widths)
  //     summarySheet['!cols'] = [{ wch: 20 }, { wch: 40 }];
  //     summarySheet['A1'] = { v: 'User Role Report', t: 's' };

  //     // Merge A1:B1 for the title
  //     summarySheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  //     // ── Sheet 2 – App Access Detail ────────────────────────────────────────
  //     const allApps = this.apps();
  //     const appDetailRows = [
  //       ['App ID', 'App Name', 'Access Granted'],
  //       ...allApps.map(a => [
  //         a.id,
  //         `${a.icon} ${a.name}`,
  //         u.apps.includes(a.id) ? 'Yes' : 'No',
  //       ]),
  //     ];

  //     const appSheet = XLSX.utils.aoa_to_sheet(appDetailRows);
  //     appSheet['!cols'] = [{ wch: 8 }, { wch: 25 }, { wch: 16 }];

  //     // ── Workbook assembly ──────────────────────────────────────────────────
  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, summarySheet, 'User Role Summary');
  //     XLSX.utils.book_append_sheet(wb, appSheet, 'App Access');

  //     const fileName = `user-role-report_${u.name.replace(/\s+/g, '_')}_${Date.now()}.xlsx`;
  //     XLSX.writeFile(wb, fileName);

  //   } finally {
  //     this.isGeneratingReport.set(false);
  //   }
  // }

  // ── Helpers ─────────────────────────────────────────────────────────────────

  private computeDuration(start?: string, end?: string): string {
    if (!start || !end) return 'N/A';
    const ms = new Date(end).getTime() - new Date(start).getTime();
    if (ms <= 0) return 'Invalid range';
    const days    = Math.floor(ms / 86_400_000);
    const hours   = Math.floor((ms % 86_400_000) / 3_600_000);
    const minutes = Math.floor((ms % 3_600_000)  / 60_000);
    return [
      days    ? `${days}d`    : '',
      hours   ? `${hours}h`   : '',
      minutes ? `${minutes}m` : '',
    ].filter(Boolean).join(' ') || '< 1 minute';
  }
}
