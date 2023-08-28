import Link from 'next/link';
import usePrice from '@framework/product/use-price';
import { useCart } from '@contexts/cart/cart.context';
import Text from '@components/ui/text';
import Button from '@components/ui/button';
import { CheckoutItem } from '@components/checkout/checkout-card-item';
import { CheckoutCardFooterItem } from './checkout-card-footer-item';
import { useTranslation } from 'next-i18next';
import Router from 'next/router';
import { ROUTES } from '@utils/routes';
import { useCartItemsQuery } from '@framework/cart/get-cart-items';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCheckoutMutation } from '@framework/checkout/use-checkout';

const CheckoutCard: React.FC = () => {
  const { t } = useTranslation('common');
  const { items, isEmpty, address, resetCart } = useCart();
  const router = useRouter();
  const { data, refetch } = useCartItemsQuery();
  const { mutate: checkout, isLoading } = useCheckoutMutation();
  const [total, setTotal] = useState(0);
  const { price: subtotal } = usePrice({
    amount: Number(router.locale === 'vi' ? total : (total * 43) / 1000000),
    baseAmount: Number(router.locale === 'vi' ? total : (total * 43) / 1000000),
    currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
  });
  useEffect(() => {
    refetch();
    let total = data?.reduce((accumulate: any, item: any) => {
      return accumulate + item.quantity * Number(item.product.price);
    }, 0);
    setTotal(total);
  }, [items, /* isRender, */ data, refetch]);
  function orderHeader() {
    checkout({
      addressId: address.address.id,
      predictDate: new Date(new Date().getTime() + 60 * 60 * 2),
      paymentTotal: total,
      items: data,
    });
    resetCart();
    /* !isEmpty && Router.push(ROUTES.ORDER); */
  }
  const checkoutFooter = [
    /* {
                    id: 1,
                    name: t('text-sub-total'),
                    price: subtotal,
                },
                {
                    id: 2,
                    name: t('text-shipping'),
                    price: '$0',
                }, */
    {
      id: 1,
      name: t('text-total'),
      price: subtotal,
    },
  ];

  return (
    <>
      <div className="border border-skin-base bg-skin-fill rounded-md py-1 xl:py-6 px-4 xl:px-7">
        <div className="flex py-4 rounded-md text-sm font-semibold text-heading">
          <span className="text-15px text-skin-base font-medium">
            {t('text-product')}
          </span>
          <span className="ms-auto flex-shrink-0 text-15px text-skin-base font-medium ">
            {t('text-sub-total')}
          </span>
        </div>
        {!isEmpty && data ? (
          data.map((item) => <CheckoutItem item={item} key={item.id} />)
        ) : (
          <p className="text-skin-red text-opacity-70 py-4">
            {t('text-empty-cart')}
          </p>
        )}
        {checkoutFooter.map((item: any) => (
          <CheckoutCardFooterItem item={item} key={item.id} />
        ))}
        <Button
          variant="formButton"
          className={`w-full mt-8 mb-5 bg-skin-primary text-skin-inverted rounded font-semibold px-4 py-3 transition-all `}
          onClick={orderHeader}
          loading={isLoading}
          disabled={isLoading}
        >
          {/* ${isEmpty ? 'opacity-40 cursor-not-allowed' : ''
                        } */}
          {t('button-order-now')}
        </Button>
      </div>
      {/* <Text className="mt-8">
                {t('text-by-placing-your-order')}{' '}
                <Link href={ROUTES.TERMS}>
                    <a className="text-skin-primary underline font-medium">
                        {t('text-terms-of-service')}{' '}
                    </a>
                </Link>
                {t('text-and')}{' '}
                <Link href={ROUTES.PRIVACY}>
                    <a className="text-skin-primary underline font-medium">
                        {t('text-privacy')}
                    </a>
                </Link>
                . {t('text-credit-debit')}
            </Text>
            <Text className="mt-4">{t('text-bag-fee')}</Text> */}
    </>
  );
};

export default CheckoutCard;
