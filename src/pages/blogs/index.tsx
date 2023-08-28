import Layout from '@components/layout/layout';
import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import PageHeroSection from '@components/ui/page-hero-section';
import Seo from '@components/seo/seo';
import BlogsPageContent from '@components/blogs/blog-page-content';

export default function ShopsPage() {
  return (
    <>
      <Seo
        title="Blogs"
        description="Fastest E-commerce template built with React, NextJS, TypeScript, React-Query and Tailwind CSS."
        path="blogs"
      />
      <PageHeroSection
        heroTitle="text-blog-page"
        backgroundThumbnail="/assets/images/shop-page-hero-bg.jpg"
        mobileBackgroundThumbnail="/assets/images/shop-page-hero-mobile-bg.png"
        variant="white"
      />
      <BlogsPageContent />
    </>
  );
}

ShopsPage.Layout = Layout;

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale!, [
        'common',
        'forms',
        'menu',
        'footer',
      ])),
    },
  };
};
