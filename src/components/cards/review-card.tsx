import type { FC } from 'react';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import StarIcon from '@components/icons/star-icon';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ROUTES } from '@utils/routes';
import RateOptsButton from '@components/ui/rate-button';
import Cookies from 'js-cookie';
import { generateDiffLocaleDate } from '@utils/generate-locale-date';

interface ReviewProps {
  item: any;
  className?: string;
}

const ReviewCard: FC<ReviewProps> = ({ item, className = '' }) => {
  const { t } = useTranslation('common');
  const user = Cookies.get('user')
    ? JSON.parse(Cookies.get('user') as string)
    : null;
  const router = useRouter();
  return (
    <div
      className={`relative flex justify-between items-center border-b border-skin-base last:border-0 pb-2 mb-6 last:mb-0 ${className}`}
    >
      <h5 style={{ fontSize: '14px' }} className="absolute top-0 right-0">
        {generateDiffLocaleDate(item.createdAt, 'vi')}
      </h5>
      <div>
        <div className="flex space-s-1 mb-3.5">
          {[...Array(5)].map((_, idx) => (
            <StarIcon
              key={idx}
              color={idx < item.score ? '#F3B81F' : '#DFE6ED'}
              className="w-3.5 lg:w-4 h-3.5 lg:h-4"
            />
          ))}
        </div>
        {/* <Heading className="mb-1.5">{item.title}</Heading> */}

        <div
          className="flex items-center text-skin-base text-opacity-80 text-sm pt-2 cursor-pointer"
          style={{ width: 'fit-content' }}
          onClick={() =>
            router.push(`${ROUTES.ACCOUNT_DETAILS}/${item.user.id}`)
          }
        >
          <Image
            src={item!.user.avatar}
            alt={`${item.user.lastName} Avatar`}
            width={33}
            height={33}
            className="rounded-full ms-5"
            objectFit="cover"
          />
          <span className="inline-block ms-[3px] font-semibold mx-2">
            {item.user.firstName + ' ' + item.user.lastName}
          </span>
        </div>
        <div>
          <Text className="xl:leading-[2em]">{item.remarks}</Text>
        </div>
      </div>
      {user && user.id === item.user.id && <RateOptsButton item={item} />}
    </div>
  );
};

export default ReviewCard;
