import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { http1 } from '@framework/utils/http';

const fetchFollowings = async (_id: string) => {
  const { data } = await http1.get(`${API_ENDPOINTS.FOLLOWINGS}/${_id}`);
  return data.payload;
};

const useFollowingsQuery = (id: string) => {
  return useQuery([API_ENDPOINTS.FOLLOWINGS, id], () => fetchFollowings(id));
};

export { useFollowingsQuery, fetchFollowings };
