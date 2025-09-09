export interface Species {
  _id: string;
  name: string;
  description: string;
  images: string[]; // assuming image URLs or base64 strings
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}