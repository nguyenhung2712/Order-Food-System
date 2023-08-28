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

export interface UpdateProductInputType {
  productId?: string;
  views?: number;
}

async function updateProduct(input: UpdateProductInputType) {
  const { productId, ...postInput } = input;
  const { data } = await http1.put(
    `${API_ENDPOINTS.UPDATE_PRODUCT}/${input.productId}`,
    postInput
  );
  return {
    status: data.status,
    message: data.message,
    data: data.payload,
    views: input.views,
  };
}
export const useUpdateProductMutation = () => {
  const { closeModal } = useModalAction();
  const { tempCart } = useCart();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const router = useRouter();
  return useMutation((input: UpdateProductInputType) => updateProduct(input), {
    onSuccess: (data) => {
      /* swal({
                title: "Cập nhật thành công",
                text: "Đã cập nhật product thành công.",
                icon: "success",
            })
                .then(result => {
                    router.back();
                }); */
      console.log(data);

      tempCart();
      if (data.views) {
        router.push(`${ROUTES.PRODUCTS}/${data.data.slug}`);
      }
    },
    onError: (data: any) => {},
  });
};
