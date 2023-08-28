import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useUI } from '@contexts/ui.context';
import { useCart } from '@contexts/cart/cart.context';

export interface ExportOrderInputType {
  orderId?: string;
  locale?: string;
  number?: string;
}
async function exportOrder(input: ExportOrderInputType) {
  const res = await http1.get(
    `${API_ENDPOINTS.EXPORT_ORDER}/${input.orderId}/${input.locale}`,
    {
      responseType: 'arraybuffer',
    }
  );
  return res.data;
}
export const useExportOrderMutation = () => {
  const { tempCart } = useCart();
  const { data, closeDrawer } = useUI();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: ExportOrderInputType) => exportOrder(input), {
    onSuccess: (res) => {
      const buffer = res;
      const blob = new Blob([buffer]);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `invoice-${data.number}.pdf`;
      link.click();
      /* toast.success(t('common:text-cancel-order-success'), {
                    position: width! > 768 ? 'bottom-right' : 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                }); */
    },
    onError: (res: any) => {
      /* toast.error(t('common:text-cancel-order-error'), {
                    position: width! > 768 ? 'bottom-right' : 'top-right',
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                }); */
    },
  });
};
