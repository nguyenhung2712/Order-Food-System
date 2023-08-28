import usePrice from '@framework/product/use-price';
import { calculateTotal } from '@contexts/cart/cart.utils';
import { useRouter } from 'next/router';

export const TotalPrice: React.FC<{ items?: any }> = ({ items }) => {
  const router = useRouter();

  const totalPrice = items.reduce((total: number, item: any) => {
    return total + Number(item.dish.price) * item.quantity;
  }, 0);
  const { price: price } = usePrice({
    amount:
      router.locale === 'vi'
        ? Number(totalPrice)
        : Number(totalPrice * 43) / 1000000,
    baseAmount:
      router.locale === 'vi'
        ? Number(totalPrice)
        : Number(totalPrice * 43) / 1000000,
    currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
  });
  return <span className="total_price">{price}</span>;
};

export const DiscountPrice = (discount: any) => {
  const { price } = usePrice({
    amount: discount?.discount,
    currencyCode: 'USD',
  });
  return <>-{price}</>;
};

export const DeliveryFee = (delivery: any) => {
  const { price } = usePrice({
    amount: delivery?.delivery,
    currencyCode: 'USD',
  });
  return <>{price}</>;
};

export const SubTotalPrice: React.FC<{ items?: any }> = ({ items }) => {
  /* const { price } = usePrice({
        amount: calculateTotal(items),
        currencyCode: 'USD',
    });
    return <>{price}</>; */
  const router = useRouter();

  const totalPrice = items.reduce((total: number, item: any) => {
    return total + Number(item.dish.price) * item.quantity;
  }, 0);
  const { price: price } = usePrice({
    amount:
      router.locale === 'vi'
        ? Number(totalPrice)
        : Number(totalPrice * 43) / 1000000,
    baseAmount:
      router.locale === 'vi'
        ? Number(totalPrice)
        : Number(totalPrice * 43) / 1000000,
    currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
  });
  return <>{price}</>;
};
