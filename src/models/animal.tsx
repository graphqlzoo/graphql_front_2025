import { Species } from './species';

export interface Animal {
  id: string;
  space: string;
  name: string;
  description: string;
  images: string[];
  species: Species;
  bornOn: string;
  createdAt: string;
  updatedAt: string;
}