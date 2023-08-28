import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';

export interface InteractCommentInputType {
  type?: number;
  commentId?: string | number;
  repId?: string | number;
  reasonId?: string;
  otherReason?: string;
}
async function interactComment(input: InteractCommentInputType) {
  const user = JSON.parse(Cookies.get('user') as string);
  const { commentId, repId, ...postInput } = input;
  const { data } = commentId
    ? await http1.post(API_ENDPOINTS.INTERACT_CMT, {
        commentId: commentId,
        userId: user.id,
        ...postInput,
      })
    : await http1.post(API_ENDPOINTS.INTERACT_REP, {
        repId: repId,
        userId: user.id,
        ...postInput,
      });
  return {
    status: data.status,
    message: data.message,
  };
}
export const useInteractCommentMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation(
    (input: InteractCommentInputType) => interactComment(input),
    {
      onSuccess: (data) => {
        tempCart();
        closeModal();
      },
      onError: (data: any) => {
        console.log(data);
      },
    }
  );
};
