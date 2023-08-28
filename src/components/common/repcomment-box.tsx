import Text from '@components/ui/text';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import { BsFillReplyFill } from 'react-icons/bs';
import RepCommentForm from '@components/common/form/repcomment-form';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { generateDiffLocaleDate } from '@utils/generate-locale-date';
import CommentActionsBtn from '@components/ui/comment-action-btn';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
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

const RepCommentBox: React.FC<any> = ({ comment, rep }) => {
  const router = useRouter();
  const { openModal } = useModalAction();
  const { mutate: interact, isLoading: isInteractLoading } =
    useInteractCommentMutation();
  const { mutate: updateComment, isLoading: isUpdateLoading } =
    useUpdatecommentMutation();
  const repBtnRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const [isOpenComment, setOpenComment] = useState<boolean>(false);
  const [isEditting, setEditComment] = useState<boolean>(false);
  const [isInputHavingValue, setIsHaving] = useState<boolean>(false);
  const [isOpenSelectingEmoji, setIsOpenSelecting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const [image, setImage] = useState<any>();
  const [message, setMessage] = useState<string>();
  const user = JSON.parse(Cookies.get('user') as string) || null;
  const { t } = useTranslation('forms');
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<RepCommentFormValues>();

  function handleRepBlog() {
    setOpenComment((prev) => !prev);
  }
  useEffect(() => {
    setMessage(rep.message);
    setValue('message', rep.message);
    setPreviewImage(rep.image);
  }, [rep, setValue]);
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
      type: 'rep',
      previewImage: previewImage,
      image: image,
      repId: rep.id,
    });
    setEditComment(false);
  }
  function handleLikeCmt() {
    interact({ type: 1, repId: rep.id });
    /* setOpenComment((prev) => !prev); */
  }
  if (isUpdateLoading) return <LoadingScreen size={45} />;
  return (
    <div>
      <div className="flex items-center">
        {!isEditting ? (
          <>
            <div className="flex items-start">
              <Image
                src={rep!.user.avatar}
                alt={`${rep.user.lastName} Avatar`}
                width={33}
                height={33}
                className="rounded-full ms-5 cursor-pointer"
                objectFit="cover"
                onClick={() => {
                  if (rep?.user.id === user?.id) {
                    router.push(ROUTES.ACCOUNT_SETTING);
                  } else {
                    router.push(`${ROUTES.ACCOUNT_DETAILS}/${rep?.user.id}`);
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
                        if (rep?.user.id === user?.id) {
                          router.push(ROUTES.ACCOUNT_SETTING);
                        } else {
                          router.push(
                            `${ROUTES.ACCOUNT_DETAILS}/${rep?.user.id}`
                          );
                        }
                      }}
                    >
                      {rep.user.firstName + ' ' + rep.user.lastName}
                    </div>
                    <div className="ms-[3px]">
                      {rep.rep && (
                        <span
                          className="font-bold cursor-pointer"
                          onClick={() => {
                            if (rep.rep.user.id === user?.id) {
                              router.push(ROUTES.ACCOUNT_SETTING);
                            } else {
                              router.push(
                                `${ROUTES.ACCOUNT_DETAILS}/${rep.rep.user.id}`
                              );
                            }
                          }}
                        >
                          {rep.rep
                            ? rep.rep.user.firstName +
                              ' ' +
                              rep.rep.user.lastName
                            : rep.user.firstName + ' ' + rep.user.lastName}
                        </span>
                      )}
                      {rep.message && (
                        <Text className="xl:leading-[2em] inline ps-1">
                          {rep.message}
                        </Text>
                      )}
                    </div>
                  </div>
                  <div className="ms-2">
                    {rep.image && (
                      <Image
                        src={rep.image}
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
              <CommentActionsBtn rep={rep} setEditComment={setEditComment} />
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
                  className=" w-full cmt-field pl-10"
                  inputClassName="pr-24"
                  variant="solid"
                  onKeyPress={(event: any) => {
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
                      router.push(`${ROUTES.ACCOUNT_SETTING}`);
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
                  /* {...register("image", {
                                                                    onChange: (event) => {
                                                                        if (event?.target?.files?.[0]) {
                                                                            const file = event.target.files[0];
                                                                            const reader = new FileReader();
                                                                            reader.onloadend = () => {
                                                                                setPreviewImage(reader.result as string);
                                                                            };
                                                                            reader.readAsDataURL(file);
                                                                        }
                                                                    },
                                                                })} */
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
                    className="absolute right-20 top-2 p-1 rounded-full hover:bg-[#E5E7EB] text-lg"
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
                        className="rounded-lg ms-5 cursor-pointer border"
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
        <div className="flex ms-2">
          <button
            className="bg-white font-bold rounded me-3 text-base "
            ref={repBtnRef}
            onClick={handleLikeCmt}
          >
            <span
              className={
                rep.Interacts.some(
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
                rep.Interacts.filter(
                  (interact: any) =>
                    interact.type === 1 && interact.status === 1
                ).length
              }
            </span>
          </button>
          <button
            className="bg-white font-bold rounded me-3 text-base"
            ref={repBtnRef}
            onClick={handleRepBlog}
          >
            <BsFillReplyFill />
          </button>
          <Text className="text-xs">
            {generateDiffLocaleDate(rep.createdAt, router.locale)}
          </Text>
        </div>
        {isOpenComment && (
          <div style={{ marginTop: '-15px' }}>
            <RepCommentForm
              setOpenComment={setOpenComment}
              comment={comment}
              rep={rep}
              className="mb-3"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RepCommentBox;