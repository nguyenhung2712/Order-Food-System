import { QueryOptionsType, Product, Product1 } from '@framework/types';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import http, { http1 } from '@framework/utils/http';
import { LIMITS } from '@framework/utils/limits';
import { useRouter } from 'next/router';
import { useInfiniteQuery } from 'react-query';

export type PaginatedProduct = {
  data: Product1[];
  itemsLen: number;
};
const fetchProducts = async ({ pageParam = 1, ...query }) => {
  let category, q, rating, locale;
  let sortType: string = '';
  let categories: Array<string> = [];
  if (Object.values(query.queryKey[1]).length !== 0) {
    category = query.queryKey[1].category;
    q = query.queryKey[1].q;
    rating = query.queryKey[1].rating;
    sortType = query.queryKey[1].sort_by;
    locale = query.queryKey[1].locale;
    if (locale === 'vi') {
      switch (sortType) {
        case 'cao-nhat':
          sortType = 'highest';
          break;
        case 'dat-nhieu-nhat':
          sortType = 'most-order';
          break;
        default:
          sortType = 'lowest';
          break;
      }
    }
    if (category) {
      categories = await Promise.all(
        category.split(',').map(async (category: any) => {
          let result: string = '';
          await http1
            .post(API_ENDPOINTS.CATEGORY_BY_NAME, { slug: category })
            .then((res) => {
              result = res.data.payload.id;
            });
          return result;
        })
      );
    }
  }

  const { data } = await http1.post(
    API_ENDPOINTS.PRODUCTS +
      `?limit=${
        LIMITS.PRODUCTS_LIMITS
      }&page=${pageParam}&sort=${sortType}&rating=${rating}&query=${
        q ? q : ''
      }`,
    { categories: categories }
  );
  return {
    data: data.results as Product1[],
    itemsLen: data.itemsLen,
  };
};

const useProductsQuery = ({ query }: any) => {
  return useInfiniteQuery<PaginatedProduct, Error>(
    [API_ENDPOINTS.PRODUCTS, query],
    fetchProducts,
    {
      getNextPageParam: (lastPage, pages) => {
        let currItemAmount = pages.reduce(
          (acc, page) => acc + page.data.length,
          0
        );
        if (currItemAmount < lastPage.itemsLen) {
          return pages.length + 1;
        }
        return null;
      },
    }
  );
};

export { useProductsQuery, fetchProducts };
