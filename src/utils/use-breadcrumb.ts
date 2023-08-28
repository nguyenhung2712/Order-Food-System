import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export function convertBreadcrumbTitle(string: string) {
  return string
    .replace(/-/g, ' ')
    .replace(/oe/g, 'ö')
    .replace(/ae/g, 'ä')
    .replace(/ue/g, 'ü')
    .toLowerCase();
}

export default function useBreadcrumb() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const [breadcrumbs, setBreadcrumbs] = useState<any>(null);
  useEffect(() => {
    if (router) {
      const linkPath =
        router.asPath.indexOf('?') > 0
          ? router.pathname.split('/')
          : router.asPath.split('/');
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          breadcrumb: path.split('-').length > 1 ? path : t(`text-${path}`),
          href: '/' + linkPath.slice(0, i + 1).join('/'),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router, t]);
  return breadcrumbs;
}
