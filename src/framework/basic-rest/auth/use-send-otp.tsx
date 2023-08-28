import { useUI } from '@contexts/ui.context';
import { useModalAction } from '@components/common/modal/modal.context';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import useWindowSize from '@utils/use-window-size';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';

async function sendOTP(username: string) {
  const { data } = await http1.post(`${API_ENDPOINTS.SEND_OTP}`, { username });
  return {
    data: data,
  };
}
export const useSendOTPMutation = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();

  return useMutation((username: string) => sendOTP(username), {
    onSuccess: (data) => {
      toast.success(t('common:text-login-otp-success'), {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    },
    onError: (data) => {
      toast.error(t('common:text-login-otp-error'), {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 1000,
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
