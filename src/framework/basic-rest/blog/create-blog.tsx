import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';
import swal from 'sweetalert';
import { useRouter } from 'next/router';

export interface CreateBlogInputType {
  header?: string;
  content?: string;
  userId?: string;
}
async function createBlog(input: CreateBlogInputType) {
  const user = JSON.parse(Cookies.get('user') as string);
  const { data } = await http1.post(API_ENDPOINTS.CREATE_BLOG, {
    userId: input.userId,
    content: input.content,
    header: input.header,
  });
  console.log(input);
  return {
    status: data.status,
    message: data.message,
    data: data.payload,
  };
}
export const useCreateBlogMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const router = useRouter();
  return useMutation((input: CreateBlogInputType) => createBlog(input), {
    onSuccess: (data) => {
      /* swal({
                title: "Thêm thành công",
                text: "Đã thêm blog thành công.",
                icon: "success",
            })
                .then(result => {
                    router.back();
                }); */
    },
    onError: (data: any) => {},
  });
};
