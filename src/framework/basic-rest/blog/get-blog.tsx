import { Blog } from '@framework/types';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchBlog = async (_slug: string) => {
  const { data } = await http1.get(`${API_ENDPOINTS.BLOG_BY_SLUG}/${_slug}`);
  return data.payload;
};
export const useBlogQuery = (slug: string) => {
  return useQuery([API_ENDPOINTS.BLOG_BY_SLUG, slug], () => fetchBlog(slug));
};
