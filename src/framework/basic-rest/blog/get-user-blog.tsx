import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchBlog = async (_id: string) => {
  const { data } = await http1.get(`${API_ENDPOINTS.BLOGS_BY_USER}/${_id}`);
  return data.payload;
};
export const useUserBlogsQuery = (id: string) => {
  return useQuery([API_ENDPOINTS.BLOGS_BY_USER, id], () => fetchBlog(id));
};
