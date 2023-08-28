import { OrderItem } from '@framework/types';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchOrderDetails = async (_id: string) => {
  const { data } = await http1.get(`${API_ENDPOINTS.ORDER_DETAILS}/${_id}`);
  return data.payload;
};
export const useOrderDetailsQuery = (id: string) => {
  return useQuery<OrderItem[], Error>([API_ENDPOINTS.ORDER_DETAILS, id], () =>
    fetchOrderDetails(id)
  );
};
