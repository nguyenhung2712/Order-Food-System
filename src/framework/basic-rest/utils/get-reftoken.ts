import Cookies from 'js-cookie';

export const getRefToken = () => {
  if (typeof window === undefined) {
    return null;
  }
  return Cookies.get('refresh_token');
};
