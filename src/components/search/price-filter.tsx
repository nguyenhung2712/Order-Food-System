import React, { useState, useEffect } from 'react';
import { CheckBox } from '@components/ui/form/checkbox';
import { useDietaryQuery } from '@framework/dietary/get-all-dietary';
import { useRouter } from 'next/router';
import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io';
import { Disclosure } from '@headlessui/react';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import StarIcon from '@components/icons/star-icon';
import { useUI } from '@contexts/ui.context';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import { numberFormatter } from '@utils/generate-locale-date';

const PriceFilter = () => {
  const { locale } = useRouter();
  const { items, setFoundedItems } = useUI();
  const [maxValue, setMaxvalue] = useState<number>();
  const [temp, setTemp] = useState<boolean>(false);
  const [value, setValue] = useState<any>({
    min: 0,
    max: maxValue,
  });

  useEffect(() => {
    setFoundedItems(
      items.filter(
        (item: any) =>
          (locale === 'en'
            ? (Number(item.price) * 43) / 1000000
            : Number(item.price)) >= value.min &&
          (locale === 'en'
            ? (Number(item.price) * 43) / 1000000
            : Number(item.price)) <= value.max
      )
    );
  }, [temp, items, locale, setFoundedItems, value.max, value.min]);
  useEffect(() => {
    if (items.length > 0) {
      setMaxvalue(
        Math.max(
          ...items.map((item: any) =>
            locale === 'en'
              ? (Number(item.price) * 43) / 1000000
              : Number(item.price)
          )
        )
      );
    }
  }, [temp, items, locale, setMaxvalue]);
  useEffect(() => {
    setValue({ min: 0, max: maxValue });
  }, [maxValue, setValue]);

  const { t } = useTranslation('common');
  return (
    <>
      <div className="block">
        <Heading className="mb-5 -mt-1">{t('text-price-needs')}</Heading>
      </div>
      <div className="flex mx-5">
        <InputRange
          maxValue={maxValue}
          minValue={0}
          value={value}
          onChange={(value) => setValue(value)}
          onChangeComplete={() => setTemp((prev) => !prev)}
          formatLabel={(value) =>
            `${
              value === 0
                ? 0
                : value < 1
                ? value.toFixed(2)
                : numberFormatter(value, 2)
            } ${locale === 'vi' ? 'đ' : '$'}`
          }
          step={locale === 'vi' ? 1000 : 0.001}
          draggableTrack={true}
        />
      </div>
    </>
  );
};

export default PriceFilter;
