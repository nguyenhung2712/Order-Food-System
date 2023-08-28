import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

async function deleteRating(_id: string) {
  const { data } = await http1.delete(`${API_ENDPOINTS.DELETE_RATING}/${_id}`);

  return {
    status: data.status,
    message: data.message,
  };
}
export const useDelRatingMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((id: string) => deleteRating(id), {
    onSuccess: (data) => {
      tempCart();
    },
    onError: (data: any) => {},
  });
};
