import { useShopsQuery } from '@framework/shop/get-shops';
import Alert from '@components/ui/alert';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import BlogCard from '@components/cards/blog-card';
import { useSortedBlogsQuery } from '@framework/blog/get-sorted-blogs';
import { Blog, Customer } from '@framework/types';
import { LoadingScreen } from '@components/common/loading-screen';
import Button from '@components/ui/button';
import ListBox from '@components/ui/form/select-box';
import { useRouter } from 'next/router';
import BlogActionsBtn from '@components/ui/blog-action.btn';
import Cookies from 'js-cookie';
import { useState, useEffect, Fragment } from 'react';
import { useCart } from '@contexts/cart/cart.context';
import { useBlogsQuery } from '@framework/blog/get-blogs';
import { BsSearch } from 'react-icons/bs';
import Input from '@components/ui/form/input';

const BlogsPageContent: React.FC = () => {
  const { t } = useTranslation('common');
  const [user, setUser] = useState<Customer | undefined>();
  const [filteredData, setFiltered] = useState<any>();
  const [isFiltered, setIsFiltered] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>('');
  const { temp } = useCart();
  const router = useRouter();
  const {
    data: blogs,
    isLoading: isBlogLoading,
    refetch: blogRefetch,
    isFetching: isLoading,
    isFetchingNextPage: loadingMore,
    fetchNextPage,
    hasNextPage,
    error,
  } = useSortedBlogsQuery({
    limit: 5,
    sort_by: router.query.sort_by as string,
  });
  const { data: allBlogs } = useBlogsQuery();
  useEffect(() => {
    setUser(
      Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null
    );
  }, []);
  useEffect(() => {
    blogRefetch();
  }, [temp, blogRefetch]);
  useEffect(() => {
    if (allBlogs) {
      let filteredData = allBlogs.filter(
        (blog: Blog) =>
          blog.status === 1 &&
          (blog.header.toLowerCase().indexOf(filterText) > -1 ||
            blog.content.toLowerCase().indexOf(filterText) > -1 ||
            blog.slug.split('-').join(' ').toLowerCase().indexOf(filterText) >
              -1)
      );
      setFiltered(filteredData);
    }
  }, [allBlogs, filterText]);

  function handleFilter(event: any) {
    setFilterText(event.target.value);
    setIsFiltered(event.target.value !== '' ? true : false);
  }

  if (isBlogLoading) return <LoadingScreen size={45} />;
  if (error) return <Alert message="Error" />;
  return (
    <div className="pt-10 lg:pt-12 xl:pt-14 pb-14 lg:pb-16 xl:pb-20 px-4 md:px-8">
      <div className="w-full xl:max-w-[1490px] mx-auto">
        <div className="flex justify-between">
          <Heading variant="titleLarge" className="mb-4 lg:mb-6">
            {t('text-all-blogs')}
          </Heading>

          <div className="flex">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="relative me-2"
            >
              <span className="absolute end-3 top-[85%] transform -translate-y-1/2 order-icon-color">
                <BsSearch size={17} />
              </span>
              <Input
                name="search"
                type="search"
                value={filterText}
                onChange={handleFilter}
                placeholder={t('text-search-blog')}
                className="h-full"
                inputClassName="h-full w-full placeholder-[rgba(0, 0, 0, .3)] bg-white border border-[#E3E8EC] rounded-md order-search focus:border-2 focus:outline-none focus:border-skin-primary"
              />
            </form>
            <ListBox
              options={[
                { name: 'text-newest', value: 'newest' },
                { name: 'text-oldest', value: 'oldest' },
              ]}
            />
          </div>
        </div>
        <div className="mt-5 grid md:grid-cols-2 lg:grid-cols-2 gap-2 md:gap-4 lg:gap-5 xl:gap-6">
          {isFiltered
            ? filteredData?.map((blog: Blog, index: any) => {
                let condition = user
                  ? blog.status === 1 &&
                    blog.Interacts &&
                    blog.Interacts.every(
                      (interact: any) =>
                        user?.id !== interact.userId || interact.type !== 0
                    )
                  : blog.status === 1;
                return condition ? (
                  <div className="relative" key={index}>
                    <BlogCard blog={blog} />
                    {user && (
                      <div className="absolute top-16 right-0">
                        <BlogActionsBtn blog={blog} />
                      </div>
                    )}
                  </div>
                ) : (
                  <Fragment key={index}></Fragment>
                );
              })
            : blogs?.pages?.map((page: any) => {
                return page?.data?.map((blog: Blog, index: any) => {
                  let condition = user
                    ? blog.status === 1 &&
                      blog.Interacts &&
                      blog.Interacts.every(
                        (interact: any) =>
                          user?.id !== interact.userId || interact.type !== 0
                      )
                    : blog.status === 1;
                  return condition ? (
                    <div className="relative" key={index}>
                      <BlogCard blog={blog} />
                      {user && (
                        <div className="absolute top-16 right-0">
                          <BlogActionsBtn blog={blog} />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Fragment key={index}></Fragment>
                  );
                });
              })}
        </div>
        {!isFiltered && hasNextPage && (
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
      </div>
    </div>
  );
};

export default BlogsPageContent;
