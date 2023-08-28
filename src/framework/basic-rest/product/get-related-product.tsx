import { QueryOptionsType, Product } from '@framework/types';
import http, { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchRelatedProducts = async ({ queryKey }: any) => {
  const [_key, _params] = queryKey;

  const { data } = await http1.get(
    `${API_ENDPOINTS.RELATED_PRODUCTS}/${_params.type}` +
      `?limit=${_params.limit}`
  );
  return data;
};

export const useRelatedProductsQuery = (options: QueryOptionsType) => {
  return useQuery<Product[], Error>(
    [API_ENDPOINTS.RELATED_PRODUCTS, options],
    fetchRelatedProducts
  );
};
