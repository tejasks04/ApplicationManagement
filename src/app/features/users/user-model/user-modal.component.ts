import { Component, input, output, model, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  hasApp(appId: number): boolean {
    return this.user().apps.includes(appId);
  }

  toggleApp(appId: number): void {

    const current = this.user();

    const apps = current.apps.includes(appId)
      ? current.apps.filter(a => a !== appId)
      : [...current.apps, appId];

    this.user.set({
      ...current,
      apps
    });
  }

  updateName(event: Event): void {

    const value = (event.target as HTMLInputElement).value;

    this.user.set({
      ...this.user(),
      name: value
    });
  }

  updateEmail(event: Event): void {

    const value = (event.target as HTMLInputElement).value;

    this.user.set({
      ...this.user(),
      email: value
    });
  }

  updateRole(event: Event): void {

    const value =
      (event.target as HTMLSelectElement).value as 'admin' | 'user';

    this.user.set({
      ...this.user(),
      role: value
    });
  }

  updateStatus(event: Event): void {

    const value =
      (event.target as HTMLSelectElement).value as 'active' | 'inactive';

    this.user.set({
      ...this.user(),
      status: value
    });
  }

  onSave(): void {
    this.save.emit(this.user());
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
