import Container from '@components/ui/container';
import { ROUTES } from '@utils/routes';
import AccountNav from './account-nav';
import AccountNavMobile from './account-nav-mobile';
import SettingsIcon from '@components/icons/account-settings';
import AccountNoticeIcon from '@components/icons/account-notice';

const AccountLayout: React.FunctionComponent<{}> = ({ children }) => {
  const accountMenu = [
    {
      slug: ROUTES.ACCOUNT_DETAILS,
      name: 'account-details',
      icon: <SettingsIcon className="w-5 md:w-[22px] h-5 md:h-[22px]" />,
    },
    {
      slug: ROUTES.ACCOUNT_BLOGS,
      name: 'text-blogs',
      icon: <AccountNoticeIcon className="w-5 md:w-[22px] h-5 md:h-[22px]" />,
    },
  ];
  return (
    <div className="border-t border-b border-skin-base">
      <Container>
        <div className="pt-10 2xl:pt-12 pb-12 lg:pb-14 xl:pb-16 2xl:pb-20 xl:max-w-screen-xl 2xl:max-w-[1300px] mx-auto">
          <div className="flex flex-col lg:flex-row w-full">
            <div className="lg:hidden">
              <AccountNavMobile options={accountMenu} />
            </div>
            <div className="hidden lg:block flex-shrink-0 w-80 xl:w-[385px] me-7 xl:me-8">
              <AccountNav options={accountMenu} />
            </div>

            <div className="w-full mt-4 lg:mt-0 border border-skin-base p-4 sm:p-5 lg:py-8 2xl:py-10 lg:px-9 2xl:px-12 rounded-md">
              {children}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default AccountLayout;
