import { useTranslation } from 'next-i18next';
import Link from '@components/ui/link';
import Image from '@components/ui/image';
import { ROUTES } from '@utils/routes';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import parse from 'html-react-parser';
import { useRouter } from 'next/router';
import { useUpdateBlogMutation } from '@framework/blog/update-blog';
import { generateLocaleDate } from '@utils/generate-locale-date';
import { BsEyeFill } from 'react-icons/bs';

type BlogCardProps = {
  blog?: any;
  className?: string;
};

const headerStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  lineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
};

const textStyle = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  lineClamp: 2,
  WebkitBoxOrient: 'vertical' as const,
};

const BlogCard: React.FC<BlogCardProps> = ({ blog, className }) => {
  const { t } = useTranslation();
  const { mutate: updateBlog, isLoading: isUpdateLoading } =
    useUpdateBlogMutation();
  const router = useRouter();
  const placeholderImage = `/assets/images/viet-blog-3.jpg`;
  const { header, slug, content, createdAt } = blog;
  var ctn = content.replace(/<img[^>]*>/g, '');
  const views = blog.Interacts.filter(
    (interact: any) => interact.type === 1
  ).length;

  function getImageUrl(): string {
    let urlRegex = /(https?:\/\/[^\s]+)/g;
    let arrayRes: Array<string> = [];
    blog.content.replace(urlRegex, function (url: any) {
      arrayRes.push(url.slice(0, url.length - 1));
    });
    return arrayRes[0];
  }
  return (
    <div
      className="relative flex items-center border border-skin-base rounded-lg shadow-blogCard cursor-pointer relative bg-white transition-all hover:shadow-blogCardHover pr-4"
      onClick={() => {
        router.push(ROUTES.BLOGS + '/' + blog.slug);
        /* updateBlog({ views: blog.views + 1, blogId: blog.id }); */
      }}
    >
      <div className="relative flex flex-shrink-0 items-center justify-center rounded-lg overflow-hidden w-52 xl:w-80 h-40 xl:h-44">
        <Image
          alt={t('common:text-logo')}
          src={getImageUrl() || placeholderImage}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <Link
        href={`${ROUTES.BLOGS}/${slug}`}
        className="px-5 xl:px-7 py-5 xl:py-7 w-full h-full"
      >
        <div className="flex flex-col ms-4 xl:ms-5">
          <Heading
            variant="mediumHeading"
            className="pb-1.5"
            style={headerStyle}
          >
            {header}
          </Heading>
          <Text className="xl:leading-6" style={textStyle}>
            <span dangerouslySetInnerHTML={{ __html: ctn }}></span>
            {/* {textContent(contentElement as React.ReactElement)} */}
          </Text>
        </div>
      </Link>
      <div className="flex items-center absolute bottom-1 right-32">
        <BsEyeFill className="inline" />
        <span className="inline-block text-sm w-2 mx-1">{views}</span>
      </div>
      <h4 className="absolute bottom-1 right-2">
        {generateLocaleDate(createdAt, router.locale)}
      </h4>
    </div>
  );
};

export default BlogCard;
