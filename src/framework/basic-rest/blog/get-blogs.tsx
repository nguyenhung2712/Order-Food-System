import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchBlogs = async () => {
  const { data } = await http1.get(API_ENDPOINTS.BLOGS);
  return data.payload;
};
export const useBlogsQuery = () => {
  return useQuery([API_ENDPOINTS.BLOGS], () => fetchBlogs());
};
