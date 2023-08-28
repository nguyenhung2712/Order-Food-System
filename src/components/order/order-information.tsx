import { IoCheckmarkCircle } from 'react-icons/io5';
import OrderDetails from '@components/order/order-details';
import { useOrderQuery } from '@framework/order/get-order';
import { useRouter } from 'next/router';
import usePrice from '@framework/product/use-price';
import { useTranslation } from 'next-i18next';
import { generateLocaleDate } from '@utils/generate-locale-date';

export default function OrderInformation() {
  const {
    query: { id },
    locale,
  } = useRouter();

  const { t } = useTranslation('common');
  const { data, isLoading } = useOrderQuery(id?.toString()!);
  const total = Number(data?.payment.paymentTotal);
  /* const { price: total } = usePrice(
          data && {
              amount: data.shipping_fee ? data.total + data.shipping_fee : Number(data.payment.paymentTotal),
              currencyCode: 'USD',
          }
      ); */
  const { price: totalPrice } = usePrice({
    amount: /* data.sale_price ? data.sale_price :  */ Number(
      locale === 'vi' ? total : (total * 43) / 1000000
    ),
    baseAmount: Number(locale === 'vi' ? total : (total * 43) / 1000000),
    currencyCode: locale === 'vi' ? 'VND' : 'USD',
  });
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="xl:px-32 2xl:px-44 3xl:px-56 py-16 lg:py-20">
      <div className="border border-skin-base bg-skin-secondary px-4 lg:px-5 py-4 rounded-md flex items-center justify-start text-skin-base text-sm md:text-base mb-6 lg:mb-8">
        <span className="w-10 h-10 me-3 lg:me-4 rounded-full bg-skin-primary bg-opacity-20 flex items-center justify-center flex-shrink-0">
          <IoCheckmarkCircle className="w-5 h-5 text-skin-primary" />
        </span>
        {t('text-order-received')}
      </div>
      {data && (
        <ul className="border border-skin-base bg-skin-secondary rounded-md flex flex-col md:flex-row mb-7 lg:mb-8 xl:mb-10">
          <li className="text-skin-base font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-skin-two px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
            <span className="uppercase text-xs block text-skin-muted font-normal leading-5">
              {t('text-order-number')}:
            </span>
            {data?.number}
          </li>
          <li className="text-skin-base font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
            <span className="uppercase text-[11px] block text-skin-muted font-normal leading-5">
              {t('text-order-date')}:
            </span>
            {generateLocaleDate(data!.createdAt, locale)}
          </li>
          <li className="text-skin-base font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
            <span className="uppercase text-[11px] block text-skin-muted font-normal leading-5">
              {t('text-predict-date')}:
            </span>
            {generateLocaleDate(data!.predictDate, locale)}
          </li>
          <li className="text-skin-base font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
            <span className="uppercase text-[11px] block text-skin-muted font-normal leading-5">
              {t('text-email')}:
            </span>
            {data?.user.email}
          </li>
          <li className="text-skin-base font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
            <span className="uppercase text-[11px] block text-skin-muted font-normal leading-5">
              {t('text-total')}:
            </span>
            {totalPrice}
          </li>
          <li className="text-skin-base font-semibold text-base lg:text-lg border-b md:border-b-0 md:border-r border-dashed border-gray-300 px-4 lg:px-6 xl:px-8 py-4 md:py-5 lg:py-6 last:border-0">
            <span className="uppercase text-[11px] block text-skin-muted font-normal leading-5">
              {t('text-payment-method')}:
            </span>
            {/* {data?.payment_gateway} */}
            Cash On Delivery
          </li>
        </ul>
      )}
      <p className="text-skin-base text-sm md:text-base mb-8">
        {t('text-pay-cash')}
      </p>

      <OrderDetails />
    </div>
  );
}
