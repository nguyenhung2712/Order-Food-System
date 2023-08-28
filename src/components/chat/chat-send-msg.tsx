import { useUI } from '@contexts/ui.context';
import { useState, createRef, useRef, useEffect, useMemo } from 'react';
import { addDocument } from '@utils/use-fb-document';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useRouter } from 'next/router';
import { TbMoodSmileBeam } from 'react-icons/tb';
import { AiFillCamera } from 'react-icons/ai';
import Image from 'next/image';
import { MdClose } from 'react-icons/md';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { http1 } from '@framework/utils/http';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import useFirestore from '@utils/use-firestore';
import { Customer } from '@framework/types';

export default function ChatSend() {
  const { locale } = useRouter();
  const contentRef = createRef<HTMLDivElement>();
  const inputRef = createRef<HTMLInputElement>();
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState<FormData | undefined>();
  const [images, setImages] = useState<any[]>([]);

  const [isOpenSelectingEmoji, setIsOpenSelecting] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [user, setUser] = useState<Customer | undefined>();

  const roomCondition = useMemo(
    () => ({
      fieldName: 'userId',
      operator: '==',
      compareValue: user?.id,
    }),
    [user]
  );
  const rooms = useFirestore('rooms', roomCondition);

  useEffect(() => {
    setUser(
      Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null
    );
  }, []);

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
  console.log(rooms, user);

  async function handleSendMsg() {
    setLoading(true);
    const text = message;
    setMessage('');
    setImages([]);
    let imageRes;
    if (formData && formData.get('images')) {
      imageRes = await http1.post(
        `${API_ENDPOINTS.UPLOAD_MSG_IMAGE}`,
        formData
      );
    }
    setFormData(undefined);
    await addDocument('messages', {
      text: text ? text : null,
      userId: user!.id,
      roomId: rooms[0].id,
      readBy: [],
      images: imageRes ? imageRes.data.image : null,
      status: 1,
    }).then((res) => {
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        });
      }
      setLoading(false);
    });
  }

  const addEmoji = (event: any) => {
    let sym = event.unified.split('-');
    let codesArray: any[] = [];
    sym.forEach((element: any) => codesArray.push('0x' + element));
    let emoji = String.fromCodePoint(...codesArray);
    setMessage((prev) => prev + emoji);
    /* setIsHaving(true); */
  };
  const uploadMultipleFiles = (event: any) => {
    let uploadData = new FormData();
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      uploadData.append('images', event.target.files[i]);
      setImages((curr) => [
        ...curr,
        { url: URL.createObjectURL(files[i]), file: event.target.files[i] },
      ]);
    }
    setFormData(uploadData);
  };
  console.log(images);

  return (
    <>
      {images && images.length > 0 && (
        <div className="flex">
          {images.map((image) => (
            <div style={{ height: 130 }} className="py-3" key={image.url}>
              <div className="border relative">
                <Image
                  src={image.url}
                  alt={'Chat Image'}
                  width={100}
                  height={100}
                  className="rounded-lg ms-5 cursor-pointer border object-cover"
                />
                <button
                  className="absolute top-1 right-1 rounded-full bg-[#e5e7eb80] hover:bg-[#E5E7EB] text-lg"
                  type="button"
                  onClick={() => {
                    let fData = new FormData();
                    let values = formData!.getAll('images');
                    let index = values.indexOf(image.file);
                    values.splice(index, 1);
                    for (let i = 0; i < values.length; i++) {
                      fData.append('images', values[i]);
                    }
                    setFormData(fData);
                    setImages((curr) =>
                      curr.filter((imageUrl) => imageUrl.url !== image.url)
                    );
                  }}
                >
                  <MdClose />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 bg-gray-200 rounded-b-lg relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type message..."
          className="px-2 py-1 pr-12 bg-white border border-gray-300 rounded-lg focus:outline-none break-all w-full flex-1"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setMessage(e.target.value)
          }
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              if (
                (event.target as HTMLInputElement).value === '' &&
                (!images || images.length === 0)
              ) {
                event.preventDefault();
                return false;
              }
              handleSendMsg();
            }
          }}
        />
        <button
          className="ml-2 px-2 py-1 text-white bg-skin-primary rounded-lg"
          onClick={() => handleSendMsg()}
          disabled={isLoading}
        >
          Send
        </button>
        {isLoading && (
          <span className="visually-hidden absolute" style={{ right: '130px' }}>
            <svg
              className="animate-spin inline w-4 h-4 rounded-full ml-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
        )}

        <button
          className="absolute top-3 p-1 rounded-full hover:bg-[#E5E7EB] text-lg"
          type="button"
          ref={emojiBtnRef}
          onClick={() => setIsOpenSelecting((prev) => !prev)}
          style={{ right: '102px' }}
          disabled={isLoading}
        >
          <TbMoodSmileBeam />
        </button>
        <label
          htmlFor={`image-chat`}
          className="absolute top-3 p-1 rounded-full hover:bg-[#E5E7EB] text-lg cursor-pointer"
          style={{ right: '82px' }}
        >
          <AiFillCamera />
        </label>
        <input
          id={`image-chat`}
          type="file"
          accept=".jpg,.png,.jpeg"
          style={{ display: 'none' }}
          onChange={uploadMultipleFiles}
          multiple
          disabled={isLoading}
        />
        {isOpenSelectingEmoji && (
          <div
            className="absolute z-50 right-0"
            style={{ top: '-430px' }}
            ref={emojiRef}
          >
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              locale={locale}
              theme="light"
              disabled={isLoading}
            />
          </div>
        )}
      </div>
    </>
  );
}
