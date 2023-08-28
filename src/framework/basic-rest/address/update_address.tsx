import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

export interface UpdateAddressInputType {
  id: string;
  oldAddressId?: string;
  title?: string;
  address?: string;
  provinceId?: string;
  districtId?: string;
  wardId?: string;
}
async function updateAddress(input: UpdateAddressInputType) {
  const { id, title, oldAddressId, ...addressInput } = input;
  const user = JSON.parse(Cookies.get('user') as string);
  const userId = user.id;
  let addressRes: any, uAddressRes: any;

  if (!oldAddressId) {
    addressRes = await http1.put(`${API_ENDPOINTS.UPDATE_ADDRESS}/${id}`, {
      ...addressInput,
    });
    uAddressRes = await http1.put(`${API_ENDPOINTS.UPDATE_ADDRESS_INFO}`, {
      title,
      userId,
      addressId: id,
    });
  } else {
    await http1.put(`${API_ENDPOINTS.UPDATE_ADDRESS_INFO}`, {
      isDefault: 0,
      userId,
      addressId: oldAddressId,
    });
    uAddressRes = await http1.put(`${API_ENDPOINTS.UPDATE_ADDRESS_INFO}`, {
      isDefault: 1,
      userId,
      addressId: id,
    });
  }
  /* return {
        addressData: addressRes.data.payload,
        uAddressData: uAddressRes.data.payload
    }; */
}
export const useUpdateAddressMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: UpdateAddressInputType) => updateAddress(input), {
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
