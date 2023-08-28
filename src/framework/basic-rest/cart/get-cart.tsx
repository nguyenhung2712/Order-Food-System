import { Cart } from '@framework/types';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

const fetchCart = async () => {
  const user = JSON.parse(JSON.stringify(Cookies.get('user')));
  const { data } = await http1.get(`${API_ENDPOINTS.CART}/${user.id}`);
  return data.payload;
};

const useCartQuery = () => {
  return useQuery<Cart, Error>([API_ENDPOINTS.CART], () => fetchCart());
};

export { useCartQuery, fetchCart };
