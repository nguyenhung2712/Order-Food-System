import { Product, Product1 } from '@framework/types';
import http, { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';

export const fetchProducts = async () => {
  const { data } = await http1.get(`${API_ENDPOINTS.ALL_PRODUCTS}`);
  return data.payload;
};
export const useProductsQuery = () => {
  return useQuery<any, Error>([API_ENDPOINTS.ALL_PRODUCTS], () =>
    fetchProducts()
  );
};
