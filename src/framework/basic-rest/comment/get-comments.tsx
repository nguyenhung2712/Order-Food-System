import { Comment } from '@framework/types';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useInfiniteQuery, useQuery } from 'react-query';
import { LIMITS } from '@framework/utils/limits';

type PaginatedComment = {
  data: Comment[];
  itemsLen: number;
};

export const fetchComments = async ({ pageParam = 1, ...query }) => {
  let id = query.queryKey[1].id;
  let sort = query.queryKey[1].sort_by;

  const { data } = await http1.get(
    API_ENDPOINTS.COMMENTS +
      `/${id}?limit=${LIMITS.COMMENTS_LIMITS}&page=${pageParam}&sort=${sort}`
  );

  return {
    data: data.results as Comment[],
    itemsLen: data.itemsLen,
  };
};

export const useCommentsQuery = ({ query }: any) => {
  return useInfiniteQuery<PaginatedComment, Error>(
    [API_ENDPOINTS.COMMENTS, query],
    fetchComments,
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
