import { Component, input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [],
  templateUrl: './stat-card.component.html',
})
export class StatCardComponent {
  icon  = input.required<string>();
  label = input.required<string>();
  value = input.required<string | number>();
  sub   = input<string>('');
  color = input<string>('bg-indigo-50');
}
