import { useState, useRef, useEffect } from 'react';
import Input from '@components/ui/form/input';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import cn from 'classnames';
import { MdSend } from 'react-icons/md';
import { AiFillCamera } from 'react-icons/ai';
import { TbMoodSmileBeam } from 'react-icons/tb';
import { MdClose } from 'react-icons/md';
import { useRepCommentMutation } from '@framework/comment/use-repcomment';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { Comment, CommentRep } from '@framework/types';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useRouter } from 'next/router';
import { LoadingScreen } from '../loading-screen';

interface RepCommentFormProps {
  comment?: Comment;
  rep?: CommentRep;
  setOpenComment?: any;
  className?: string;
}
interface RepCommentFormValues {
  message?: string;
  image?: FileList;
}

const RepCommentForm: React.FC<RepCommentFormProps> = ({
  setOpenComment,
  rep,
  comment,
  className = '',
}) => {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<RepCommentFormValues>();
  const formRef = useRef<HTMLFormElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);

  const [isInputHavingValue, setIsHaving] = useState<boolean>(false);
  const [isOpenSelectingEmoji, setIsOpenSelecting] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [image, setImage] = useState<any>();
  const user = JSON.parse(Cookies.get('user') as string);
  const { mutate: repcomment, isLoading } = useRepCommentMutation();
  console.log(previewImage);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target) &&
        emojiBtnRef.current &&
        !emojiBtnRef.current?.contains(event.target)
      ) {
        setIsOpenSelecting(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiRef]);
  useEffect(() => {
    if (previewImage === '' && message === '') {
      setIsHaving(false);
    }
    if (previewImage !== '' || message !== '') {
      setIsHaving(true);
    }
  }, [previewImage, message]);
  function onSubmit(values: RepCommentFormValues) {
    if (rep) {
      repcomment({ ...values, image, repId: rep?.id, commentId: comment?.id });
    } else {
      repcomment({ ...values, image, commentId: comment?.id });
    }
    setPreviewImage('');
    setValue('message', '');
    setMessage('');
    setOpenComment(false);
  }

  const addEmoji = (event: any) => {
    let sym = event.unified.split('-');
    let codesArray: any[] = [];
    sym.forEach((element: any) => codesArray.push('0x' + element));
    let emoji = String.fromCodePoint(...codesArray);
    setValue('message', getValues('message') + emoji);
    setMessage((prev) => prev + emoji);
  };
  if (isLoading) return <LoadingScreen size={45} />;
  return (
    <div className={cn(className)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center mt-5 lg:mt-7 xl:mt-9"
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
            />
            <div className="top-1 absolute">
              <Image
                src={user.avatar}
                alt={`${user.lastName} Avatar`}
                width={33}
                height={33}
                className="rounded-full ms-5 cursor-pointer"
                objectFit="cover"
              />
            </div>
            <button
              className={`absolute right-3 top-3 p-1 rounded-full hover:bg-[#E5E7EB] text-lg ${
                !isInputHavingValue && 'cursor-not-allowed'
              }`}
              disabled={!isInputHavingValue}
              type="submit"
            >
              <MdSend />
            </button>
            <label
              htmlFor={`image-${rep?.id}`}
              className="absolute right-10 top-3 p-1 rounded-full hover:bg-[#E5E7EB] text-lg cursor-pointer"
            >
              <AiFillCamera />
            </label>
            <input
              id={`image-${rep?.id}`}
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
              className="absolute right-16 top-3 p-1 rounded-full hover:bg-[#E5E7EB] text-lg"
              type="button"
              ref={emojiBtnRef}
              onClick={() => setIsOpenSelecting((prev) => !prev)}
            >
              <TbMoodSmileBeam />
            </button>
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
                  locale={locale}
                  theme="light"
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default RepCommentForm;
