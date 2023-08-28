import { useShopQuery } from '@framework/shop/get-shop';
import Text from '@components/ui/text';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useUI } from '@contexts/ui.context';
import { getDirection } from '@utils/get-direction';
import { Element } from 'react-scroll';
import Container from '@components/ui/container';
import { Drawer } from '@components/common/drawer/drawer';
import ShopSidebar from '@components/shops/shop-sidebar';
import ShopSidebarDrawer from '@components/shops/shop-sidebar-drawer';
import AllProductFeed from '@components/product/feeds/all-products-feed';
import { useTranslation } from 'next-i18next';
import useWindowSize from '@utils/use-window-size';
import { useBlogQuery } from '@framework/blog/get-blog';
import BlogSidebar from './blog-sidebar';
import parse from 'html-react-parser';
import { useCommentsQuery } from '@framework/comment/get-comments';
import Heading from '@components/ui/heading';
import CommentForm from '@components/common/form/comment-form';
import PageHeroSection from '@components/ui/page-hero-section';
import { AiFillLike } from 'react-icons/ai';
import { BiCommentDetail } from 'react-icons/bi';
import { BsEyeFill } from 'react-icons/bs';
import { useState, useRef, useEffect, Fragment } from 'react';
import { useCart } from '@contexts/cart/cart.context';
import CommentBox from '@components/common/comment-box';
import RepCommentBox from '@components/common/repcomment-box';
import Button from '@components/ui/button';
import { Comment, Customer } from '@framework/types';
import { useInteractBlogMutation } from '@framework/blog/use-interact-blog';
import { LoadingScreen } from '@components/common/loading-screen';
import Cookies from 'js-cookie';
import { ROUTES } from '@utils/routes';
import ListBox from '@components/ui/form/select-box';
import { CgCornerDownRight } from 'react-icons/cg';
import { useModalAction } from '@components/common/modal/modal.context';
import { useUpdateBlogMutation } from '@framework/blog/update-blog';
/* import ReactEmoji from 'react-emoji'; */
import Breadcrumb from '@components/ui/breadcrumb';
import { generateLocaleDate } from '@utils/generate-locale-date';

