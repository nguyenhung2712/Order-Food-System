import Layout from '@components/layout/layout';
import AccountLayout from '@components/my-account/account-layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import Seo from '@components/seo/seo';
import UpdateBlog from '@components/my-account/update-blog';

export default function BlogPage() {
  return (
    <>
      <Seo
        title="Blog"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="my-account/blogs/update"
      />
      <AccountLayout>
        <UpdateBlog />
      </AccountLayout>
    </>
  );
}

BlogPage.Layout = Layout;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
}: any) => {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
  };
};
