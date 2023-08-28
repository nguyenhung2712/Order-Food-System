import { useRouter } from 'next/router';
import cn from 'classnames';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { useUI } from '@contexts/ui.context';
import { useEffect, useMemo, useState } from 'react';
import Image from '@components/ui/image';
import { useTranslation } from 'next-i18next';
import { FaCheck } from 'react-icons/fa';

function checkIsActive(arr: any, item: string) {
  if (arr.includes(item)) {
    return true;
  }
  return false;
}
function CategoryFilterMenuItem({
  className = 'hover:bg-skin-two border-t border-skin-base first:border-t-0 px-3.5 2xl:px-4 py-3 xl:py-3.5 2xl:py-2.5 3xl:py-3',
  item,
  depth = 0,
}: any) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { pathname, query } = router;

  const selectedCategories = useMemo(
    () => (query?.category ? (query.category as string).split(',') : []),
    [query?.category]
  );
  const isActive = checkIsActive(selectedCategories, item.slug);
  const [isOpen, setOpen] = useState<boolean>(isActive);
  useEffect(() => {
    setOpen(isActive);
  }, [isActive]);
  const { id, typeName, slug, slugEn, icon, typeNameEn } = item;
  const { displaySidebar, closeSidebar } = useUI();

  function onClick() {
    const { category, ...restQuery } = query;
    let slug1 = router.locale === 'vi' ? slug : slugEn;
    let currentFormState = selectedCategories.includes(slug1)
      ? selectedCategories.filter((i) => i !== slug1)
      : [...selectedCategories, slug1];

    router.push(
      {
        pathname,
        query: {
          ...restQuery,
          ...(!!currentFormState.length
            ? { category: currentFormState.join(',') }
            : {}),
        },
      },
      undefined,
      { scroll: false }
    );

    displaySidebar && closeSidebar();
  }

  return (
    <>
      <li
        onClick={onClick}
        className={cn(
          'flex justify-between items-center transition text-sm md:text-15px',
          { 'bg-skin-two': isOpen },
          className
        )}
      >
        <button
          className={cn(
            'flex items-center w-full text-start cursor-pointer group',
            { 'py-3 xl:py-3.5 2xl:py-2.5 3xl:py-3': depth > 0 }
          )}
          // onClick={handleChange}
        >
          {icon && (
            <div className="inline-flex flex-shrink-0 2xl:w-12 2xl:h-12 3xl:w-auto 3xl:h-auto me-2.5 md:me-4 2xl:me-3 3xl:me-4">
              <Image
                src={icon ?? '/assets/placeholder/category-small.svg'}
                alt={typeName || t('text-category-thumbnail')}
                width={40}
                height={40}
              />
            </div>
          )}
          <span className="text-skin-base capitalize py-0.5">
            {router.locale === 'vi' ? typeName : typeNameEn}
          </span>
          {depth > 0 && (
            <span
              className={`w-[22px] h-[22px] text-13px flex items-center justify-center border-2 border-skin-four rounded-full ms-auto transition duration-500 ease-in-out group-hover:border-skin-yellow text-skin-inverted ${
                selectedCategories.includes(slug) &&
                'border-skin-yellow bg-skin-yellow'
              }`}
            >
              {selectedCategories.includes(
                router.locale === 'vi' ? slug : slugEn
              ) && <FaCheck />}
            </span>
          )}
        </button>
      </li>
    </>
  );
}

function CategoryFilterMenu({ items, className }: any) {
  return (
    <ul className={cn(className)}>
      {items?.map((item: any) => (
        <CategoryFilterMenuItem
          key={`${item.slug}-key-${item.id}`}
          item={item}
        />
      ))}
    </ul>
  );
}

export default CategoryFilterMenu;
