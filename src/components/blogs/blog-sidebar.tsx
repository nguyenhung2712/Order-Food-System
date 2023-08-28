import { useState, useEffect } from 'react';
import Image from 'next/image';
import Text from '@components/ui/text';
import { ROUTES } from '@utils/routes';
import { useRouter } from 'next/router';
import {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  FacebookIcon,
  LinkedinIcon,
  TwitterIcon,
} from 'react-share';
import Heading from '@components/ui/heading';
import { useTranslation } from 'next-i18next';
import { useCart } from '@contexts/cart/cart.context';
import { Customer } from '@framework/types';
import Cookies from 'js-cookie';

interface BlogSidebarProps {
  data: any;
}

const BlogSidebar: React.FC<BlogSidebarProps> = ({ data }) => {
  const router = useRouter();
  const [user, setUser] = useState<Customer | undefined>();
  const [descriptionState, setDescriptionState] = useState(Boolean(false));
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.SHOPS}/${router.query.slug}`;
  const { t } = useTranslation('common');
  const descriptionHandel = () => {
    return setDescriptionState(true);
  };
  useEffect(() => {
    setUser(
      Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null
    );
  }, []);
  return (
    <div className="flex flex-col pt-10 lg:pt-8 px-6">
      <div className="text-center w-full border-b border-gray-base pb-4 px-2 sm:px-8 lg:px-0 2xl:px-7">
        <Heading variant="titleLarge" className="">
          Người viết
        </Heading>
      </div>
      <div className="flex items-center justify-center text-center w-full border-b border-gray-base pb-8 pt-6 px-5 sm:px-8 lg:px-0 2xl:px-7">
        <div className="">
          <Image
            src={data!.user.avatar}
            alt={data?.user.id}
            width={50}
            height={50}
            className="rounded-full cursor-pointer"
            objectFit="cover"
            onClick={() => {
              if (data?.user.id === user?.id) {
                router.push(ROUTES.ACCOUNT_SETTING);
              } else {
                router.push(`${ROUTES.ACCOUNT_DETAILS}/${data?.user.id}`);
              }
            }}
          />
        </div>
        <div
          className="cursor-pointer flex flex-col "
          onClick={() => {
            if (data?.user.id === user?.id) {
              router.push(ROUTES.ACCOUNT_SETTING);
            } else {
              router.push(`${ROUTES.ACCOUNT_DETAILS}/${data?.user.id}`);
            }
          }}
        >
          <Heading variant="base" className="ml-2.5">
            {data?.user.firstName + ' ' + data?.user.lastName}
          </Heading>
          <h5>12 bài viết</h5>
        </div>
        {/* <Text variant="small">
                    {descriptionState === true ? (
                        data?.description
                    ) : data?.description.split(' ').length >= 13 ? (
                        <>
                            {data?.description.split(' ').slice(0, 13).join(' ')}
                            {'..'}
                            <span
                                role="button"
                                className="text-skin-primary ms-0.5 font-semibold block hover:text-skin-muted"
                                onClick={descriptionHandel}
                            >
                                {t('text-read-more')}
                            </span>
                        </>
                    ) : (
                        data?.description
                    )}
                </Text> */}
        {/* <div className="flex items-center flex-wrap justify-center space-s-2 pt-4 mt-0.5">
                    <FacebookShareButton url={shareUrl}>
                        <FacebookIcon
                            size={25}
                            round
                            className="transition-all hover:opacity-90"
                        />
                    </FacebookShareButton>
                    <TwitterShareButton url={shareUrl}>
                        <TwitterIcon
                            size={25}
                            round
                            className="transition-all hover:opacity-90"
                        />
                    </TwitterShareButton>
                    <LinkedinShareButton url={shareUrl}>
                        <LinkedinIcon
                            size={25}
                            round
                            className="transition-all hover:opacity-90"
                        />
                    </LinkedinShareButton>
                </div> */}
      </div>

      {/* <div className="space-y-6 py-7">
                <div className="flex items-start">
                    <div className="flex-shrink-0 w-10">
                        <IoLocationOutline className="text-2xl text-skin-muted text-opacity-60" />
                    </div>
                    <div className="-mt-1">
                        <h4 className="text-skin-base font-medium text-15px mb-1">
                            {t('text-address')}:
                        </h4>
                        <Text>
                            {address ? (
                                router.locale === 'vi' ? (
                                    address.address.address +
                                    ', ' +
                                    address.address.ward.fullname +
                                    ' - ' +
                                    address.address.district.fullname +
                                    ' - ' +
                                    address.address.province.fullname
                                ) : (
                                    address.address.addressEn +
                                    ' Street, ' +
                                    address.address.ward.fullnameEn +
                                    ' - ' +
                                    address.address.district.fullnameEn +
                                    ' - ' +
                                    address.address.province.fullnameEn
                                )
                            ) : router.locale === 'vi' ? (
                                <i>Người dùng chưa cung cấp</i>
                            ) : (
                                <i>User hasn't provided</i>
                            )}
                        </Text>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="flex-shrink-0 w-10">
                        <IoCallOutline className="text-2xl text-skin-muted text-opacity-60" />
                    </div>
                    <div className="-mt-1">
                        <h4 className="text-skin-base font-medium text-15px mb-1">
                            {t('text-phone-number')}:
                        </h4>
                        <Text>
                            {data.user.phoneNumber ? (
                                data.user.phoneNumber
                            ) : router.locale === 'vi' ? (
                                <i>Người dùng chưa cung cấp</i>
                            ) : (
                                <i>User hasn't provided</i>
                            )}
                        </Text>
                    </div>
                </div>
            </div> */}
    </div>
  );
};

export default BlogSidebar;
