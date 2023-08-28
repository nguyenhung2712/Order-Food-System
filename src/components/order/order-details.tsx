import { useOrderQuery } from '@framework/order/get-order';
import usePrice from '@framework/product/use-price';
import { OrderItem } from '@framework/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import { useOrderDetailsQuery } from '@framework/order/get-order-details';
const OrderItemCard = ({ product }: { product: OrderItem }) => {
  const { locale } = useRouter();
  const { price: itemTotal } = usePrice({
    amount:
      /* data.sale_price ? data.sale_price :  */ locale === 'vi'
        ? product.price * product.quantity
        : (product.price * product.quantity * 43) / 1000000,
    currencyCode: locale === 'vi' ? 'VND' : 'USD',
  });
  return (
    <tr
      className="border-b font-normal border-skin-base last:border-b-0"
      key={product.dish.id}
    >
      <td className="p-4">
        {product.dish.dishName} * {product.quantity}
      </td>
      <td className="p-4">{itemTotal}</td>
    </tr>
  );
};
const OrderDetails: React.FC<{ className?: string }> = ({
  className = 'pt-10 lg:pt-12',
}) => {
  const { t } = useTranslation('common');
  const {
    query: { id },
    locale,
  } = useRouter();
  const { data: order, isLoading: isOrderLoading } = useOrderQuery(
    id?.toString()!
  );

  const { price: subtotal } = usePrice(
    order && {
      amount: /* data.sale_price ? data.sale_price :  */ Number(
        locale === 'vi'
          ? Number(order.payment.paymentTotal)
          : (Number(order.payment.paymentTotal) * 43) / 1000000
      ),
      currencyCode: locale === 'vi' ? 'VND' : 'USD',
    }
  );
  const { price: total } = usePrice(
    order && {
      amount: /* order.shipping_fee
                ? order.total + order.shipping_fee
                :  */ Number(
        locale === 'vi'
          ? Number(order.payment.paymentTotal)
          : (Number(order.payment.paymentTotal) * 43) / 1000000
      ),
      currencyCode: locale === 'vi' ? 'VND' : 'USD',
    }
  );
  /* const { price: shipping } = usePrice(
          order && {
              amount: order.shipping_fee,
              currencyCode: 'USD',
          }
      ); */
  if (isOrderLoading) return <p>Loading...</p>;
  return (
    <div className={className}>
      <Heading variant="heading" className="mb-6 xl:mb-7">
        {t('text-order-details')}:
      </Heading>
      <table className="w-full text-skin-base font-semibold text-sm lg:text-base">
        <thead>
          <tr>
            <th className="bg-skin-secondary p-4 text-start first:rounded-ts-md w-1/2">
              {t('text-product')}
            </th>
            <th className="bg-skin-secondary p-4 text-start last:rounded-te-md w-1/2">
              {t('text-total')}
            </th>
          </tr>
        </thead>
        <tbody>
          {order &&
            order.OrderDetails &&
            order.OrderDetails.map((product, index) => (
              <OrderItemCard key={index} product={product} />
            ))}
        </tbody>
        <tfoot>
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-sub-total')}:</td>
            <td className="p-4">{subtotal}</td>
          </tr>
          {/* <tr className="odd:bg-skin-secondary">
                        <td className="p-4 italic">{t('text-shipping')}:</td>
                        <td className="p-4">
                            {shipping}
                            <span className="text-[13px] font-normal ps-1.5 inline-block">
                                via Flat rate
                            </span>
                        </td>
                    </tr> */}
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-payment-method')}:</td>
            <td className="p-4">
              {/* {order?.payment_gateway} */} Cash On Delivery
            </td>
          </tr>
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-total')}:</td>
            <td className="p-4">{total}</td>
          </tr>
          <tr className="odd:bg-skin-secondary">
            <td className="p-4 italic">{t('text-note')}:</td>
            <td className="p-4">{t('text-new-order')}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderDetails;
