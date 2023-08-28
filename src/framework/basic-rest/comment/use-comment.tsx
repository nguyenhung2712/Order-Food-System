import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

export interface CommentInputType {
  message?: string;
  image?: FileList;
  blogId?: string | number;
}
async function comment(input: CommentInputType) {
  const user = JSON.parse(Cookies.get('user') as string);
  const { image, ...postInput } = input;
  const { data } = await http1.post(`${API_ENDPOINTS.ADD_COMMENT}`, {
    ...postInput,
    userId: user.id,
  });
  if (input.image && input.image.length !== 0) {
    const formData: any = new FormData();
    formData.append('image', input.image[0]);

    await http1.put(
      `${API_ENDPOINTS.UPLOAD_COMMENT_IMAGE}/${data.payload.id}`,
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
export const useCommentMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: CommentInputType) => comment(input), {
    onSuccess: (data) => {
      tempCart();
    },
    onError: (data: any) => {},
  });
};
