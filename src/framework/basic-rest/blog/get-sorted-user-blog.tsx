import { BlogsQueryOptionsType, Blog } from '@framework/types';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useInfiniteQuery, useQuery } from 'react-query';
import { log } from 'console';

type PaginatedComment = {
  data: Blog[];
  itemsLen: number;
};

export const fetchUsersBlog = async ({ pageParam = 1, ...query }: any) => {
  let limit = query.queryKey[1].limit;
  let id = query.queryKey[1].id;
  let sort = query.queryKey[1].sort_by;

  const { data } = await http1.get(
    `${API_ENDPOINTS.BLOGS_BY_SORT_USER}/${id}` +
      `?limit=${limit}&page=${pageParam}&sort=${sort}`
  );

  return {
    data: data.results as Blog[],
    itemsLen: data.itemsLen,
  };
};

export const useBlogsQuery = (options: BlogsQueryOptionsType) => {
  return useInfiniteQuery<PaginatedComment, Error>(
    [API_ENDPOINTS.BLOGS, options],
    fetchUsersBlog,
    {
      getNextPageParam: (lastPage, pages) => {
        if (pages.some((page) => page.data)) {
          let currItemAmount = pages.reduce(
            (acc, page) => acc + (page ? page.data.length : 0),
            0
          );
          if (currItemAmount < lastPage.itemsLen) {
            return pages.length + 1;
          }
        } else {
          return null;
        }
      },
    }
  );
};
