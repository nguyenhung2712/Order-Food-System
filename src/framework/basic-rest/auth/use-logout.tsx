import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { useMutation } from 'react-query';
import useWindowSize from '@utils/use-window-size';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import firebase from '@utils/firebase';

export interface LoginInputType {
  email: string;
  password: string;
  remember_me: boolean;
}
async function logout() {
  return {
    ok: true,
    message: 'Logout Successful!',
  };
}
export const useLogoutMutation = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const { unauthorize } = useUI();

  return useMutation(() => logout(), {
    onSuccess: (_data) => {
      Cookies.remove('auth_token');
      Cookies.remove('refresh_token');
      if (Cookies.get('access_token')) {
        Cookies.remove('access_token');
      }
      Cookies.remove('user');
      Cookies.remove('cart');
      toast.success(t('common:text-logout-success'), {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      unauthorize();
      firebase.auth().signOut();
      Router.push('/');
    },
    onError: (data) => {
      console.log(data, 'logout error response');
    },
  });
};
