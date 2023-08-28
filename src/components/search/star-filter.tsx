import React, { useEffect } from 'react';
import { CheckBox } from '@components/ui/form/checkbox';
import { useRouter } from 'next/router';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { Disclosure } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import StarIcon from '@components/icons/star-icon';

export const StarFilter = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [formState, setFormState] = React.useState<string[]>([]);
  const { pathname, query, locale } = router;
  useEffect(() => {
    if (query.rating) {
      let temp = (query.rating as string)
        ?.split(',')
        .join('')
        .split(' ')
        .join('')
        .split(locale === 'vi' ? 'sao' : 'star')
        .filter((text) => text !== '');
      setFormState(temp);
    } else {
      setFormState([]);
    }
  }, [query, locale]);
  function handleItemClick(e: React.FormEvent<HTMLInputElement>): void {
    const { value } = e.currentTarget;
    let currentFormState = formState.includes(value)
      ? formState.filter((i) => i !== value.toString())
      : [...formState, value];

    setFormState(currentFormState);
    const { rating, ...restQuery } = query;

    router.push(
      {
        pathname,
        query: {
          ...restQuery,
          ...(currentFormState && currentFormState.length > 0
            ? {
                rating: currentFormState
                  .map((str) => str + (locale === 'vi' ? ' sao' : ' star'))
                  .join(','),
              }
            : {}),
        },
      },
      undefined,
      { scroll: false }
    );
  }
  console.log(formState);

  const items = [
    {
      label: t('text-5-start'),
      slug: '5-star',
      number: 5,
    },
    {
      label: t('text-4-start'),
      slug: '4-star',
      number: 4,
    },
    {
      label: t('text-3-start'),
      slug: '3-star',
      number: 3,
    },
    {
      label: t('text-2-start'),
      slug: '2-star',
      number: 2,
    },
    {
      label: t('text-1-start'),
      slug: '1-star',
      number: 1,
    },
  ];
  return (
    <div className="block">
      <Heading className="mb-5 -mt-1">{t('text-rating-needs')}</Heading>
      <div className="p-5 flex flex-col border border-skin-base rounded-md">
        {items?.slice(0, 3)?.map((item: any, index: number) => (
          <CheckBox
            key={index}
            component={
              <div className="flex space-s-1 ms-1 ">
                {[...Array(5)].map((_, idx) => {
                  return (
                    <div className="relative" key={idx}>
                      <div
                        style={{
                          width: idx + 1 <= item.number ? '100%' : '0%',
                        }}
                        className="absolute top-0 left-0 z-50 overflow-hidden"
                      >
                        <StarIcon
                          color="#F3B81F"
                          className="w-3.5 lg:w-4 h-3.5 lg:h-4"
                        />
                      </div>
                      <StarIcon
                        color="#DFE6ED"
                        className="w-3.5 lg:w-4 h-3.5 lg:h-4 "
                      />
                    </div>
                  );
                })}
              </div>
            }
            name={item.label.toLowerCase()}
            checked={formState.includes(item.number.toString())}
            value={item.number}
            onChange={handleItemClick}
          />
        ))}
        {items!.length > 3 && (
          <div className="w-full">
            <Disclosure>
              {({ open }) => (
                <>
                  <Disclosure.Panel className="pt-4 pb-2">
                    {items
                      .slice(3, items.length)
                      .map((item: any, index: number) => (
                        <CheckBox
                          key={index}
                          component={
                            <div className="flex space-s-1 ms-1 ">
                              {[...Array(5)].map((_, idx) => {
                                return (
                                  <div className="relative" key={idx}>
                                    <div
                                      style={{
                                        width:
                                          idx + 1 <= item.number
                                            ? '100%'
                                            : '0%',
                                      }}
                                      className="absolute top-0 left-0 z-50 overflow-hidden"
                                    >
                                      <StarIcon
                                        color="#F3B81F"
                                        className="w-3.5 lg:w-4 h-3.5 lg:h-4"
                                      />
                                    </div>
                                    <StarIcon
                                      color="#DFE6ED"
                                      className="w-3.5 lg:w-4 h-3.5 lg:h-4 "
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          }
                          name={item.label.toLowerCase()}
                          checked={formState.includes(item.number.toString())}
                          value={item.number}
                          onChange={handleItemClick}
                        />
                      ))}
                  </Disclosure.Panel>
                  <Disclosure.Button className="flex justify-center items-center w-full px-4 pt-3.5 pb-1 text-sm font-medium text-center text-skin-primary focus:outline-none">
                    {open ? (
                      <>
                        <span className="inline-block pe-1">
                          {t('text-see-less')}
                        </span>
                        <IoIosArrowUp className="text-skin-base text-opacity-60 text-15px" />
                      </>
                    ) : (
                      <>
                        <span className="inline-block pe-1">
                          {t('text-see-more')}
                        </span>
                        <IoIosArrowDown className="text-skin-base text-opacity-60 text-15px" />
                      </>
                    )}
                  </Disclosure.Button>
                </>
              )}
            </Disclosure>
          </div>
        )}
      </div>
    </div>
  );
};
