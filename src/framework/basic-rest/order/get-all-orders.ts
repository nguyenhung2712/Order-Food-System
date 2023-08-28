import { OrderItem } from '@framework/types';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

const fetchOrders = async ({ queryKey }: any) => {
  /* const [_key, _params] = queryKey; */
  const user = JSON.parse(Cookies.get('user') as string);
  const { data } = await http1.get(`${API_ENDPOINTS.ORDERS}/${user.id}`);
  return data.payload;
};

const useOrdersQuery = () => {
  return useQuery([API_ENDPOINTS.ORDERS], fetchOrders);
};

export { useOrdersQuery, fetchOrders };
