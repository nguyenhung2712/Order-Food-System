import { Item } from '@contexts/cart/cart.utils';
import Image from '@components/ui/image';
import { generateCartItemName } from '@utils/generate-cart-item-name';
import usePrice from '@framework/product/use-price';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { ROUTES } from '@utils/routes';

export const CheckoutItem: React.FC<{ item: any }> = ({ item }) => {
  const router = useRouter();
  const total = item?.quantity * Number(item?.product.price);
  const { price } = usePrice({
    amount: /* data.sale_price ? data.sale_price :  */ Number(
      router.locale === 'vi' ? total : (total * 43) / 1000000
    ),
    baseAmount: Number(router.locale === 'vi' ? item : (total * 43) / 1000000),
    currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
  });
  return (
    <div className="flex py-4 items-center  border-b border-skin-base ">
      <div
        className="flex border rounded-md border-skin-base  w-16 h-16 flex-shrink-0 cursor-pointer"
        onClick={() => {
          router.push(`${ROUTES.PRODUCT}/${item.product.slug}`);
        }}
      >
        <Image
          src={
            item.product.image
              .split('|')
              .filter((image: any) => image !== '')[0] ??
            '/assets/placeholder/order-product.svg'
          }
          alt={'item image'}
          className="rounded-md me-5"
          width={64}
          height={64}
        />
      </div>
      <h6 className="text-15px text-skin-base font-normal ps-3">
        {item.product.dishName}
      </h6>
      <div className="flex ms-auto text-15px text-skin-base font-normal  ps-2 flex-shrink-0">
        {price}
      </div>
    </div>
  );
};
