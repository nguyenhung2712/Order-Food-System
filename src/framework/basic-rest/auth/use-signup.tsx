import { useModalAction } from '@components/common/modal/modal.context';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import useWindowSize from '@utils/use-window-size';
import Cookies from 'js-cookie';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../../utils/firebase';

const addDocument = async (collectionName: any, data: any) => {
  const collectionRef = collection(db, collectionName);
  const now = new Date();
  const createdAt = Timestamp.fromDate(now);
  await addDoc(collectionRef, {
    ...data,
    createdAt,
  });
};

export interface SignUpInputType {
  email: string;
  password: string;
  confPassword: string;
  firstName: string;
  lastName: string;
  remember_me: boolean;
}
async function signUp(input: SignUpInputType) {
  let { remember_me, confPassword, ...postInput } = input;
  const { data } = await http1.post(`${API_ENDPOINTS.REGISTER}`, {
    ...postInput,
  });
  const staffRes = await http1.get(API_ENDPOINTS.STAFFS);

  return {
    data: data.payload,
    staffs: staffRes.data.payload,
  };
}
export const useSignUpMutation = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  const { openModal } = useModalAction();

  return useMutation((input: SignUpInputType) => signUp(input), {
    onSuccess: (data) => {
      toast.success(t('common:text-register-success'), {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      /* Cookies.set('id', data.data.id);
            Cookies.set('email', data.data.email); */
      addDocument('rooms', {
        avatar: data.data.avatar,
        name: data.data.firstName + ' ' + data.data.lastName,
        userId: data.data.id,
        staffs: data.staffs.map((staff: any) => staff.id),
      });
      openModal('OTP_VIEW', { id: data.data.id, email: data.data.email });
    },
    onError: (data) => {
      toast.error(t('common:text-register-error'), {
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
