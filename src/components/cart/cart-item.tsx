import Link from '@components/ui/link';
import Image from '@components/ui/image';
import { IoIosCloseCircle } from 'react-icons/io';
import { useCart } from '@contexts/cart/cart.context';
import usePrice from '@framework/product/use-price';
import { ROUTES } from '@utils/routes';
import Counter from '@components/ui/counter';
import { useRouter } from 'next/router';
import { memo } from 'react';
import Cookies from 'js-cookie';

type CartItemProps = {
  item: any;
  render: (...args: any[]) => void;
};

const CartItem: React.FC<CartItemProps> = ({ item, render }) => {
  const {
    /* isInStock, */ addItemToCart,
    removeItemFromCart,
    clearItemFromCart,
  } = useCart();
  const router = useRouter();
  /* const { price: totalPrice } = usePrice({
          amount: item?.itemTotal,
          currencyCode: 'USD',
      }); */

  const total = item?.quantity * Number(item?.product.price);
  const { price: totalPrice } = usePrice({
    amount: /* data.sale_price ? data.sale_price :  */ Number(
      router.locale === 'vi' ? total : (total * 43) / 1000000
    ),
    baseAmount: Number(router.locale === 'vi' ? total : (total * 43) / 1000000),
    currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
  });
  /* const outOfStock = !isInStock(item.id); */
  const addItem = () => {
    addItemToCart(item, 1);
    render((prev: any) => !prev);
  };
  const removeItem = () => {
    const cart = JSON.parse(Cookies.get('cart') as string);
    removeItemFromCart(item.product.id, cart.id);
    render((prev: any) => !prev);
  };
  const clearItem = () => {
    const cart = JSON.parse(Cookies.get('cart') as string);
    clearItemFromCart(item.product.id, cart.id);
    render((prev: any) => !prev);
  };
  return (
    <div
      className={`group w-full h-auto flex justify-start items-center bg-skin-fill py-4 md:py-7 border-b border-skin-one border-opacity-70 relative last:border-b-0 cursor-pointer"`}
      title={item?.name}
    >
      <div className="relative flex rounded overflow-hidden flex-shrink-0 cursor-pointer w-[90px] md:w-[100px] h-[90px] md:h-[100px]">
        <Image
          src={
            item.product.image
              .split('|')
              .filter((image: any) => image !== '')[0] ??
            '/assets/placeholder/cart-item.svg'
          }
          width={100}
          height={100}
          loading="eager"
          alt={item.product.dishName || 'Product Image'}
          className="object-cover bg-skin-thumbnail"
        />
        <div
          className="absolute top-0 start-0 h-full w-full bg-black bg-opacity-30 md:bg-opacity-0 flex justify-center items-center transition duration-200 ease-in-out md:group-hover:bg-opacity-30"
          /* onClick={() => { render((prev: any) => !prev); return clearItemFromCart(item.product.id) }} */
          onClick={clearItem}
          role="button"
        >
          <IoIosCloseCircle className="relative text-white text-2xl transform md:scale-0 md:opacity-0 transition duration-300 ease-in-out md:group-hover:scale-100 md:group-hover:opacity-100" />
        </div>
      </div>

      <div className="flex w-full overflow-hidden items-start justify-between">
        <div className="ps-3 md:ps-4">
          <Link
            href={`${ROUTES.PRODUCT}/${item.product.slug}`}
            className="block text-skin-base text-13px sm:text-sm lg:text-15px transition-all leading-5 hover:text-skin-primary"
          >
            {item.product.dishName}
          </Link>
          <div className="text-13px sm:text-sm text-skin-muted mt-1.5 block mb-2">
            {item.product.type.unit} X {item.quantity}
          </div>
          <Counter
            value={item.quantity}
            /* onIncrement={() => { render((prev: any) => !prev); return addItemToCart(item, 1); }}
                                    onDecrement={() => { render((prev: any) => !prev); return removeItemFromCart(item.product.id) }} */
            onIncrement={addItem}
            onDecrement={removeItem}
            variant="cart"
            /* disabled={outOfStock} */
          />
        </div>

        <div className="flex font-semibold text-sm md:text-base text-skin-base leading-5 flex-shrink-0 min-w-[65px] md:min-w-[80px] justify-end">
          {totalPrice}
        </div>
      </div>
    </div>
  );
};

export default memo(CartItem);
