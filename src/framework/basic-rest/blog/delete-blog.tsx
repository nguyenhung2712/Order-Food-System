import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

async function deleteBlog(id: string) {
  const { data } = await http1.put(`${API_ENDPOINTS.DELETE_BLOG}/${id}`);
  return {
    status: data.status,
    message: data.message,
  };
}
export const useDeleteBlogMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((id: string) => deleteBlog(id), {
    onSuccess: (data) => {
      tempCart();
    },
    onError: (data: any) => {},
  });
};
