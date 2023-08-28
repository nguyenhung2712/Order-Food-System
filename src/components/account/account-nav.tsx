import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLogoutMutation } from '@framework/auth/use-logout';
import { useTranslation } from 'next-i18next';

type Option = {
  name: string;
  slug: string;
  icon?: JSX.Element;
};

export default function AccountNav({ options }: { options: Option[] }) {
  const { t } = useTranslation('common');
  const {
    pathname,
    query: { id },
  } = useRouter();

  const newPathname = pathname.split('/').slice(2, 3);
  const mainPath = `/${newPathname[0]}`;
  return (
    <nav className="flex flex-col border border-skin-base rounded-md overflow-hidden">
      {options.map((item) => {
        const menuPathname = item.slug.split('/').slice(2, 3);
        const menuPath = `/${menuPathname[0]}`;

        return (
          <Link key={item.slug} href={`${item.slug}/${id}`}>
            <a
              className={`flex items-center cursor-pointer text-sm lg:text-15px text-skin-base py-3.5 px-3.5 xl:px-4 2xl:px-5 mb-1 ${
                mainPath === menuPath
                  ? 'bg-skin-two font-medium'
                  : 'font-normal'
              }`}
            >
              <span className="w-9 xl:w-10 flex-shrink-0 flex justify-center">
                {item.icon}
              </span>
              <span className="ps-1.5">{t(item.name)}</span>
            </a>
          </Link>
        );
      })}
    </nav>
  );
}
