export interface Application {
  id: number;
  name: string;
  icon: string;
  category: string;
  status: 'active' | 'inactive';
}
