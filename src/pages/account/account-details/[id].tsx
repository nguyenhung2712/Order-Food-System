import Layout from '@components/layout/layout';
import AccountLayout from '@components/account/account-layout';
import AccountDetails from '@components/account/account-details';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetServerSideProps } from 'next';
import Seo from '@components/seo/seo';

export default function AccountDetailsPage() {
  return (
    <>
      <Seo
        title="Account Settings"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="account/account-settings"
      />
      <AccountLayout>
        <AccountDetails />
      </AccountLayout>
    </>
  );
}

AccountDetailsPage.Layout = Layout;

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
