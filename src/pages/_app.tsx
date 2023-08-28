import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ManagedUIContext } from '@contexts/ui.context';
import ManagedModal from '@components/common/modal/managed-modal';
import ManagedDrawer from '@components/common/drawer/managed-drawer';
import { Fragment, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Hydrate } from 'react-query/hydration';
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from 'react-query/devtools';
import { appWithTranslation } from 'next-i18next';
import { DefaultSeo } from '@components/seo/default-seo';
import { getDirection } from '@utils/get-direction';
// external
import 'react-toastify/dist/ReactToastify.css';
import Temp from './_temp';
// base css file
import '@styles/scrollbar.css';
import '@styles/swiper-carousel.css';
import '@styles/custom-plugins.css';
import '@styles/tailwind.css';
import '@styles/price-filter.css';
import { Menu, Transition } from '@headlessui/react';
import ChatBox from '@components/chat/chat-box';
import ChatMenu from '@components/chat/chat-menu';

const Noop: React.FC = ({ children }) => <>{children}</>;

const CustomApp = ({ Component, pageProps }: AppProps) => {
  const queryClientRef = useRef<any>();
  if (!queryClientRef.current) {
    queryClientRef.current = new QueryClient();
  }
  const router = useRouter();
  const dir = getDirection(router.locale);

  useEffect(() => {
    document.documentElement.dir = dir;
  }, [dir]);

  const Layout = (Component as any).Layout || Noop;
  return (
    <>
      {/* <script
        src="https://cdn.tiny.cloud/1/fo5whegzz6cb4ope25zocqddjmmfrorm6ksow0ic962soa4w/tinymce/6/tinymce.min.js"
        referrerPolicy="origin"
      ></script> */}
      <QueryClientProvider client={queryClientRef.current}>
        <Hydrate state={pageProps.dehydratedState}>
          <ManagedUIContext>
            <>
              <Temp>
                <DefaultSeo />
                <Layout pageProps={pageProps}>
                  <Component {...pageProps} key={router.route} />
                </Layout>
                <ToastContainer />
                <ManagedModal />
                <ManagedDrawer />
                <ChatMenu />
                <ChatBox />
              </Temp>
            </>
          </ManagedUIContext>
        </Hydrate>
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </>
  );
};

export default appWithTranslation(CustomApp);
