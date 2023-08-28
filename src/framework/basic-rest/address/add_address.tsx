import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

export interface AddAddressInputType {
  title: string;
  address?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
}
async function addAddress(input: AddAddressInputType) {
  const { title, ...address } = input;
  const user = JSON.parse(Cookies.get('user') as string);
  const addressRes = await http1.post(`${API_ENDPOINTS.ADD_ADDRESS}`, {
    ...address,
  });

  const addressId = addressRes.data.payload.id;
  const userId = user.id;
  console.log(userId, addressId);

  const uAddressRes = await http1.post(`${API_ENDPOINTS.ADD_ADDRESS_INFO}`, {
    title,
    userId,
    addressId,
  });

  return {
    addressData: addressRes.data.payload,
    uAddressData: uAddressRes.data.payload,
  };
}
export const useAddAddressMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: AddAddressInputType) => addAddress(input), {
    onSuccess: (data) => {
      toast.success(t('common:text-save-address-success'), {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      tempCart();
      closeModal();
    },
    onError: (data: any) => {
      toast.error(t('common:text-save-address-error'), {
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
