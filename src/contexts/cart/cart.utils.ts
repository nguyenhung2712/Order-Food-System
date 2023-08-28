import { Product1, Cart, CartItem } from '@framework/types';
/* export interface Item {
    id: string | number;
    price: number;
    quantity?: number;

    [key: string]: any;
} */

export interface UpdateItemInput extends Partial<Omit<CartItem, 'id'>> {}

export function addItemWithQuantity(
  items: CartItem[],
  item: CartItem,
  quantity: number
) {
  if (quantity <= 0)
    throw new Error("cartQuantity can't be zero or less than zero");

  const existingItemIndex = items.findIndex(
    (existingItem) => existingItem.product.id === item.product.id
  );

  if (existingItemIndex > -1) {
    /* const newItems = [...items]; */
    items[existingItemIndex].quantity! += 1;
    /* newItems[existingItemIndex].quantity += quantity; */
    return [...items];
  } else {
    return [...items, { ...item, quantity }];
  }
}

export function removeItemOrQuantity(
  items: CartItem[],
  id: CartItem['id'],
  quantity: number
) {
  return items.reduce((acc: CartItem[], item) => {
    if (item.product.id === id) {
      const newQuantity = item.quantity! - quantity;

      return newQuantity > 0
        ? [...acc, { ...item, quantity: newQuantity }]
        : [...acc];
    }
    return [...acc, item];
  }, []);
}
// Simple CRUD for Item
export function addItem(items: CartItem[], item: CartItem) {
  return [...items, item];
}

export function getItem(items: CartItem[], id: CartItem['id']) {
  return items.find((item) => item.product.id === id);
}

export function updateItem(
  items: CartItem[],
  id: CartItem['id'],
  item: UpdateItemInput
) {
  return items.map((existingItem) =>
    existingItem.product.id === id ? { ...existingItem, ...item } : existingItem
  );
}

export function removeItem(items: CartItem[], id: CartItem['id']) {
  return items.filter((existingItem) => existingItem.product.id !== id);
}

/* export function inStock(items: Item[], id: Item['id']) {
    const item = getItem(items, id);
    if (item) return item['quantity']! < item['stock']!;
    return false;
} */

export const calculateItemTotals = (items: CartItem[]) =>
  items.map((item) => ({
    ...item,
    itemTotal: Number(item.product.price) * item.quantity!,
  }));

export const calculateTotal = (items: CartItem[]) =>
  items.reduce(
    (total, item) => total + item.quantity! * Number(item.product.price),
    0
  );

export const calculateTotalItems = (items: CartItem[]) =>
  items.reduce((sum, item) => sum + item.quantity!, 0);

export const calculateUniqueItems = (items: CartItem[]) =>
  items ? items.length : 0;
