import { Product, Product1 } from '@framework/types';
import http, { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchProduct = async (slug: string) => {
  const { data } = await http1.get(`${API_ENDPOINTS.PRODUCT_BY_SLUG}/${slug}`);
  return data.payload;
};
export const useProductQuery = (slug: string) => {
  return useQuery<any, Error>([API_ENDPOINTS.PRODUCT_BY_SLUG, slug], () =>
    fetchProduct(slug)
  );
};
