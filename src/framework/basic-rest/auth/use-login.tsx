import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import useWindowSize from '@utils/use-window-size';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';

export interface LoginInputType {
  username: string;
  password: string;
  remember_me: boolean;
}
async function login(input: LoginInputType) {
  let { remember_me, ...postInput } = input;
  const { data } = await http1.post(`${API_ENDPOINTS.LOGIN}`, { ...postInput });

  if (data.payload) {
    const cartRes = await http1.get(
      `${API_ENDPOINTS.CART}/${data.payload.user.id}`
    );
    return {
      accessToken: data.payload.accessToken,
      refreshToken: data.payload.refreshToken,
      user: data.payload.user,
      status: data.status,
      cart: cartRes.data.payload,
    };
  } else {
    return {
      status: data.status,
      email: data.email,
      username: input.username,
      password: input.password,
      userId: data.userId,
    };
  }
}
export const useLoginMutation = () => {
  const { t } = useTranslation();
  const { authorize } = useUI();
  const { width } = useWindowSize();
  const { openModal, closeModal } = useModalAction();

  return useMutation((input: LoginInputType) => login(input), {
    onSuccess: (data: any) => {
      if (data.status === 'success') {
        toast.success(t('common:text-login-success'), {
          position: width! > 768 ? 'bottom-right' : 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        Cookies.set('auth_token', data.accessToken, { expires: 7 });
        Cookies.set('refresh_token', data.refreshToken, { expires: 7 });
        Cookies.set('user', JSON.stringify(data.user), { expires: 7 });
        Cookies.set('cart', JSON.stringify(data.cart), { expires: 7 });
        authorize();
        closeModal();
      } else if (data.status.includes('pending')) {
        toast.info(t('common:text-obtain-otp'), {
          position: width! > 768 ? 'bottom-right' : 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        openModal('OTP_VIEW', {
          username: data.username,
          email: data.email,
          password: data.password,
          status: data.status,
          userId: data.userId,
        });
      }
    },
    onError: (data: any) => {
      let title;
      switch (data.response.data.status) {
        case 'error-e':
          title = t('common:text-login-error-e');
          break;
        case 'error-p':
          title = t('common:text-login-error-p');
          break;
        /* case 'error-a':
                    title = t('common:text-login-error-a');
                    break; */
        default:
          title = t('common:text-login-error');
          break;
      }
      toast.error(title, {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    },
  });
};
