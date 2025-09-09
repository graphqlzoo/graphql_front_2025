export interface Habitat {
  _id: string;
  zoo: string;
  name: string;
  description: string;
  images: string[];
  types: string[];
  capacity: number;
  visitorDuration: number;
  openingHours: number;   // e.g., 600 (6:00 AM)
  closingHours: number;   // e.g., 1800 (6:00 PM)
  accessibility: string[];
  disabled: boolean;
  createdAt: string;
  updatedAt: string;
}