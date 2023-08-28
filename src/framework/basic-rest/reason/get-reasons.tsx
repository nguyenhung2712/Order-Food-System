import http, { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchReasons = async () => {
  const { data } = await http1.get(`${API_ENDPOINTS.REASONS}`);
  return data.payload;
};
export const useReasonsQuery = () => {
  return useQuery<any, Error>([API_ENDPOINTS.REASONS], () => fetchReasons());
};
