import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  currentUser = { name: 'Alice Johnson', role: 'Super Admin', initials: 'AJ' };
}
