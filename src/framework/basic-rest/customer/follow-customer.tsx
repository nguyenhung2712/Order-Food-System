import { useMutation } from 'react-query';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { Customer } from '@framework/types';
import { http1 } from '@framework/utils/http';
import { useCart } from '@contexts/cart/cart.context';

export interface FollowInputType {
  followingId?: string;
  followedId?: string;
}
async function follow(input: FollowInputType) {
  const { data } = await http1.post(`${API_ENDPOINTS.FOLLOW}`, input);

  return {
    status: data.status,
    message: data.message,
    data: data.payload,
  };
}
export const useFollowMutation = () => {
  const { tempCart } = useCart();
  return useMutation((input: FollowInputType) => follow(input), {
    onSuccess: (data) => {
      //Đã theo dõi
      tempCart();
    },
    onError: (data) => {},
  });
};
