import { CartItem } from '@framework/types';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';
import { useUI } from '@contexts/ui.context';

export const fetchCartItems = async () => {
  const cart = JSON.parse(Cookies.get('cart') as string);
  const { data } = await http1.get(`${API_ENDPOINTS.CART_ITEMS}/${cart.id}`);
  return data.payload as CartItem[];
};
export const useCartItemsQuery = () => {
  const { isAuthorized } = useUI();
  return useQuery<CartItem[], Error>([API_ENDPOINTS.CART_ITEMS], () => {
    if (isAuthorized) {
      return fetchCartItems();
    } else {
      return Promise.resolve([]);
    }
  });
  /* if (isAuthorized) {
      return useQuery<CartItem[], Error>(
        [API_ENDPOINTS.CART_ITEMS],
        fetchCartItems
      );
    } else {
      return useQuery<CartItem[], Error>([API_ENDPOINTS.CART_ITEMS], () => []);
    } */
};
