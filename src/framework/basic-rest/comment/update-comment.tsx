import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

export interface UpdatecommentInputType {
  type?: string;
  commentId?: string | number;
  previewImage?: string;
  repId?: string | number;
  message?: string;
  image?: FileList;
}
async function updateComment(input: UpdatecommentInputType) {
  const { data } =
    input.type === 'cmt'
      ? await http1.put(`${API_ENDPOINTS.UPDATE_COMMENT}/${input.commentId}`, {
          message: input.message,
          image:
            input.previewImage && !input.previewImage.includes('data')
              ? input.previewImage
              : '',
        })
      : await http1.put(`${API_ENDPOINTS.UPDATE_REPCOMMENT}/${input.repId}`, {
          message: input.message,
          image:
            input.previewImage && !input.previewImage.includes('data')
              ? input.previewImage
              : '',
        });
  if (input.image && input.image.length !== 0) {
    if (input.previewImage && input.previewImage.includes('data')) {
      const formData: any = new FormData();
      formData.append('image', input.image[0]);
      input.type === 'cmt'
        ? await http1.put(
            `${API_ENDPOINTS.UPLOAD_COMMENT_IMAGE}/${data.payload.id}`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          )
        : await http1.put(
            `${API_ENDPOINTS.UPLOAD_REPCOMMENT_IMAGE}/${data.payload.id}`,
            formData,
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          );
    }
  }
  return {
    status: data.status,
    message: data.message,
  };
}
export const useUpdatecommentMutation = () => {
  const { tempCart } = useCart();
  return useMutation((input: UpdatecommentInputType) => updateComment(input), {
    onSuccess: (data) => {
      tempCart();
    },
    onError: (data: any) => {},
  });
};