import { Species } from './species';

export interface Animal {
  _id: string;
  space: string;
  name: string;
  description: string;
  images: string[];
  species: Species;
  bornOn: string;
  createdAt: string;
  updatedAt: string;
}