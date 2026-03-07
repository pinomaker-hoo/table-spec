import { createContext, useContext } from 'react';
import type { ERDBuilderState } from './types';
import type { ERDBuilderAction } from './actions';

interface ERDBuilderContextValue {
  state: ERDBuilderState;
  dispatch: React.Dispatch<ERDBuilderAction>;
}

export const ERDBuilderContext = createContext<ERDBuilderContextValue | null>(null);

export function useERDBuilder(): ERDBuilderContextValue {
  const ctx = useContext(ERDBuilderContext);
  if (!ctx) throw new Error('useERDBuilder must be used within ERDBuilderProvider');
  return ctx;
}
