import { createContext, useContext } from 'react';

export const HomeScrollContext = createContext(null);

export function useHomeScrollRoot() {
  return useContext(HomeScrollContext);
}
