import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import { useCart } from '@contexts/cart/cart.context';
import swal from 'sweetalert';
import { useRouter } from 'next/router';
import { ROUTES } from '@utils/routes';

export interface UpdateBlogInputType {
  header?: string;
  content?: string;
  userId?: string;
  blogId?: string;
  views?: number;
}

async function updateBlog(input: UpdateBlogInputType) {
  const { blogId, ...postInput } = input;
  const { data } = await http1.put(
    `${API_ENDPOINTS.UPDATE_BLOG}/${input.blogId}`,
    postInput
  );
  return {
    status: data.status,
    message: data.message,
    data: data.payload,
    views: input.views,
  };
}
export const useUpdateBlogMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const router = useRouter();
  return useMutation((input: UpdateBlogInputType) => updateBlog(input), {
    onSuccess: (data) => {
      if (data.views) {
        router.push(`${ROUTES.BLOGS}/${data.data.slug}`);
      } else {
        swal({
          title: 'Cập nhật thành công',
          text: 'Đã cập nhật blog thành công.',
          icon: 'success',
        }).then((result) => {
          router.back();
        });
      }
      tempCart();
    },
    onError: (data: any) => {},
  });
};
