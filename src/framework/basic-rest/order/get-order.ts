import { Order } from '@framework/types';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchOrder = async (_id: string) => {
  const { data } = await http1.get(`${API_ENDPOINTS.ORDER}/${_id}`);
  return data.payload;
};
export const useOrderQuery = (id: string) => {
  return useQuery<Order, Error>([API_ENDPOINTS.ORDER, id], () =>
    fetchOrder(id)
  );
};
