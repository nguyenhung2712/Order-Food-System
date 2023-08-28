import Heading from '@components/ui/heading';
import Image from '@components/ui/image';
import Link from '@components/ui/link';
import { LinkProps } from 'next/link';
import Text from '@components/ui/text';
import { useTranslation } from 'next-i18next';
import { collectionPlaceholder } from '@assets/placeholders';

interface Props {
  imgWidth?: number | string;
  imgHeight?: number | string;
  href: LinkProps['href'];
  collection?: any /* {
        image: string;
        title: string;
        description?: string;
    }; */;
}

const CollectionCard: React.FC<Props> = ({
  collection,
  imgWidth = 440,
  imgHeight = 280,
  href,
}) => {
  /* const { image, title, description } = collection; */
  const placeholderImage = `/assets/images/viet-blog-3.jpg`;
  const { header, content } = collection;
  const { t } = useTranslation('common');

  function getImageUrl(): string {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let arrayRes: Array<string> = [];
    collection.content.replace(urlRegex, function (url: any) {
      arrayRes.push(url.slice(0, url.length - 1));
    });
    return arrayRes[0];
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-md shadow-card "
    >
      <Image
        src={getImageUrl() ?? collectionPlaceholder}
        alt={header || t('text-card-thumbnail')}
        width={imgWidth}
        height={imgHeight}
        className="bg-skin-thumbnail object-cover transform transition duration-300 ease-in-out group-hover:opacity-90 group-hover:scale-105"
      />
      <div className="px-4 lg:px-5 xl:px-6 pt-4 lg:pt-5 pb-4 md:pb-5 lg:pb-6 xl:pb-7 flex flex-col">
        <Heading
          variant="title"
          className="mb-1 lg:mb-1.5 truncate group-hover:color-skin-primary"
        >
          {header}
        </Heading>
      </div>
      <hr />
    </Link>
  );
};

export default CollectionCard;
