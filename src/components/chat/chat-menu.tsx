import ChatIcon from '@components/icons/featured/chat-icon';
import { useUI } from '@contexts/ui.context';
import { Menu } from '@headlessui/react';

export default function ChatMenu() {
  const { setChat, isAuthorized } = useUI();

  return (
    <>
      {isAuthorized ? (
        <Menu>
          <Menu.Button className="z-100 fixed lg:bottom-4 bottom-16 right-4 bg-skin-primary w-16 h-16 rounded-full drop-shadow-lg flex justify-center items-center text-white text-4xl hover:drop-shadow-2xl">
            <ChatIcon />
          </Menu.Button>
          <Menu.Items
            className={`z-100 block fixed lg:bottom-24 bottom-36 right-4 w-42 bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
          >
            {/* <Menu.Item>
                                {({ active }) => (
                                    <button
                                        type="button"
                                        className={`${active ? 'bg-gray-100' : ''
                                            } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                                        onClick={() => setChat("chat_bot")}
                                    >
                                        Chat bot
                                    </button>
                                )}
                            </Menu.Item> */}
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={`${
                    active ? 'bg-gray-100' : ''
                  } block px-4 py-2 text-sm text-gray-700 w-full text-left`}
                  onClick={() => setChat('contact')}
                >
                  Liên hệ nhân viên
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Menu>
      ) : (
        <></>
      )}
    </>
  );
}
