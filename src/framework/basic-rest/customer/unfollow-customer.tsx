import { useMutation } from 'react-query';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useCart } from '@contexts/cart/cart.context';

async function unfollow(_id: string) {
  const { data } = await http1.delete(`${API_ENDPOINTS.UNFOLLOW}/${_id}`);

  return {
    status: data.status,
    message: data.message,
  };
}
export const useUnfollowMutation = () => {
  const { tempCart } = useCart();
  return useMutation((id: string) => unfollow(id), {
    onSuccess: (data) => {
      //Đã hủy theo dõi
      tempCart();
    },
    onError: (data) => {},
  });
};
