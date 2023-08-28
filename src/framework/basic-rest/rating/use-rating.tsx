import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

export interface RatingInputType {
  message?: string;
  dishId?: string;
  score?: number;
}
async function rating(input: RatingInputType) {
  let { message, ...postInput } = input;
  const user = JSON.parse(Cookies.get('user') as string);
  const { data } = await http1.post(`${API_ENDPOINTS.RATING}`, {
    ...postInput,
    remarks: message,
    userId: user.id,
  });

  return {
    status: data.status,
    message: data.message,
  };
}
export const useRatingMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: RatingInputType) => rating(input), {
    onSuccess: (data) => {
      tempCart();
    },
    onError: (data: any) => {},
  });
};
