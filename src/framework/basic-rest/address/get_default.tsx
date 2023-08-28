import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

const fetchAddress = async (_id: string) => {
  const { data } = await http1.get(`${API_ENDPOINTS.DEFAULT_ADDRESS}/${_id}`);
  return data.payload;
};

const useDefaultAddressQuery = (id: string) => {
  return useQuery([API_ENDPOINTS.PROVINCES], () => fetchAddress(id));
};

export { useDefaultAddressQuery, fetchAddress };
