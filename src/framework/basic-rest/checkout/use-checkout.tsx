import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import { useTranslation } from 'next-i18next';
import Cookies from 'js-cookie';
import { CartItem } from '@framework/types';
import Router, { useRouter } from 'next/router';
import { ROUTES } from '@utils/routes';
import { nanoid } from 'nanoid';
import { useCart } from '@contexts/cart/cart.context';

import { collection, addDoc, Timestamp, arrayUnion } from 'firebase/firestore';
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

export interface CheckoutInputType {
  addressId?: string;
  predictDate?: Date;
  paymentTotal?: number;
  items?: CartItem[];
  note?: string;
}

async function checkout(input: CheckoutInputType) {
  const user = JSON.parse(Cookies.get('user') as string);
  const cart = JSON.parse(Cookies.get('cart') as string);
  const date = new Date();
  let dateId =
    date.getFullYear() +
    '' +
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    '' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
  const staffRes = await http1.get(API_ENDPOINTS.STAFFS);
  const orderRes = await http1.post(API_ENDPOINTS.CREATE_ORDER, {
    payment: { paymentTotal: input.paymentTotal },
    addressId: input.addressId,
    userId: user.id,
    email: user.email,
    predictDate: input.predictDate,
    number: dateId + nanoid(4).toUpperCase(),
    note: '',
  });
  input.items &&
    input.items.forEach(async (item) => {
      await http1.post(API_ENDPOINTS.CREATE_ORDER_DETAIL, {
        orderId: orderRes.data.payload.id,
        dishId: item.product.id,
        price: item.product.price,
        quantity: item.quantity,
      });
    });
  /* await http1.delete(`${API_ENDPOINTS.CLEAR_CART_ITEMS}/${cart.id}`); */
  await http1.get(`${API_ENDPOINTS.CHECKOUT}/${orderRes.data.payload.id}`);

  return {
    status: orderRes.data.status,
    message: orderRes.data.message,
    payload: orderRes.data.payload,
    user,
    staffs: staffRes.data.payload,
  };
}

export const useCheckoutMutation = () => {
  const { t } = useTranslation();
  const { width } = useWindowSize();
  return useMutation((input: CheckoutInputType) => checkout(input), {
    onSuccess: (data) => {
      toast.success(t('common:text-checkout-success'), {
        position: width! > 768 ? 'bottom-right' : 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      addDocument('notifications', {
        image: null,
        message: `Khách hàng ${
          data.user.firstName + ' ' + data.user.lastName
        } đã đặt dơn có mã ${data.payload.number}`,
        readBy: [],
        receivedId: data.staffs.map((staff: any) => staff.id),
        staffPath: `/order/${data.payload.id}`,
        title: 'Đơn hàng được đặt',
      }).then((res) => {
        Router.push({ pathname: ROUTES.ORDER, query: { id: data.payload.id } });
      });
    },
    onError: (data) => {
      toast.error(t('common:text-checkout-error'), {
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
