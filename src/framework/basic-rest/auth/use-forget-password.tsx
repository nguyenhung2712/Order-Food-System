import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import useWindowSize from '@utils/use-window-size';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';

export interface ForgetPasswordType {
  email: string;
}
async function forgetPassword(input: ForgetPasswordType) {
  const { data } = await http1.post(`${API_ENDPOINTS.FORGET_PASSWORD}`, input);
  return {
    email: input.email,
  };
}
export const useForgetPasswordMutation = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const { openModal } = useModalAction();
  return useMutation((input: ForgetPasswordType) => forgetPassword(input), {
    onSuccess: (data) => {
      toast.success(t('common:text-obtain-otp'), {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      /* Cookies.set('email', data.email); */
      openModal('OTP_VIEW', { email: data.email });
    },
    onError: (data) => {
      toast.error(t('common:text-forget-password-error'), {
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
