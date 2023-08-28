import { BsThreeDots } from 'react-icons/bs';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useDeletecommentMutation } from '@framework/comment/delete-comment';
import { LoadingScreen } from '@components/common/loading-screen';
import Cookies from 'js-cookie';
import { useInteractCommentMutation } from '@framework/comment/use-interact-comment';
import swal from 'sweetalert';
import { useModalAction } from '@components/common/modal/modal.context';

const CommentActionsBtn: React.FC<{
  comment?: any;
  rep?: any;
  setEditComment?: any;
}> = ({ comment, rep, setEditComment }) => {
  const { openModal } = useModalAction();
  const { mutate: deleteComment, isLoading: isDeleteLoading } =
    useDeletecommentMutation();
  const { mutate: interact, isLoading: isInteractLoading } =
    useInteractCommentMutation();

  const user = JSON.parse(Cookies.get('user') as string);

  function handleDeleteComment() {
    if (comment) {
      deleteComment({ commentId: comment.id, type: 'cmt' });
    }
    if (rep) {
      deleteComment({ repId: rep.id, type: 'rep' });
    }
  }
  function handleUpdateComment() {
    setEditComment(true);
  }
  function handleHideComment() {
    swal({
      title: 'Ẩn nội dung',
      text: 'Xác nhận ẩn nội dung này ?',
      icon: 'warning',
      buttons: ['Hủy bỏ', 'Đồng ý'],
    }).then((result: any) => {
      if (result) {
        if (comment) {
          interact({ type: 0, commentId: comment.id as string });
        }
        if (rep) {
          interact({ type: 0, repId: rep.id as string });
        }
      }
    });
  }
  function handleReportComment() {
    if (comment) {
      openModal('REPORT_VIEW', { comment: comment });
    }
    if (rep) {
      openModal('REPORT_VIEW', { rep: rep });
    }
  }
  if (isDeleteLoading || isInteractLoading) return <LoadingScreen size={45} />;
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
                {(rep && rep!.user.id === user.id) ||
                (comment && comment!.user.id === user.id) ? (
                  <>
                    <div
                      className="text-[14px] whitespace-nowrap text-skin-base py-2 px-5 hover:bg-[#F6F9FC] transition-all cursor-pointer"
                      onClick={handleUpdateComment}
                    >
                      Edit
                    </div>
                    <div
                      className="text-[14px] whitespace-nowrap text-[#F35C5C] py-2 px-5 hover:bg-[#F6F9FC] transition-all cursor-pointer"
                      onClick={handleDeleteComment}
                    >
                      Remove
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="text-[14px] whitespace-nowrap text-skin-base py-2 px-5 hover:bg-[#F6F9FC] transition-all cursor-pointer"
                      onClick={handleHideComment}
                    >
                      Hide
                    </div>
                    <div
                      className="text-[14px] whitespace-nowrap text-[#F35C5C] py-2 px-5 hover:bg-[#F6F9FC] transition-all cursor-pointer"
                      onClick={handleReportComment}
                    >
                      Report
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

export default CommentActionsBtn;
