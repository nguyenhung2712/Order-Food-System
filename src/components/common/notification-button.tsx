/* import { useNotification } from '@contexts/notification/notification.context'; */
import { useUI } from '@contexts/ui.context';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import AccountNotificationIcon from '@components/icons/account-notification';
import { useMemo, useEffect, useState } from 'react';
import useFirestore from '@utils/use-firestore';
import { Customer } from '@framework/types';
import Cookies from 'js-cookie';

type NotificationButtonProps = {
  className?: string;
  iconClassName?: string;
  hideLabel?: boolean;
  isShowing?: boolean;
};

const NotificationButton: React.FC<NotificationButtonProps> = ({
  className,
  iconClassName = 'text-skin-base text-opacity-40',
  hideLabel,
  isShowing,
}) => {
  const [user, setUser] = useState<Customer | undefined>();
  const [unreadTotal, setUnreadTotal] = useState(0);
  const { t } = useTranslation('common');
  const { openDrawer, setDrawerView } = useUI();

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
    if (notifications) {
      setUnreadTotal(
        notifications.filter(
          (notification: any) => !notification.readBy.includes(user?.id)
        ).length
      );
    }
  }, [notifications, user?.id]);
  useEffect(() => {
    setUser(
      Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null
    );
  }, []);

  function handleNotificationOpen() {
    setDrawerView('NOTIFICATION_SIDEBAR');
    isShowing;
    return openDrawer();
  }

  return (
    <button
      className={cn(
        'flex items-center justify-center flex-shrink-0 h-auto focus:outline-none transform',
        className
      )}
      onClick={handleNotificationOpen}
      aria-label="notification-button"
    >
      <p className="flex items-center relative">
        <AccountNotificationIcon className={cn(iconClassName)} />
        {unreadTotal > 0 && (
          <span className="cart-counter-badge flex items-center justify-center bg-skin-primary text-skin-inverted absolute -top-2.5 start-2.5 rounded-full font-bold">
            {unreadTotal > 9 ? '9+' : unreadTotal}
          </span>
        )}
      </p>
      {!hideLabel && (
        <span className="text-sm lg:text-15px text-skin-base font-normal ms-2">
          {t('text-notification')}
        </span>
      )}
    </button>
  );
};

export default NotificationButton;
