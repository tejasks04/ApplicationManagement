import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgClass } from '@angular/common';

interface NavItem { path: string; label: string; icon: string; }

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  collapsed = signal(false);
  toggle() { this.collapsed.update(v => !v); }

  navItems: NavItem[] = [
    { path: '/dashboard',    label: 'Dashboard',    icon: '📊' },
    { path: '/users',        label: 'Users',        icon: '👥' },
    { path: '/applications', label: 'Applications', icon: '🖥️' },
    { path: '/schedule',     label: 'Schedule',     icon: '📅' },
  ];
}
