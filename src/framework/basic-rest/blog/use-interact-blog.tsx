import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';
import { collection, addDoc, Timestamp, arrayUnion } from 'firebase/firestore';
import { db } from '../../../utils/firebase';

const addDocument = async (collectionName: any, data: any) => {
  const collectionRef = collection(db, collectionName);
  const now = new Date();
  const createdAt = Timestamp.fromDate(now);
  await addDoc(collectionRef, {
    ...data,
    createdAt,
  });
};

export interface InteractBlogInputType {
  type?: number;
  blogId?: string | number;
  reasonId?: string;
  otherReason?: string;
}
async function interactBlog(input: InteractBlogInputType) {
  const user = JSON.parse(Cookies.get('user') as string);
  const { data } = await http1.post(API_ENDPOINTS.INTERACT_BLOG, {
    userId: user.id,
    ...input,
  });
  return {
    status: data.status,
    message: data.message,
    type: input.type,
    user,
    blogId: input.blogId,
  };
}
export const useInteractBlogMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: InteractBlogInputType) => interactBlog(input), {
    onSuccess: (data) => {
      addDocument('notifications', {
        image: null,
        message: `Blog đã được thích bởi người dùng: ${
          data.user.firstName + ' ' + data.user.lastName
        }`,
        readBy: [],
        receivedId: [data.user.id],
        userPath: `/blogs/${data.blogId}`,
        title: 'Tương tác blog',
      });
      tempCart();
      closeModal();
    },
    onError: (data: any) => {
      console.log(data);
    },
  });
};
