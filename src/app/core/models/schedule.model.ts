export interface ScheduleSlot {
  id: number;
  userName: string;
  appNames: string[];
  addedAt: Date;
  expiryAt: Date;
}
