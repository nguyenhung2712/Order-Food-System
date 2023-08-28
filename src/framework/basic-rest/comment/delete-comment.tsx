import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

export interface DeletecommentInputType {
  type?: string;
  commentId?: string | number;
  repId?: string | number;
}
async function deleteComment(input: DeletecommentInputType) {
  const { data } =
    input.type === 'cmt'
      ? await http1.put(`${API_ENDPOINTS.DELETE_COMMENT}/${input.commentId}`)
      : await http1.put(`${API_ENDPOINTS.DELETE_REPCOMMENT}/${input.repId}`);

  return {
    status: data.status,
    message: data.message,
  };
}
export const useDeletecommentMutation = () => {
  const { tempCart } = useCart();
  return useMutation((input: DeletecommentInputType) => deleteComment(input), {
    onSuccess: (data) => {
      tempCart();
    },
    onError: (data: any) => {},
  });
};
