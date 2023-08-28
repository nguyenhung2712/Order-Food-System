import { useUI } from '@contexts/ui.context';
import useFirestore from '@utils/use-firestore';
import Cookies from 'js-cookie';
import { Customer } from '@framework/types';
import { useState, useEffect, useMemo, createRef, Fragment } from 'react';
import ChatSend from './chat-send-msg';
import { useModalAction } from '@components/common/modal/modal.context';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import { useRouter } from 'next/router';
import { Tooltip } from '@material-tailwind/react';
import { generateLocaleDate } from '@utils/generate-locale-date';
import Image from 'next/image';

export default function ChatBox() {
  const { openModal } = useModalAction();
  const contentRef = createRef<HTMLDivElement>();
  const { chatType, setChat } = useUI();
  const [user, setUser] = useState<Customer | undefined>();

  const { locale } = useRouter();
  if (locale === 'vi') {
    dayjs.locale('vi', {
      relativeTime: {
        future: 'trong %s',
        past: '%s trước',
        s: 'vài giây',
        m: 'một phút',
        mm: '%d phút',
        h: 'một giờ',
        hh: '%d giờ',
        d: 'một ngày',
        dd: '%d ngày',
        M: 'một tháng',
        MM: '%d tháng',
        y: 'một năm',
        yy: '%d năm',
      },
    });
  }
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const roomCondition = useMemo(
    () => ({
      fieldName: 'userId',
      operator: '==',
      compareValue: user?.id,
    }),
    [user]
  );
  const rooms = useFirestore('rooms', roomCondition);

  const messagesCondition = useMemo(
    () => ({
      fieldName: 'roomId',
      operator: '==',
      compareValue: rooms && rooms.length > 0 ? rooms[0]?.id : null,
    }),
    [rooms]
  );
  const messages = useFirestore('messages', messagesCondition);

  useEffect(() => {
    setUser(
      Cookies.get('user') ? JSON.parse(Cookies.get('user') as string) : null
    );
  }, []);

  useEffect(() => {
    // scroll to bottom after message changed
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight + 50;
    }
  }, [messages, chatType, contentRef]);

  return (
    <>
      {chatType ? (
        <div className="fixed lg:bottom-4 bottom-16 right-24 z-20">
          <div className="max-w-xs mx-auto bg-white rounded-lg shadow-lg">
            <div
              className="flex items-center justify-between px-4 py-2 bg-skin-primary text-skin-inverted rounded-t-lg cursor-pointer"
              onClick={() => setChat(null)}
            >
              <h2 className="text-lg font-medium text-white">
                {chatType === 'chat_bot' ? 'Chat Bot' : 'Liên hệ nhân viên'}
              </h2>
            </div>
            <div className="p-4 overflow-auto h-72" ref={contentRef}>
              <div className="flex flex-col space-y-4">
                {chatType === 'contact' &&
                  messages?.map((message: any) => (
                    <Fragment key={message.id}>
                      {message.adminId && (
                        <div className="flex flex-col items-start relative">
                          <div className="flex items-center w-full">
                            <span className="text-sm font-medium text-gray-600 mr-4">
                              {locale === 'vi' ? 'Nhân viên' : 'Staff'}
                            </span>
                          </div>
                          <Tooltip
                            content={
                              <p className="bg-black rounded-xl p-2 text-white z-50 w-40 absolute top-0 left-0">
                                {generateLocaleDate(
                                  message.createdAt,
                                  locale,
                                  true
                                )}
                              </p>
                            }
                            placement="bottom"
                          >
                            <div>
                              {message.status === 1 && message.text && (
                                <div
                                  className={`mt-1 overflow-hidden p-2 bg-gray-200 rounded-lg`}
                                  style={{ width: 'fit-content' }}
                                >
                                  <p className="text-sm text-gray-800">
                                    {message.text}
                                  </p>
                                </div>
                              )}
                              {message.status === 1 && message.images && (
                                <div
                                  className={`mt-1 overflow-hidden border-2 border-gray-400 border-solid bg-gray-200 rounded-lg w-[200px]`}
                                >
                                  <div className="flex flex-wrap">
                                    {message.images
                                      .split('|')
                                      .filter((image: string) => image !== '')
                                      .map((image: any) => (
                                        <div
                                          className={`${
                                            message.images
                                              .split('|')
                                              .filter(
                                                (image: string) => image !== ''
                                              ).length === 1
                                              ? 'h-56'
                                              : 'h-16'
                                          } cursor-pointer`}
                                          style={{
                                            flex: '1 0 auto',
                                          }}
                                          key={image}
                                          onClick={() =>
                                            openModal('IMAGE_VIEW', {
                                              image: image,
                                            })
                                          }
                                        >
                                          <Image
                                            src={image}
                                            alt="Message Image"
                                            className="h-full w-full"
                                            style={{
                                              objectFit: 'cover',
                                            }}
                                          />
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                              {message.status === 0 && (
                                <div
                                  className={`mt-1 overflow-hidden p-2 bg-gray-200 rounded-lg`}
                                  style={{ width: 'fit-content' }}
                                >
                                  <p className="text-sm text-gray-800">
                                    Nhân viên đã thu hồi
                                  </p>
                                </div>
                              )}
                            </div>
                          </Tooltip>
                          <div>
                            <span className="text-xs font-medium text-gray-400">
                              {dayjs
                                .utc(message.createdAt)
                                .tz(dayjs.tz.guess())
                                .fromNow()}
                            </span>
                          </div>
                        </div>
                      )}
                      {message.userId && (
                        <div className="flex flex-col items-end relative">
                          <div className="flex items-center justify-end w-full">
                            <span className="text-xs font-medium text-gray-400">
                              {dayjs
                                .utc(message.createdAt)
                                .tz(dayjs.tz.guess())
                                .fromNow()}
                            </span>
                          </div>
                          <Tooltip
                            content={
                              <p className="bg-black rounded-xl p-2 text-white z-50 w-40 absolute top-0 left-0">
                                {generateLocaleDate(
                                  message.createdAt,
                                  locale,
                                  true
                                )}
                              </p>
                            }
                            placement="bottom"
                          >
                            <div>
                              {message.status === 1 && message.text && (
                                <div
                                  className={`mt-1 overflow-hidden p-2 bg-gray-200 rounded-lg`}
                                  style={{ width: 'fit-content' }}
                                >
                                  <p className="text-sm text-gray-800">
                                    {message.text}
                                  </p>
                                </div>
                              )}
                              {message.status === 1 && message.images && (
                                <div
                                  className={`mt-1 overflow-hidden border-2 border-gray-400 border-solid bg-gray-200 rounded-lg w-[200px]`}
                                >
                                  <div className="flex flex-wrap">
                                    {message.images
                                      .split('|')
                                      .filter((image: string) => image !== '')
                                      .map((image: any) => (
                                        <div
                                          className={`${
                                            message.images
                                              .split('|')
                                              .filter(
                                                (image: string) => image !== ''
                                              ).length === 1
                                              ? 'h-56'
                                              : 'h-28'
                                          } cursor-pointer`}
                                          style={{
                                            flex: '1 0 auto',
                                          }}
                                          key={image}
                                          onClick={() =>
                                            openModal('IMAGE_VIEW', {
                                              image: image,
                                            })
                                          }
                                        >
                                          <Image
                                            src={image}
                                            alt="Message Image"
                                            className="h-full w-full"
                                            style={{
                                              objectFit: 'cover',
                                            }}
                                          />
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}
                              {message.status === 0 && (
                                <div
                                  className={`mt-1 overflow-hidden p-2 bg-gray-200 rounded-lg`}
                                  style={{ width: 'fit-content' }}
                                >
                                  <p className="text-sm text-gray-800">
                                    Bạn đã thu hồi
                                  </p>
                                </div>
                              )}
                            </div>
                          </Tooltip>
                        </div>
                      )}
                    </Fragment>
                  ))}
              </div>
            </div>
            <ChatSend />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
