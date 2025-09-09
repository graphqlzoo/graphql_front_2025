import { Animal } from './animal';
import {Habitat} from './space';

export interface Show {
  id: string;
  name: string;
  description: string;
  images: string[]; // assuming image URLs or base64 strings
  hoursOfActivity: string[];
  habitat: Habitat;
  animals : Animal[];
  createdAt: string; // ISO 8601 datetime string
  updatedAt: string; // ISO 8601 datetime string
}