import { useMutation } from 'react-query';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import useWindowSize from '@utils/use-window-size';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';

export interface UpdateUserType {
  id?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNum?: string;
  avatar?: FileList;
  email?: string;
  password?: string;
  confirmPassword?: string;
  gender?: string;
  isShared?: boolean;
  is2FA?: boolean;
  setAdsPerformance?: boolean;
}
async function updateUser(input: UpdateUserType) {
  let userCookie: string = Cookies.get('user')!;
  const {
    id,
    username,
    avatar,
    is2FA,
    isShared,
    password,
    email,
    ...postInput
  } = input;
  let res;

  res = await http1.put(`${API_ENDPOINTS.UPDATE_CUSTOMER}/${id}`, {
    ...postInput,
    username: JSON.parse(userCookie).username === username ? null : username,
    email: JSON.parse(userCookie).email === email ? null : email,
    is2FA: is2FA ? 1 : 0,
    isShared: isShared ? 1 : 0,
  });

  if (avatar && avatar.length !== 0) {
    const formData: any = new FormData();
    formData.append('image', avatar);

    res = await http1.put(
      `${API_ENDPOINTS.UPLOAD_AVATAR_CUSTOMER}/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
  }
  return {
    data: res.data.payload,
    message: res.data.message,
    status: res.data.status,
  };
}
export const useUpdateUserMutation = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: UpdateUserType) => updateUser(input), {
    onSuccess: (data) => {
      Cookies.set('user', JSON.stringify(data.data));
      toast.success(t('common:text-update-user-success'), {
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
    onError: (data: any) => {
      toast.error(t('common:text-update-user-error'), {
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
