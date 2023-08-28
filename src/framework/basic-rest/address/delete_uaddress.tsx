import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

export interface DeleteUAddressInputType {
    addressId?: string;
    userId?: string;
}
async function deleteUAddress(input: DeleteUAddressInputType) {
    const { data } = await http1.post(`${API_ENDPOINTS.DELETE_ADDRESS_INFO}`, {
        ...input,
    });

    return {
        message: data.message,
        status: data.status,
    };
}
export const useDeleteUAddressMutation = () => {
    /* const { closeModal } = useModalAction();
        const { tempCart } = useCart();
        const { t } = useTranslation();
        const { width } = useWindowSize(); */
    return useMutation(
        (input: DeleteUAddressInputType) => deleteUAddress(input),
        {
            onSuccess: (data) => {
                /* toast.success(t('common:text-save-address-success'), {
                                        position: width! > 768 ? 'bottom-right' : 'top-right',
                                        autoClose: 2000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: 'colored',
                                    }); */
                /* tempCart();
                                closeModal(); */
            },
            onError: (data: any) => {
                /* toast.error(t('common:text-save-address-error'), {
                                        position: width! > 768 ? 'bottom-right' : 'top-right',
                                        autoClose: 2000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: 'colored',
                                    }); */
            },
        }
    );
};
