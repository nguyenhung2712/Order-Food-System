import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

const fetchProvinces = async () => {
  const { data } = await http1.get(API_ENDPOINTS.PROVINCES);
  return {
    data: data,
  };
};

const useProvincesQuery = () => {
  return useQuery([API_ENDPOINTS.PROVINCES], fetchProvinces);
};

export { useProvincesQuery, fetchProvinces };
