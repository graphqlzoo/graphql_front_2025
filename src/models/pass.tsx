export interface Pass {
  _id: string;
  name: string;
  zoo: string;              // ID reference to the zoo
  periodicity: 'day' | 'week' | 'month' | 'year'; // or just `string` if not strictly typed
  price: number;
  spaces: string[];         // assuming it's an array of space IDs
  createdAt: string;        // ISO string; can also be `Date` if parsed
  updatedAt: string;        // (inferred from `updat`, assuming it's `updatedAt`)
}