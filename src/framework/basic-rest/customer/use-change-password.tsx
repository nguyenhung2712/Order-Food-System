import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { useModalAction } from '@components/common/modal/modal.context';

export interface ChangePasswordInputType {
  id: string;
  newPassword?: string;
  oldPassword?: string;
  isResetPass?: boolean;
}
async function changePassword(input: ChangePasswordInputType) {
  const { id, ...postInput } = input;
  const res = await http1.put(`${API_ENDPOINTS.CHANGE_PASSWORD}/${id}`, {
    ...postInput,
  });
  return {
    status: res.data.status,
    message: res.data.message,
    isResetPass: input.isResetPass,
  };
}
export const useChangePasswordMutation = () => {
  const { openModal } = useModalAction();
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation(
    (input: ChangePasswordInputType) => changePassword(input),
    {
      onSuccess: (data) => {
        toast.success(t('common:text-update-password-success'), {
          position: width! > 768 ? 'bottom-right' : 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
        if (data.isResetPass) {
          openModal('LOGIN_VIEW');
        }
      },
      onError: (data: any) => {
        toast.error(t('common:text-update-password-error'), {
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
    }
  );
};
