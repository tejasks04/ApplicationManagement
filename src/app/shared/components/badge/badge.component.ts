import { Component, input } from '@angular/core';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [],
  templateUrl: './badge.component.html',
})
export class BadgeComponent {
  text = input.required<string>();

  get cssClass(): string {
    const map: Record<string, string> = {
      active:    'bg-emerald-100 text-emerald-700',
      inactive:  'bg-red-100 text-red-600',
      scheduled: 'bg-amber-100 text-amber-700',
      admin:     'bg-indigo-100 text-indigo-700',
      user:      'bg-gray-100 text-gray-600',
      done:      'bg-emerald-100 text-emerald-700',
      running:   'bg-blue-100 text-blue-700',
      pending:   'bg-amber-100 text-amber-700',
    };
    return map[this.text()] ?? 'bg-gray-100 text-gray-600';
  }
}
