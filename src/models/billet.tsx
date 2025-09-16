export interface Billet {
  _id: string;
  userId: string;
  nameOfBillet : string;
  price: number;
  endOfValidityDate: string;       // ISO format date string: "2025-07-22T00:00:00.000Z"
  createdAt: string;  // ISO format datetime
  updatedAt: string;  // ISO format datetime
}