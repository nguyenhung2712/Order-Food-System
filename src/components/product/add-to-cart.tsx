import Counter from '@components/ui/counter';
import { useCart } from '@contexts/cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import PlusIcon from '@components/icons/plus-icon';
import useWindowSize from '@utils/use-window-size';
import { memo } from 'react';
import Cookies from 'js-cookie';

interface Props {
  data: any;
  variation?: any;
  disabled?: boolean;
}

const AddToCart = memo(({ data, variation, disabled }: Props) => {
  const { width } = useWindowSize();
  const {
    addItemToCart,
    removeItemFromCart,
    /* isInStock, */
    getItemFromCart,
    isInCart,
    items,
  } = useCart();

  const item = generateCartItem(data! /* , variation */);
  const handleAddClick = (
    e: React.MouseEvent<HTMLButtonElement | MouseEvent>
  ) => {
    e.stopPropagation();
    addItemToCart(item, 1);
  };
  const handleRemoveClick = (e: any) => {
    e.stopPropagation();
    const cart = JSON.parse(Cookies.get('cart') as string);
    removeItemFromCart(item.product.id as string, cart.id);
  };

  /* const outOfStock = isInCart(item?.id) && !isInStock(item.id); */
  const iconSize = width! > 480 ? '19' : '17';
  return !isInCart(item?.product!.id) ? (
    <button
      className="bg-skin-primary rounded-full w-8 lg:w-10 h-8 lg:h-10 text-skin-inverted text-4xl flex items-center justify-center focus:outline-none"
      aria-label="Count Button"
      onClick={handleAddClick}
      /* disabled={disabled || outOfStock} */
    >
      <PlusIcon width={iconSize} height={iconSize} opacity="1" />
    </button>
  ) : (
    <Counter
      value={
        items.length > 0
          ? items
              .filter((item: any) => item.product.id === data.id)
              .map((item: any) => item.quantity)[0]
          : 0
      }
      onDecrement={handleRemoveClick}
      onIncrement={handleAddClick}
      /* disabled={outOfStock} */
    />
  );
});

AddToCart.displayName = 'Add to Cart';

export { AddToCart };
