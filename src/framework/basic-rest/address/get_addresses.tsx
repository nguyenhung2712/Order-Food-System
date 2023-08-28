import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import Cookies from 'js-cookie';

const fetchAddress = async () => {
  const user = JSON.parse(Cookies.get('user') as string);
  const { data } = await http1.get(`${API_ENDPOINTS.ADDRESS}/${user.id}`);
  return {
    data: data.payload,
  };
};

const useAddressQuery = () => {
  return useQuery([API_ENDPOINTS.ADDRESS], fetchAddress);
};

export { useAddressQuery, fetchAddress };
