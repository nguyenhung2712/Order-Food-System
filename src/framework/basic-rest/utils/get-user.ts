import Cookies from 'js-cookie';

export const getUser = () => {
  if (typeof window === undefined) {
    return null;
  }
  return JSON.parse(Cookies.get('user') as string);
};
