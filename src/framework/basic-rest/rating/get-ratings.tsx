import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useQuery } from 'react-query';
import { http1 } from '@framework/utils/http';

const fetchRatings = async (_id: string) => {
  const { data } = await http1.get(
    `${API_ENDPOINTS.RATINGS_BY_PRODUCT}/${_id}`
  );
  return data.payload;
};

const useRatingsQuery = (id: string) => {
  return useQuery([API_ENDPOINTS.RATINGS_BY_PRODUCT, id], () =>
    fetchRatings(id)
  );
};

export { useRatingsQuery, fetchRatings };
