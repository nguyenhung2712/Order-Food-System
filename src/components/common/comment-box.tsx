import Text from '@components/ui/text';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { BsFillReplyFill, BsEyeFill } from 'react-icons/bs';
import RepCommentForm from '@components/common/form/repcomment-form';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { generateDiffLocaleDate } from '@utils/generate-locale-date';
import CommentActionsBtn from '@components/ui/comment-action-btn';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import Input from '@components/ui/form/input';
import { MdSend } from 'react-icons/md';
import { AiFillCamera, AiFillLike } from 'react-icons/ai';
import { TbMoodSmileBeam } from 'react-icons/tb';
import { MdClose } from 'react-icons/md';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useUpdatecommentMutation } from '@framework/comment/update-comment';
import { LoadingScreen } from './loading-screen';
import { ROUTES } from '@utils/routes';
import { useModalAction } from './modal/modal.context';
import { useInteractCommentMutation } from '@framework/comment/use-interact-comment';

interface RepCommentFormValues {
  message?: string;
  image?: FileList;
}

const CommentBox: React.FC<any> = ({ comment }) => {
  const router = useRouter();
  const { openModal } = useModalAction();
  const { mutate: updateComment, isLoading: isUpdateLoading } =
    useUpdatecommentMutation();
  const { mutate: interact, isLoading: isInteractLoading } =
    useInteractCommentMutation();

  const repBtnRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const [isOpenComment, setOpenComment] = useState<boolean>(false);
  const [isEditting, setEditComment] = useState<boolean>(false);
  const [isInputHavingValue, setIsHaving] = useState<boolean>(false);
  const [isOpenSelectingEmoji, setIsOpenSelecting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [image, setImage] = useState<any>();
  const user = Cookies.get('user')
    ? JSON.parse(Cookies.get('user') as string)
    : null;
  const { t } = useTranslation('forms');

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<RepCommentFormValues>();

  useEffect(() => {
    setMessage(comment.message);
    setValue('message', comment.message);
    /* setValue("image", ""); */
    setPreviewImage(comment.image);
  }, [comment, setValue]);

  useEffect(() => {
    if (previewImage === '' && message === '') {
      setIsHaving(false);
    }
    if (previewImage !== '' || message !== '') {
      setIsHaving(true);
    }
  }, [previewImage, message]);
  const addEmoji = (event: any) => {
    let sym = event.unified.split('-');
    let codesArray: any[] = [];
    sym.forEach((element: any) => codesArray.push('0x' + element));
    let emoji = String.fromCodePoint(...codesArray);
    setValue('message', getValues('message') + emoji);
    setMessage((prev) => prev + emoji);
  };

  function onSubmit(values: RepCommentFormValues) {
    updateComment({
      ...values,
      type: 'cmt',
      previewImage: previewImage,
      image: image,
      commentId: comment.id,
    });
    setEditComment(false);
  }
  function handleRepCmt() {
    setOpenComment((prev) => !prev);
  }
  function handleLikeCmt() {
    interact({ type: 1, commentId: comment.id });
    /* setOpenComment((prev) => !prev); */
  }
  if (isUpdateLoading) return <LoadingScreen size={45} />;
  return (
    <div>
      <div className="flex items-center">
        {!isEditting ? (
          <>
            <div className="flex items-start mt-2">
              <Image
                src={comment!.user.avatar}
                alt={`${comment.user.lastName} Avatar`}
                width={33}
                height={33}
                className="rounded-full ms-5 cursor-pointer"
                objectFit="cover"
                onClick={() => {
                  if (comment?.user.id === user?.id) {
                    router.push(ROUTES.ACCOUNT_SETTING);
                  } else {
                    router.push(
                      `${ROUTES.ACCOUNT_DETAILS}/${comment?.user.id}`
                    );
                  }
                }}
              />
              <div className="w-full">
                <div className="text-skin-base text-opacity-80 text-sm">
                  <div className="rounded-lg bg-[#f5f5f5] ms-2 px-3 py-2 w-auto inline-block">
                    <div
                      className="ms-[3px] font-semibold cursor-pointer"
                      style={{ width: 'fit-content' }}
                      onClick={() => {
                        if (comment?.user.id === user?.id) {
                          router.push(ROUTES.ACCOUNT_SETTING);
                        } else {
                          router.push(
                            `${ROUTES.ACCOUNT_DETAILS}/${comment?.user.id}`
                          );
                        }
                      }}
                    >
                      {comment.user.firstName + ' ' + comment.user.lastName}
                    </div>
                    <div className="ms-[3px]">
                      {comment.message && (
                        <Text className="xl:leading-[2em]">
                          {comment.message}
                        </Text>
                      )}
                    </div>
                  </div>
                  <div className="ms-2">
                    {comment.image && (
                      <Image
                        src={comment.image}
                        alt={'Comment Image'}
                        width={250}
                        height={200}
                        className="rounded-lg ms-5 cursor-pointer"
                        onClick={() =>
                          openModal('IMAGE_VIEW', { image: comment.image })
                        }
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            {user && (
              <CommentActionsBtn
                comment={comment}
                setEditComment={setEditComment}
              />
            )}
          </>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="w-full mx-auto flex flex-col justify-center ms-2 mt-5 lg:mt-7 xl:mt-9"
            ref={formRef}
            noValidate
          >
            <div className="flex flex-col space-y-5 md:space-y-6 lg:space-y-7">
              <div className="relative">
                <Input
                  {...register('message', {
                    onChange: (event) => {
                      if (event.target.value !== '') {
                        setMessage((prev) => prev + event.target.value);
                      }
                    },
                  })}
                  className="w-full cmt-field pl-10"
                  inputClassName={isEditting ? 'pr-32' : 'pr-24'}
                  variant="solid"
                  onKeyPress={(event) => {
                    if (event.key === 'Enter') {
                      if (
                        (event.target as HTMLInputElement).value === '' &&
                        (!previewImage || previewImage === '')
                      ) {
                        event.preventDefault();
                        return false;
                      }
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                      setEditComment(false);
                    }
                  }}
                />
                <div className="top-1 absolute">
                  <Image
                    src={user.avatar}
                    alt={`${user.lastName} Avatar`}
                    width={33}
                    height={33}
                    className="rounded-full ms-5 cursor-pointer"
                    objectFit="cover"
                    onClick={() => {
                      router.push(`${ROUTES.ACCOUNT_DETAILS}/${user.id}`);
                    }}
                  />
                </div>
                <button
                  className={`absolute right-3 top-2 p-1 rounded-full hover:bg-[#E5E7EB] text-lg ${
                    !isInputHavingValue && 'cursor-not-allowed'
                  }`}
                  disabled={!isInputHavingValue}
                  type="submit"
                >
                  <MdSend />
                </button>
                <label
                  htmlFor={`image-${comment?.id}`}
                  className="absolute right-10 top-2 p-1 rounded-full hover:bg-[#E5E7EB] text-lg cursor-pointer"
                >
                  <AiFillCamera />
                </label>
                <input
                  id={`image-${comment?.id}`}
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  style={{ display: 'none' }}
                  onChange={(event) => {
                    if (event?.target?.files?.[0]) {
                      const file = event.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setPreviewImage(reader.result as string);
                        setImage(event?.target?.files);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  className="absolute right-16 top-2 p-1 rounded-full hover:bg-[#E5E7EB] text-lg"
                  type="button"
                  ref={emojiBtnRef}
                  onClick={() => setIsOpenSelecting((prev) => !prev)}
                >
                  <TbMoodSmileBeam />
                </button>
                {isEditting && (
                  <button
                    className="absolute right-24 top-3 p-1 rounded-full hover:bg-[#E5E7EB] text-lg"
                    type="button"
                    onClick={() => setEditComment(false)}
                  >
                    <MdClose />
                  </button>
                )}
                {previewImage && previewImage !== '' && (
                  <div style={{ height: 220 }} className="py-3 inline-block">
                    <div className="absolute border">
                      <Image
                        src={previewImage}
                        alt={'RepComment Image'}
                        width={250}
                        height={200}
                        className="rounded-lg ms-5 border"
                      />
                      <button
                        className="absolute top-1 right-1 rounded-full hover:bg-[#E5E7EB] text-lg"
                        type="button"
                        onClick={() => setPreviewImage('')}
                      >
                        <MdClose />
                      </button>
                    </div>
                  </div>
                )}
                {isOpenSelectingEmoji && (
                  <div className="absolute z-50 right-0 top-14" ref={emojiRef}>
                    <Picker
                      data={data}
                      onEmojiSelect={addEmoji}
                      locale={router.locale}
                      theme="light"
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        )}
      </div>
      <div className="ms-10">
        <div className="flex">
          <button
            className="bg-white font-bold rounded me-3 text-base "
            ref={repBtnRef}
            onClick={handleLikeCmt}
          >
            <span
              className={
                comment.Interacts.some(
                  (interact: any) =>
                    interact.user.id === user.id && interact.status === 1
                )
                  ? 'text-[#10B981]'
                  : ''
              }
            >
              <AiFillLike className="inline" />{' '}
            </span>
            <span className="text-sm">
              {
                comment.Interacts.filter(
                  (interact: any) =>
                    interact.type === 1 && interact.status === 1
                ).length
              }
            </span>
          </button>
          <button
            className="bg-white font-bold rounded me-3 text-base"
            ref={repBtnRef}
            onClick={handleRepCmt}
          >
            <BsFillReplyFill />
          </button>
          <Text className="text-xs">
            {generateDiffLocaleDate(comment.createdAt, router.locale)}
          </Text>
        </div>
        {isOpenComment && (
          <div style={{ marginTop: '-15px' }}>
            {user ? (
              <RepCommentForm
                setOpenComment={setOpenComment}
                comment={comment}
                className="mb-3"
              />
            ) : (
              ''
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentBox;
