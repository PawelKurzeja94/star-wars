import { Person, Starship } from '../models';

export const isPerson = (entity: Person | Starship | null): entity is Person => {
  return (entity as Person)?.height !== undefined;
};

export const isStarship = (entity: Person | Starship | null): entity is Starship => {
  return (entity as Starship)?.model !== undefined;
};
