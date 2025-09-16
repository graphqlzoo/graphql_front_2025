export interface Habitat {
  _id: string;
  name: string;
  description: string;
  images: string[];
  types: string[];
  openingHours: number;   // e.g., 600 (6:00 AM)
  closingHours: number;   // e.g., 1800 (6:00 PM)
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}