import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

export interface RepCommentInputType {
  message?: string;
  image?: FileList;
  commentId?: string | number;
  repId?: string | number;
}
async function repcomment(input: RepCommentInputType) {
  const user = JSON.parse(Cookies.get('user') as string);
  const { image, ...postInput } = input;
  const { data } = await http1.post(`${API_ENDPOINTS.ADD_REPCOMMENT}`, {
    ...postInput,
    userId: user.id,
  });

  if (input.image && input.image.length !== 0) {
    const formData: any = new FormData();
    formData.append('image', input.image[0]);

    await http1.put(
      `${API_ENDPOINTS.UPLOAD_REPCOMMENT_IMAGE}/${data.payload.id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }
  return {
    status: data.status,
    message: data.message,
  };
}
export const useRepCommentMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: RepCommentInputType) => repcomment(input), {
    onSuccess: (data) => {
      tempCart();
      /* toast.success(t('common:text-save-address-success'), {
                          position: width! > 768 ? 'bottom-right' : 'top-right',
                          autoClose: 2000,
                          hideProgressBar: false,
                          closeOnClick: true,
                          pauseOnHover: true,
                          draggable: true,
                          progress: undefined,
                          theme: "colored",
                      });
                      tempCart();
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
                          theme: "colored",
                      }); */
    },
  });
};
