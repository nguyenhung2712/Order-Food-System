import Scrollbar from '@components/ui/scrollbar';
import { useUI } from '@contexts/ui.context';
import { useRouter } from 'next/router';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import { useTranslation } from 'next-i18next';
import { IoClose } from 'react-icons/io5';
import { BsThreeDots, BsCheckLg } from 'react-icons/bs';
import { FaComment } from 'react-icons/fa';
import { Fragment, useEffect, useState, useMemo } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { CiSquareRemove } from 'react-icons/ci';
import { db } from '../../utils/firebase';
import {
    getDocs,
    collection,
    query,
    updateDoc,
    where,
    arrayUnion,
    doc,
    arrayRemove,
    writeBatch,
} from 'firebase/firestore';
import useFirestore from '@utils/use-firestore';
import Cookies from 'js-cookie';
import { Customer } from '@framework/types';
import Image from 'next/image';

const NotificationDrawer: React.FC = () => {
    const [user, setUser] = useState<Customer | undefined>();
    const { t } = useTranslation('common');
    const { data, closeDrawer } = useUI();
    const router = useRouter();
    const notificationCondition = useMemo(
        () => ({
            fieldName: 'receivedId',
            operator: 'array-contains',
            compareValue: user?.id,
        }),
        [user]
    );
    const notifications = useFirestore('notifications', notificationCondition);

    useEffect(() => {
        setUser(
            Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null
        );
    }, []);

    const handleReadNotification = async (notifyId: string, userId: string) => {
        const docRef = doc(db, 'notifications', notifyId);

        await updateDoc(docRef, {
            readBy: arrayUnion(userId),
        });
    };

    const handleUnreadNotification = async (notifyId: string, userId: string) => {
        const docRef = doc(db, 'notifications', notifyId);

        await updateDoc(docRef, {
            readBy: arrayRemove(userId),
        });
    };

    const handleReadAll = async (userId: string) => {
        const notificationRef = collection(db, 'notifications');
        const querySnapshot = await getDocs(
            query(notificationRef, where('receivedId', 'array-contains', user?.id))
        );

        const batch = writeBatch(db);
        querySnapshot.forEach((doc) => {
            batch.update(doc.ref, { readBy: arrayUnion(userId) });
        });

        await batch.commit();
    };

    async function handleRemoveNotification(notifyId: string, userId: string) {
        const docRef = doc(db, 'notifications', notifyId);

        await updateDoc(docRef, {
            receivedId: arrayRemove(userId),
        });
    }

    return (
        <div className="flex flex-col w-full h-full">
            <div className="w-full flex justify-between items-center relative ps-5 md:ps-7 border-b border-skin-base">
                <Heading variant="titleMedium">{t('text-notification')}</Heading>
                <div className="flex items-center">
                    {/* {!isEmpty && (
                        <button
                            className="flex flex-shrink items-center text-15px transition duration-150 ease-in focus:outline-none text-skin-base opacity-50 hover:opacity-100 -me-1.5"
                            aria-label={t('text-clear-all')}
                            onClick={resetCart}
                        >
                            <DeleteIcon />
                            <span className="ps-1">{t('text-clear-all')}</span>
                        </button>
                    )} */}
                    <Menu
                        as="div"
                        className="relative inline-block text-left"
                        style={{ zIndex: 10000 }}
                    >
                        <div>
                            <Menu.Button className="flex text-2xl items-center justify-center pr-1 pl-4 md:pl-6 md:pr-1 py-6 lg:py-7 focus:outline-none transition-opacity text-skin-base hover:opacity-60">
                                <BsThreeDots />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1 ">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                className={`${active
                                                    ? 'bg-skin-primary text-white'
                                                    : 'text-gray-900'
                                                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                onClick={() => handleReadAll(user!.id)}
                                            >
                                                <BsCheckLg style={{ marginRight: '10px' }} /> Mark as
                                                read all
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                    <button
                        className="flex text-2xl items-center justify-center px-4 md:px-6 py-6 lg:py-7 focus:outline-none transition-opacity text-skin-base"
                        onClick={closeDrawer}
                        aria-label="close"
                    >
                        <IoClose />
                    </button>
                </div>
            </div>
            <Scrollbar className="cart-scrollbar w-full flex-grow">
                <ul className="w-full px-5 md:px-7 divide-y divide-gray-200">
                    {notifications?.map((notification: any) => (
                        <li
                            className="py-4 pr-12 relative cursor-pointer"
                            onClick={() => {
                                handleReadNotification(notification.id, user!.id);
                                /* router.push(`/${notification.userPath}`); */
                            }}
                            key={notification.id}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 relative">
                                    <Image
                                        width={60}
                                        height={60}
                                        className="h-16 w-16 rounded-full"
                                        src={
                                            'https://res.cloudinary.com/duijwi8od/image/upload/v1680861867/DATN_Images_Project/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg'
                                        }
                                        alt=""
                                    />
                                    <span className="-bottom-1 left-11 absolute flex items-center justify-center w-8 h-8 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full">
                                        <FaComment size={12} color="#fff" />
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="mb-2 text-sm font-medium text-gray-900">
                                        {notification.title}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {notification.message}
                                    </p>
                                </div>
                            </div>
                            <Menu
                                as="div"
                                className="absolute top-4 right-4 inline-block text-left"
                                style={{ zIndex: 10000 }}
                            >
                                <div>
                                    <Menu.Button className="flex text-2xl items-center justify-center pr-1 pl-4 md:pl-6 md:pr-1 py-6 lg:py-7 focus:outline-none transition-opacity text-skin-base hover:opacity-60">
                                        <BsThreeDots />
                                    </Menu.Button>
                                </div>
                                <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-100"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-75"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                >
                                    <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                        <div className="px-1 py-1 ">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`${active
                                                            ? 'bg-skin-primary text-white'
                                                            : 'text-gray-900'
                                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        onClick={() => {
                                                            if (!notification.readBy.includes(user?.id)) {
                                                                handleReadNotification(
                                                                    notification.id,
                                                                    user!.id
                                                                );
                                                            } else {
                                                                handleUnreadNotification(
                                                                    notification.id,
                                                                    user!.id
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        <BsCheckLg style={{ marginRight: '10px' }} />{' '}
                                                        {!notification.readBy.includes(user?.id)
                                                            ? 'Mark as read'
                                                            : 'Mark as unread'}
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                        <div className="px-1 py-1 ">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        className={`${active
                                                            ? 'bg-skin-primary text-white'
                                                            : 'text-gray-900'
                                                            } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                        onClick={() =>
                                                            handleRemoveNotification(
                                                                notification.id,
                                                                user!.id
                                                            )
                                                        }
                                                    >
                                                        <CiSquareRemove style={{ marginRight: '10px' }} />{' '}
                                                        Remove
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Transition>
                            </Menu>
                            {!notification.readBy.includes(user?.id) && (
                                <span className="top-10 -left-5 absolute  w-3.5 h-3.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
                            )}
                        </li>
                    ))}
                </ul>
            </Scrollbar>
            {/* {!isEmpty ? (
                <Scrollbar className="cart-scrollbar w-full flex-grow">
                    <div className="w-full px-5 md:px-7">
                        {data?.map((item) => (
                            <CartItem item={item} key={item.id} render={setIsRender} />
                        ))}
                    </div>
                </Scrollbar>
            ) : (
                <EmptyCart />
            )} */}
        </div>
    );
};

export default NotificationDrawer;
