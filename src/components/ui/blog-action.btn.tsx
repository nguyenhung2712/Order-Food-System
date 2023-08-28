import { BsThreeDots } from 'react-icons/bs';
import { Popover, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { LoadingScreen } from '@components/common/loading-screen';
import swal from 'sweetalert';
import { useDeleteBlogMutation } from '@framework/blog/delete-blog';
import { useRouter } from 'next/router';
import { ROUTES } from '@utils/routes';
import { Customer } from '@framework/types';
import Cookies from 'js-cookie';
import { useInteractBlogMutation } from '@framework/blog/use-interact-blog';
import { useModalAction } from '@components/common/modal/modal.context';
import { useTranslation } from 'next-i18next';

const BlogActionsBtn: React.FC<{ blog?: any }> = ({ blog }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { openModal } = useModalAction();
  const { mutate: deleteBlog, isLoading: isDeleteLoading } =
    useDeleteBlogMutation();
  const { mutate: interact, isLoading: isInteractLoading } =
    useInteractBlogMutation();

  const [currentUser, setCurrentUser] = useState<Customer>();
  useEffect(() => {
    setCurrentUser(
      Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null
    );
  }, []);

  function handleDeleteBlog() {
    swal({
      title: 'Xóa nội dung',
      text: 'Xác nhận xóa nội dung này ?',
      icon: 'warning',
      buttons: ['Hủy bỏ', 'Đồng ý'],
    }).then((result) => {
      if (result) {
        deleteBlog(blog.id);
      }
    });
  }
  function handleUpdateBlog() {
    router.push(`${ROUTES.UPDATE_BLOG}/${blog.slug}`);
  }
  function handleHideBlog() {
    swal({
      title: 'Ẩn nội dung',
      text: 'Xác nhận ẩn nội dung này ?',
      icon: 'warning',
      buttons: ['Hủy bỏ', 'Đồng ý'],
    }).then((result) => {
      if (result) {
        interact({ type: 0, blogId: blog.id as string });
      }
    });
  }
  function handleReportBlog() {
    openModal('REPORT_VIEW', { blog: blog });
  }

  return (
    <>
      <Popover className="relative actions_button_group -ms-2 inline-block -z-10">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                text-white group bg-orange-700 px-3 py-2 rounded-md inline-flex items-center text-base font-medium hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <BsThreeDots
                style={{ color: 'rgba(140, 150, 159, 1)' }}
                size={20}
              />
            </Popover.Button>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute top-[100%] end-0 2xl:end-auto 2xl:start-0 z-10 bg-white shadow-dropDown rounded py-2">
                {blog.user.id === currentUser?.id ? (
                  <>
                    <div
                      className="text-[14px] whitespace-nowrap text-skin-base py-2 px-5 hover:bg-[#F6F9FC] transition-all cursor-pointer"
                      onClick={handleUpdateBlog}
                    >
                      {t('text-edit')}
                    </div>
                    <div
                      className="text-[14px] whitespace-nowrap text-[#F35C5C] py-2 px-5 hover:bg-[#F6F9FC] transition-all cursor-pointer"
                      onClick={handleDeleteBlog}
                    >
                      {t('text-remove')}
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="text-[14px] whitespace-nowrap text-skin-base py-2 px-5 hover:bg-[#F6F9FC] transition-all cursor-pointer"
                      onClick={handleHideBlog}
                    >
                      {t('text-hide')}
                    </div>
                    <div
                      className="text-[14px] whitespace-nowrap text-[#F35C5C] py-2 px-5 hover:bg-[#F6F9FC] transition-all cursor-pointer"
                      onClick={handleReportBlog}
                    >
                      {t('text-report')}
                    </div>
                  </>
                )}
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default BlogActionsBtn;
