import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import { appWithTranslation } from 'next-i18next';
import { useUI } from '@contexts/ui.context';
import Cookies from 'js-cookie';
import useWindowSize from '@utils/use-window-size';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import firebase, { uiConfig } from '@utils/firebase';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import 'react-toastify/dist/ReactToastify.css';
import { useModalAction } from '@components/common/modal/modal.context';

import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../utils/firebase';

const addDocument = async (collectionName: any, data: any) => {
    const collectionRef = collection(db, collectionName);
    const now = new Date();
    const createdAt = Timestamp.fromDate(now);
    await addDoc(collectionRef, {
        ...data,
        createdAt,
    });
};

const Temp = ({ children }: any) => {
    const router = useRouter();
    const { unauthorize, authorize, isAuthorized } = useUI();
    const { t } = useTranslation();
    const { width } = useWindowSize();
    const { openModal } = useModalAction();

    useEffect(() => {
        const userCookie = Cookies.get('user');
        if (userCookie) {
            /* toast.success(t('common:text-welcome-back'), {
                position: width! > 768 ? 'bottom-right' : 'top-right',
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: 'colored',
            }); */
        } /* else {
            openModal("LOGIN_VIEW");
        } */
        if (isAuthorized) {
        }
        const unregisterAuthObserver = firebase
            .auth()
            .onAuthStateChanged(async (user) => {
                if (userCookie) {
                    return;
                }
                if (!!user) {
                    let name = user.displayName?.split(' ');
                    let lastName = name?.pop();
                    let firstName = name?.join(' ');
                    const { data } = await http1.post(API_ENDPOINTS.CUSTOMER_BY_GOOGLE, {
                        email: user.email,
                        avatar: user.photoURL,
                        phoneNum: user.phoneNumber,
                        lastName,
                        firstName,
                        isActived: user.emailVerified,
                    });
                    let { Cart, ...remains } = data.payload;
                    let createdAt: Date = new Date(remains.createdAt);
                    let curDate: Date = new Date();
                    if (Math.abs(curDate.getTime() - createdAt.getTime()) < 20000) {
                        const staffRes = await http1.get(API_ENDPOINTS.STAFFS);
                        await addDocument('rooms', {
                            avatar: remains.avatar,
                            name: remains.firstName + ' ' + remains.lastName,
                            userId: remains.id,
                            staffs: staffRes.data.payload.map((staff: any) => staff.id),
                        });
                    }
                    user.getIdToken().then((accessToken) => {
                        Cookies.set('auth_token', accessToken, { expires: 7 });
                    });
                    Cookies.set('refresh_token', user.refreshToken, { expires: 7 });
                    Cookies.set('user', JSON.stringify(remains), { expires: 7 });
                    Cookies.set('cart', JSON.stringify(Cart), { expires: 7 });
                    authorize();
                } else {
                    unauthorize();
                }
            });
        return () => unregisterAuthObserver();
    }, [authorize, isAuthorized, t, unauthorize, width]);

    return <div>{children}</div>;
};

export default Temp;
