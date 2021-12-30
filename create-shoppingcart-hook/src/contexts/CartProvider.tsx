import { createContext, ReactNode, useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '../services/api';

import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

export interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

export const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const localStorageCart = '@RocketShoes:cart';
  const storagedCart = localStorage.getItem(localStorageCart);

  const [cart, setCart] = useState<Product[]>(() => {
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: number) => {
    try {
      const productFound = cart.find(product => product.id === productId);
      let newCartData: Product[] = [];

      const stockResponse = await api.get(`/stock/${productId}`);

      const productAmount = productFound ? productFound.amount + 1 : 1;
      const stockAmount = stockResponse.data.amount;

      if(productAmount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if(productFound) {
        newCartData = cart.map(item => {
          if(item.id === productId) {
            return {
              ...item,
              amount: item.amount + 1
            }
          }
          return {
            ...item,
          };
        });
      } else {
        const response = await api.get<Product>(`/products/${productId}`);

        newCartData = [
          ...cart,
          {
            ...response.data,
            amount: 1
          }
        ];
      }

      setCart(newCartData);
      localStorage.setItem(localStorageCart, JSON.stringify(newCartData));
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const productFound = cart.find(product => product.id === productId);
      let cartUpdated: Product[] = [];

      if(!productFound) {
        toast.error('Erro na remoção do produto');
        return;
      }
      
      cartUpdated = cart.filter(where => where.id !== productId);

      setCart(cartUpdated);
      localStorage.setItem(localStorageCart, JSON.stringify(cartUpdated));
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      const productFound = cart.find(product => product.id === productId);
      let cartUpdated: Product[] = [];

      const stockResponse = await api.get(`/stock/${productId}`);

      const stockAmount = stockResponse.data.amount;

      if(amount === 0 || amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      if(productFound) {
        cartUpdated = cart.map(product => {
          if(product.id === productId) {
            return {
              ...product,
              amount,
            }
          }

          return {
            ...product
          };
        });
      }

      setCart(cartUpdated);
      localStorage.setItem(localStorageCart, JSON.stringify(cartUpdated));
    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}