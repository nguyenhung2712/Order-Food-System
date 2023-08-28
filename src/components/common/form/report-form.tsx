import Button from '@components/ui/button';
import TextArea from '@components/ui/form/text-area';
import { useForm } from 'react-hook-form';
import { useModalState } from '@components/common/modal/modal.context';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import Heading from '@components/ui/heading';
import { useTranslation } from 'next-i18next';
import { useInteractBlogMutation } from '@framework/blog/use-interact-blog';
import { useInteractCommentMutation } from '@framework/comment/use-interact-comment';
import ListBox from '@components/ui/form/select-box';
import { useReasonsQuery } from '@framework/reason/get-reasons';
import { Listbox, Transition } from '@headlessui/react';
import { useState, useEffect, Fragment } from 'react';
import { HiCheck, HiOutlineSelector } from 'react-icons/hi';

interface ReportFormValues {
  reason?: string;
}

const ReportForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    data: { blog, rep, comment },
  } = useModalState();
  const { closeModal } = useModalAction();
  const { data: reasons } = useReasonsQuery();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFormValues>({
    defaultValues: {},
  });
  const { mutate: interactBlog, isLoading: isInteractBlogLoading } =
    useInteractBlogMutation();
  const { mutate: interactCmt, isLoading: isInteractCmtLoading } =
    useInteractCommentMutation();

  const [selectedItem, setSelectedItem] = useState<any>();
  useEffect(() => {
    if (reasons) {
      setSelectedItem(reasons[0]);
    }
  }, [reasons]);
  function onSubmit(values: ReportFormValues, e: any) {
    if (blog) {
      interactBlog({
        type: 2,
        reasonId: selectedItem ? selectedItem.id : null,
        blogId: blog.id,
        otherReason: values.reason,
      });
    }
    if (rep) {
      interactCmt({
        type: 2,
        reasonId: selectedItem ? selectedItem.id : null,
        repId: rep.id,
        otherReason: values.reason,
      });
    }
    if (comment) {
      interactCmt({
        type: 2,
        reasonId: selectedItem ? selectedItem.id : null,
        commentId: comment.id,
        otherReason: values.reason,
      });
    }
  }

  return (
    <div className="w-full md:w-[500px] lg:w-[700px] xl:w-[800px] mx-auto p-5 sm:p-8 bg-skin-fill rounded-md">
      <CloseButton onClick={closeModal} />
      <Heading variant="title" className="mb-8 -mt-1.5">
        {t('common:text-report')}
      </Heading>
      <div className="block text-skin-base opacity-70 font-normal text-13px lg:text-sm leading-none mb-3 cursor-pointer">
        {t('common:text-reason')}
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {reasons && selectedItem && (
          <Listbox
            value={selectedItem}
            onChange={(values) => setSelectedItem(values)}
          >
            {({ open }) => (
              <div className="relative lg:ms-0 z-10 min-w-[180px]">
                <Listbox.Button className="h-full border border-gray-300  text-heading text-[13px] md:text-sm font-semibold  relative w-full py-2 ps-3 pe-10 text-start bg-white rounded-lg shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm cursor-pointer">
                  <span className="block truncate">
                    {t(selectedItem.reasonName)}
                  </span>
                  <span className="absolute inset-y-0 end-0 flex items-center pe-2 pointer-events-none">
                    <HiOutlineSelector
                      className="w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options
                    static
                    className="absolute w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
                  >
                    {reasons?.map((option: any, personIdx: number) => (
                      <Listbox.Option
                        key={personIdx}
                        className={({ active }) =>
                          `${
                            active
                              ? 'text-amber-900 bg-gray-100'
                              : 'text-gray-900'
                          }
                                            cursor-pointer select-none relative py-2 ps-10 pe-4`
                        }
                        value={option}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`${
                                selected ? 'font-medium' : 'font-normal'
                              } block truncate`}
                            >
                              {t(option.reasonName)}
                            </span>
                            {selected ? (
                              <span
                                className={`${active ? 'text-amber-600' : ''}
                                                    check-icon absolute inset-y-0 start-0 flex items-center ps-3`}
                              >
                                <HiCheck
                                  className="w-5 h-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            )}
          </Listbox>
        )}
        <div className="grid grid-cols-1 gap-7 mt-4">
          <TextArea
            label="common:text-other-reason"
            {...register('reason', {
              required: 'forms:address-required',
            })}
            error={errors.reason?.message}
            className="text-skin-base"
            variant="solid"
          />
        </div>
        <div className="flex w-full justify-end">
          <Button
            className="h-11 md:h-12 mt-1.5"
            type="submit"
            loading={isInteractBlogLoading || isInteractCmtLoading}
            disabled={isInteractBlogLoading || isInteractCmtLoading}
          >
            {t('common:text-send-report')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportForm;
