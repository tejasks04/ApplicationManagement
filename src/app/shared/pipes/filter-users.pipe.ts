import { Pipe, PipeTransform } from '@angular/core';
import { User } from '../../core/models/user.model';

@Pipe({ name: 'filterUsers', standalone: true, pure: false })
export class FilterUsersPipe implements PipeTransform {
  transform(
    users: User[],
    search: string,
    role: string,
    status: string,
  ): User[] {
    const q = search.toLowerCase();
    return users.filter(u => {
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q);
      const matchRole   = role   === 'all' || u.role   === role;
      const matchStatus = status === 'all' || u.status === status;
      return matchSearch && matchRole && matchStatus;
    });
  }
}
