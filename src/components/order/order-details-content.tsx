import usePrice from '@framework/product/use-price';
import Image from '@components/ui/image';
import { useRouter } from 'next/router';
import { ROUTES } from '@utils/routes';
import { useUI } from '@contexts/ui.context';

export const OrderDetailsContent: React.FC<{ item?: any }> = ({ item }) => {
  const router = useRouter();
  const { closeDrawer } = useUI();
  const { price: price } = usePrice({
    amount:
      router.locale === 'vi'
        ? Number(item.dish.price)
        : Number(item.dish.price * 43) / 1000000,
    baseAmount:
      router.locale === 'vi'
        ? Number(item.dish.price)
        : Number(item.dish.price * 43) / 1000000,
    currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
  });

  return (
    <div
      className="relative grid grid-cols-12 py-2 pb-0 border-b border-solid border-skin-base text-[12px] md:text-[14px] cursor-pointer"
      onClick={() => {
        router.push(`${ROUTES.PRODUCT}/${item.dish.slug}`);
        return closeDrawer();
      }}
    >
      <div className="col-span-2 self-center">
        <Image
          src={
            item.dish.image
              .split('|')
              .filter((image: any) => image !== '')[0] ??
            '/assets/placeholder/cart-item.svg'
          }
          alt={item?.name || 'Product Image'}
          width="60"
          height="60"
          quality={100}
          className="object-cover"
        />
      </div>
      <div className="col-span-5 self-center">
        <h2 className="text-skin-base">{item.dish.dishName}</h2>
      </div>
      <div className="col-span-3 self-center md:text-start text-center">
        {typeof item.quantity === 'number' && <p>{item.quantity}x</p>}
      </div>
      <div className="col-span-2 self-center">
        <p>{price}</p>
      </div>
    </div>
  );
};
