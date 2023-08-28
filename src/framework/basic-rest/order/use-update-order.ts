import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useUI } from '@contexts/ui.context';
import { useCart } from '@contexts/cart/cart.context';

export interface UpdateOrderInputType {
  orderId?: string;
  status?: number;
}
async function updateOrder(input: UpdateOrderInputType) {
  const res = await http1.put(
    `${API_ENDPOINTS.UPDATE_ORDER}/${input.orderId}`,
    { status: input.status }
  );
  return {
    status: res.data.status,
    message: res.data.message,
  };
}
export const useUpdateOrderMutation = () => {
  const { tempCart } = useCart();
  const { data, closeDrawer } = useUI();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: UpdateOrderInputType) => updateOrder(input), {
    onSuccess: (res) => {
      toast.success(t('common:text-cancel-order-success'), {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      if (data) {
        closeDrawer();
      }
      tempCart();
    },
    onError: (res: any) => {
      toast.error(t('common:text-cancel-order-error'), {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    },
  });
};