const BlogDetails: React.FC = () => {
  const router = useRouter();
  const { temp } = useCart();
  const { openModal } = useModalAction();
  const [user, setUser] = useState<Customer | undefined>();
  const repCommentRef = useRef<(HTMLDivElement | null)[]>([]);
  const repBtnRef = useRef<HTMLButtonElement>(null);
  const [isOpenComment, setOpenComment] = useState<boolean>(false);

  const {
    query: { slug },
  } = useRouter();
  const { t } = useTranslation('common');
  const {
    data: blog,
    isLoading: isBlogLoading,
    refetch: blogRefetch,
  } = useBlogQuery(slug as string);
  const { query } = useRouter();
  const {
    data: comments,
    isLoading: isCommentLoading,
    refetch: commentRefetch,
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    error,
  } = useCommentsQuery({ query: { ...query, id: blog?.id } });
  const { mutate: interact, isLoading: isInteractLoading } =
    useInteractBlogMutation();
  const { locale } = useRouter();
  const dir = getDirection(locale);

  const contentWrapperCSS = dir === 'ltr' ? { left: 0 } : { right: 0 };

  useEffect(() => {
    setUser(
      Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null
    );
  }, []);

  useEffect(() => {
    blogRefetch();
    commentRefetch();
  }, [temp, blogRefetch, commentRefetch]);

  function handleLikeBlog() {
    interact({ blogId: blog.id, type: 1 });
  }

  function handleRepBlog() {
    setOpenComment((prev) => !prev);
  }

  if (isBlogLoading) return <LoadingScreen size={45} />;
  return (
    <>
      <PageHeroSection
        heroTitle="text-blog-page"
        backgroundThumbnail="/assets/images/shop-page-hero-bg.jpg"
        mobileBackgroundThumbnail="/assets/images/shop-page-hero-mobile-bg.png"
        variant="white"
      />
      <div className="flex lg:hidden items-center px-4 md:px-6 py-4 border-b border-skin-base mb-7">
        <div className="flex flex-shrink-0">
          <Image
            src={blog?.user.avatar}
            alt={blog?.user.id}
            width={66}
            height={66}
            className="rounded-full cursor-pointer"
            objectFit="cover"
            onClick={() => {
              if (blog?.user.id === user?.id) {
                router.push(ROUTES.ACCOUNT_SETTING);
              } else {
                router.push(`${ROUTES.ACCOUNT_DETAILS}/${blog?.user.id}`);
              }
            }}
          />
        </div>
        <div className="ps-4">
          <h2
            className="text-skin-base text-15px font-semibold cursor-pointer"
            onClick={() => {
              if (blog?.user.id === user?.id) {
                router.push(ROUTES.ACCOUNT_SETTING);
              } else {
                router.push(`${ROUTES.ACCOUNT_DETAILS}/${blog?.user.id}`);
              }
            }}
          >
            {blog?.user.firstName + ' ' + blog?.user.lastName}
          </h2>
        </div>
      </div>
      <Container>
        <Element
          name="grid"
          className="flex flex-col lg:flex-row lg:pt-8 pb-4 lg:pb-10 border-b"
        >
          <div className="flex-shrink-0 hidden lg:block lg:w-80 xl:w-[350px] 2xl:w-96 lg:sticky lg:top-16 category-mobile-sidebar">
            <div className="border border-[#EFF2F4] shadow-vendorSidebar rounded-lg">
              <BlogSidebar data={blog} />
            </div>
          </div>

          <div className="w-full lg:ps-7">
            <div className="text-center text-3xl font-bold mb-16">
              {blog?.header}
            </div>
            <div className="lg:ps-7">
              {generateLocaleDate(blog.createdAt, locale, true) +
                ' - ' +
                blog.Interacts.filter((interact: any) => interact.type === 1)
                  .length +
                ' ' +
                t('text-views')}
            </div>
            <div
              className="lg:ps-7 mt-4"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
          </div>
        </Element>

        <div className="flex flex-col lg:flex-row pb-4 lg:pb-10 pt-4">
          <div className="flex-shrink-0 hidden lg:block lg:w-80 xl:w-[350px] 2xl:w-96 lg:sticky lg:top-16 category-mobile-sidebar"></div>
          <div className="w-full lg:ps-7">
            <div
              className={`flex justify-between ${!isOpenComment ? 'mb-3' : ''}`}
            >
              <div>
                <button
                  className="bg-[#F0F0F0] hover:bg-[#D6D3D1] font-bold py-1 px-3 rounded me-3 text-xl"
                  onClick={handleLikeBlog}
                >
                  <span /* className={blog.InteractBlogs.some((interact: any) => interact.user.id === user?.id && interact.status === 1) ? "text-[#10B981]" : ""} */
                  >
                    <AiFillLike className="inline" />{' '}
                  </span>
                  <span className="inline-block text-sm w-2">
                    {
                      blog.Interacts.filter(
                        (interact: any) =>
                          interact.type === 1 && interact.status === 1
                      ).length
                    }
                  </span>
                </button>
                <button
                  className="bg-[#F0F0F0] hover:bg-[#D6D3D1] font-bold py-1 px-3 rounded me-3 text-xl"
                  ref={repBtnRef}
                  onClick={handleRepBlog}
                >
                  <span>
                    {' '}
                    <BiCommentDetail />{' '}
                  </span>
                </button>
              </div>
              <ListBox
                options={[
                  { name: 'text-newest', value: 'newest' },
                  { name: 'text-oldest', value: 'oldest' },
                ]}
              />
            </div>
            {isOpenComment && (
              <>
                {user ? <CommentForm blog={blog} className="mb-3" /> : ''}
                <div className="border-t border-b mt-5">
                  {comments?.pages?.map((page: any) => {
                    return page?.data.map((comment: Comment, index: any) => {
                      let cmtCondition = user
                        ? comment.Interacts &&
                          comment.Interacts.every(
                            (interact: any) =>
                              user?.id !== interact.userId ||
                              interact.type !== 0
                          )
                        : true;
                      return cmtCondition ? (
                        <div
                          key={index}
                          className="border-b border-skin-base last:border-0 last:mb-0"
                        >
                          <div className="pb-1 mb-1 last:mb-0">
                            {comment && <CommentBox comment={comment} />}
                          </div>
                          {comment.CommentReps &&
                            comment.CommentReps.length > 0 && (
                              <>
                                <span
                                  onClick={function (event) {
                                    repCommentRef.current[
                                      index
                                    ]?.classList.remove('hidden');
                                    (event.target as HTMLElement).classList.add(
                                      'hidden'
                                    );
                                  }}
                                >
                                  <Text className="text-xs pb-1 mb-1 last:mb-0 pl-10 hover:underline cursor-pointer">
                                    <CgCornerDownRight className="inline" />{' '}
                                    Show all
                                  </Text>
                                </span>
                                <div
                                  ref={(el) =>
                                    (repCommentRef.current[index] = el)
                                  }
                                  className="hidden"
                                >
                                  {comment.CommentReps.map((rep, index) => {
                                    let repCondition = user
                                      ? rep.Interacts &&
                                        rep.Interacts.every(
                                          (interact: any) =>
                                            user?.id !== interact.userId ||
                                            interact.type !== 0
                                        )
                                      : true;
                                    return repCondition ? (
                                      <div
                                        className="pb-1 mb-1 last:mb-0 pl-10"
                                        key={index}
                                      >
                                        {rep && (
                                          <RepCommentBox
                                            comment={comment}
                                            rep={rep}
                                          />
                                        )}
                                      </div>
                                    ) : (
                                      <Fragment key={index}></Fragment>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                        </div>
                      ) : (
                        <Fragment key={index}></Fragment>
                      );
                    });
                  })}
                </div>
                {hasNextPage && (
                  <div className="text-center pt-8 xl:pt-10">
                    <Button
                      loading={loadingMore}
                      disabled={loadingMore}
                      onClick={() => fetchNextPage()}
                    >
                      {t('button-load-more')}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};

export default BlogDetails;
