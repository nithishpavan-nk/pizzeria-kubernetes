import React, { createContext, useContext, useReducer, useMemo } from 'react';

const CartContext = createContext(null);

const initialState = {
  items: [], // { menuItemId, name, price, image, quantity }
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItemId, name, price, image } = action.payload;
      const existing = state.items.find((i) => i.menuItemId === menuItemId);

      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }

      return {
        ...state,
        items: [...state.items, { menuItemId, name, price, image, quantity: 1 }],
      };
    }

    case 'INCREMENT': {
      return {
        ...state,
        items: state.items.map((i) =>
          i.menuItemId === action.payload.menuItemId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }

    case 'DECREMENT': {
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.menuItemId === action.payload.menuItemId ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((i) => i.menuItemId !== action.payload.menuItemId),
      };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (menuItem) => dispatch({ type: 'ADD_ITEM', payload: menuItem });
  const incrementItem = (menuItemId) => dispatch({ type: 'INCREMENT', payload: { menuItemId } });
  const decrementItem = (menuItemId) => dispatch({ type: 'DECREMENT', payload: { menuItemId } });
  const removeItem = (menuItemId) => dispatch({ type: 'REMOVE_ITEM', payload: { menuItemId } });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const itemCount = useMemo(
    () => state.items.reduce((sum, i) => sum + i.quantity, 0),
    [state.items]
  );

  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [state.items]
  );

  const value = {
    items: state.items,
    itemCount,
    subtotal,
    addItem,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
