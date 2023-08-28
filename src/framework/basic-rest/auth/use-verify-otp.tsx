import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import useWindowSize from '@utils/use-window-size';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';

export interface OTPInputType {
  otp?: number;
  userId?: string;
  username?: string;
  email?: string;
  password?: string;
  status?: string;
}
async function verifyOTP(input: OTPInputType) {
  console.log(input);

  if (input.status === 'pending-c') {
    const { data } = await http1.put(
      `${API_ENDPOINTS.CONFIRM_MAIL}/${input.userId}/${input.otp}`
    );
    return { data: data };
  } else if (input.password) {
    const { data } = await http1.post(`${API_ENDPOINTS.VERIFY_OTP_LOGIN}`, {
      otp: input.otp,
      username: input.username,
      password: input.password,
    });
    const cartRes = await http1.get(
      `${API_ENDPOINTS.CART}/${data.payload.user.id}`
    );

    return {
      accessToken: data.payload.accessToken,
      refreshToken: data.payload.refreshToken,
      user: data.payload.user,
      cart: cartRes.data.payload,
    };
  } else if (input.email) {
    const { data } = await http1.post(`${API_ENDPOINTS.VERIFY_OTP_FP}`, {
      otp: input.otp,
      email: input.email,
    });
    return {
      message: data.message,
      status: data.status,
      id: data.payload.id,
    };
  }
}
export const useVerifyOTPMutation = () => {
  const { t } = useTranslation();
  const { authorize } = useUI();
  const { width } = useWindowSize();
  const { closeModal, openModal } = useModalAction();

  return useMutation((input: OTPInputType) => verifyOTP(input), {
    onSuccess: (data: any) => {
      if (data.accessToken) {
        //xác thực đăng nhập
        toast.success(t('common:text-login-otp-success'), {
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
      } else if (data.data) {
        //xác thực đăng ký
        toast.success(t('common:text-login-otp-success'), {
          position: width! > 768 ? 'bottom-right' : 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        openModal('LOGIN_VIEW');
      } else if (data.id) {
        //xác thực mật khẩu\
        toast.success(t('common:text-login-otp-success'), {
          position: width! > 768 ? 'bottom-right' : 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        openModal('CHANGEPASS_VIEW', { id: data.id });
      }
    },
    onError: (data) => {
      toast.error(t('common:text-login-otp-error'), {
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
