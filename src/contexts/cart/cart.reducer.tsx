import {
  UpdateItemInput,
  addItemWithQuantity,
  removeItemOrQuantity,
  addItem,
  updateItem,
  removeItem,
  calculateUniqueItems,
  calculateItemTotals,
  calculateTotalItems,
  calculateTotal,
} from './cart.utils';
import { CartItem } from '@framework/types';

interface Metadata {
  [key: string]: any;
}

type Action =
  | { type: 'INIT_ITEMS'; items: CartItem[] }
  | { type: 'ADD_ITEM_WITH_QUANTITY'; item: CartItem; quantity: number }
  | { type: 'REMOVE_ITEM_OR_QUANTITY'; id: CartItem['id']; quantity?: number }
  | { type: 'ADD_ITEM'; id: CartItem['id']; item: CartItem }
  | { type: 'UPDATE_ITEM'; id: CartItem['id']; item: UpdateItemInput }
  | { type: 'REMOVE_ITEM'; id: CartItem['id'] }
  | { type: 'RESET_CART' }
  | { type: 'TEMP_CART' }
  | { type: 'SET_SELECTED_ADDRESS'; address: any };

export interface State {
  items: CartItem[];
  isEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  total: number;
  meta?: Metadata | null;
  temp: number | null;
  address: any;
}
export const initialState: State = {
  items: [],
  isEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  total: 0,
  meta: null,
  temp: 1,
  address: {},
};
export function cartReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'INIT_ITEMS': {
      return generateFinalState(state, action.items);
    }
    case 'ADD_ITEM_WITH_QUANTITY': {
      const items = addItemWithQuantity(
        state.items,
        action.item,
        action.quantity
      );
      return generateFinalState(state, items);
    }
    case 'REMOVE_ITEM_OR_QUANTITY': {
      const items = removeItemOrQuantity(
        state.items,
        action.id,
        (action.quantity = 1)
      );
      return generateFinalState(state, items);
    }
    case 'ADD_ITEM': {
      const items = addItem(state.items, action.item);
      return generateFinalState(state, items);
    }
    case 'REMOVE_ITEM': {
      const items = removeItem(state.items, action.id);
      return generateFinalState(state, items);
    }
    case 'UPDATE_ITEM': {
      const items = updateItem(state.items, action.id, action.item);
      return generateFinalState(state, items);
    }
    case 'TEMP_CART': {
      return { ...state, temp: state.temp === null ? 1 : null };
    }
    case 'SET_SELECTED_ADDRESS': {
      return { ...state, address: action.address };
    }
    case 'RESET_CART':
      return initialState;
    default:
      return state;
  }
}

const generateFinalState = (state: State, items: CartItem[]) => {
  const totalUniqueItems = calculateUniqueItems(items);
  return {
    ...state,
    items: calculateItemTotals(items),
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    total: calculateTotal(items),
    isEmpty: totalUniqueItems === 0,
  };
};
