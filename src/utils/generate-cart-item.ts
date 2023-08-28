import isEmpty from 'lodash/isEmpty';
import { Product1, Category } from '@framework/types';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
/* interface Item {
    id: string | number;
    name: string;
    slug: string;
    product: Product1,
    type: Category;
    image: {
        thumbnail: string;
        [key: string]: unknown;
    };
    price: number;
    sale_price?: number;
    quantity?: number;
    [key: string]: unknown;
} */
/* interface Variation {
    id: string | number;
    title: string;
    price: number;
    sale_price?: number;
    quantity: number;
    [key: string]: unknown;
} */
export function generateCartItem(item: Product1 /* , variation: Variation */) {
  /* const { id, name, slug, image, price, sale_price, quantity, unit } = item; */
  /* if (!isEmpty(variation)) {
          return {
              id: `${id}.${variation.id}`,
              productId: id,
              name: `${name} - ${variation.title}`,
              slug,
              unit,
              stock: variation.quantity,
              price: variation.sale_price ? variation.sale_price : variation.price,
              image: image?.thumbnail,
              variationId: variation.id,
          };
      } */

  const cart = Cookies.get('cart')
    ? JSON.parse(Cookies.get('cart') as string)
    : null;

  return {
    id: uuidv4(),
    quantity: 0,
    deletedAt: undefined,
    status: 1,
    expiryDate: new Date().toString(),
    createdAt: new Date().toString(),
    updatedAt: new Date().toString(),
    product: item,
    cart: cart,
  };
}
