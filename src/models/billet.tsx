export interface Billet {
  id: string;
  userId: string;
  firstNameOfBeneficiary: string;
  lastNameOfBeneficiary: string;
  type: "VIP" | "STANDARD" | "ECONOMY" | "";
  price : number | null;
  endOfValidityDate: string;       // ISO format date string: "2025-07-22T00:00:00.000Z"
  createdAt: string;  // ISO format datetime
  updatedAt: string;  // ISO format datetime
}