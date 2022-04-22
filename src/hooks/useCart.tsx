import { useContext } from 'react';

import {
  CartContextData,
  CartContext,
} from '../contexts/CartProvider';

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
