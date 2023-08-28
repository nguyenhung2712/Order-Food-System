import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';
import { ROUTES } from '@utils/routes';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useCart } from '@contexts/cart/cart.context';
import { useUI } from '@contexts/ui.context';
import ProductAttributes from '@components/product/product-attributes';
import { generateCartItem } from '@utils/generate-cart-item';
import usePrice from '@framework/product/use-price';
import { getVariations } from '@framework/utils/get-variations';
import { useTranslation } from 'next-i18next';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import TagLabel from '@components/ui/tag-label';
import LabelIcon from '@components/icons/label-icon';
import { IoArrowRedoOutline } from 'react-icons/io5';
import RelatedProductFeed from '@components/product/feeds/related-product-feed';
import SocialShareBox from '@components/ui/social-share-box';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import { toast } from 'react-toastify';
import useWindowSize from '@utils/use-window-size';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import { productGalleryPlaceholder } from '@assets/placeholders';
import StarIcon from '@components/icons/star-icon';
import { useRatingsQuery } from '@framework/rating/get-ratings';
import { useUpdateProductMutation } from '@framework/product/use-update-product';
import { BsEyeFill } from 'react-icons/bs';
import cn from 'classnames';

const breakpoints = {
  '1536': {
    slidesPerView: 6,
  },
  '1280': {
    slidesPerView: 5,
  },
  '1024': {
    slidesPerView: 4,
  },
  '640': {
    slidesPerView: 3,
  },
  '360': {
    slidesPerView: 2,
  },
  '0': {
    slidesPerView: 1,
  },
};

export default function ProductPopup() {
  const { t } = useTranslation('common');
  const { isAuthorized } = useUI();
  const { data } = useModalState();
  const { width } = useWindowSize();
  const { closeModal } = useModalAction();
  const { mutate: updateProduct, isLoading } = useUpdateProductMutation();
  const router = useRouter();
  const { addItemToCart, isInCart, getItemFromCart /* , isInStock */ } =
    useCart();
  const { data: ratings } = useRatingsQuery(data?.id);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [ratingScore, setRatingScore] = useState(0);
  const [currentSize, setCurSize] = useState<any>();
  const [favorite, setFavorite] = useState<boolean>(false);
  const [addToWishlistLoader, setAddToWishlistLoader] =
    useState<boolean>(false);
  const [shareButtonStatus, setShareButtonStatus] = useState<boolean>(false);
  const { price, basePrice, discount } = usePrice({
    amount: Number(
      router.locale === 'vi' ? data.price : (data.price * 43) / 1000000
    ),
    baseAmount: Number(
      router.locale === 'vi' ? data.price : (data.price * 43) / 1000000
    ),
    currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
  });
  const priceTemp = data.DishHasSizes?.map((size: any) => Number(size.price));
  const maxP = priceTemp ? Math.max(...priceTemp) : 0;
  const minP = priceTemp ? Math.min(...priceTemp) : 0;

  const { price: minPrice } = usePrice({
    amount: router.locale === 'vi' ? minP : (minP * 43) / 1000000,
    baseAmount: router.locale === 'vi' ? minP : (minP * 43) / 1000000,
    currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
  });
  const { price: maxPrice } = usePrice({
    amount: router.locale === 'vi' ? maxP : (maxP * 43) / 1000000,
    baseAmount: router.locale === 'vi' ? maxP : (maxP * 43) / 1000000,
    currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
  });

  const variations = getVariations(data.variations);
  const { slug, image, dishName, ingredients, status, id, dishNameEn } = data;
  console.log(data);
  const gallery = image.split('|').filter((image: any) => image !== '');

  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.PRODUCT}/${slug}`;
  const handleChange = () => {
    setShareButtonStatus(!shareButtonStatus);
  };
  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation)
      )
    : true;
  const item = generateCartItem(data);

  /* const outOfStock = isInCart(item.id) && !isInStock(item.id); */
  useEffect(() => {
    if (ratings) {
      setRatingScore(
        ratings && ratings.length > 0
          ? ratings.reduce(
              (acc: any, rating: any) => acc + Number(rating.score),
              0
            ) / ratings.length
          : 0
      );
    }
  }, [ratings]);
  function addToCart() {
    if (!isSelected) return;
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 1500);
    addItemToCart(item, selectedQuantity);
    toast(t('text-added-bag'), {
      progressClassName: 'fancy-progress-bar',
      position: width! > 768 ? 'bottom-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }
  function addToWishlist() {
    setAddToWishlistLoader(true);
    setFavorite(!favorite);
    const toastStatus: string =
      favorite === true ? t('text-remove-favorite') : t('text-added-favorite');
    setTimeout(() => {
      setAddToWishlistLoader(false);
    }, 1500);
    toast(toastStatus, {
      progressClassName: 'fancy-progress-bar',
      position: width! > 768 ? 'bottom-right' : 'top-right',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  function navigateToProductPage() {
    closeModal();
    router.push(`${ROUTES.PRODUCTS}/${data.slug}`);
    /*  updateProduct({ views: data.views + 1, productId: id }); */
  }

  function round(value: any, precision: any) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  useEffect(() => setSelectedQuantity(1), [data.id]);
  return (
    <div className="md:w-[600px] lg:w-[940px] xl:w-[1180px] 2xl:w-[1360px] mx-auto p-1 lg:p-0 xl:p-3 bg-skin-fill rounded-md">
      <CloseButton onClick={closeModal} />
      <div className="overflow-hidden">
        <div className="px-4 md:px-6 lg:p-8 2xl:p-10 mb-9 lg:mb-2 pt-4 md:pt-7 2xl:pt-10">
          <div className="lg:flex items-start justify-between">
            <div className="xl:flex items-center justify-center overflow-hidden mb-6 md:mb-8 lg:mb-0">
              {!!gallery?.length ? (
                <ThumbnailCarousel gallery={gallery} />
              ) : (
                <div className="w-auto flex items-center justify-center">
                  <Image
                    src={productGalleryPlaceholder}
                    alt={dishName!}
                    width={650}
                    height={590}
                  />
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex flex-col lg:ps-5 xl:ps-8 2xl:ps-10 lg:w-[430px] xl:w-[470px] 2xl:w-[480px]">
              <div className="pb-5">
                <div
                  className="mb-2 md:mb-2.5 block -mt-1.5"
                  onClick={navigateToProductPage}
                  role="button"
                >
                  <h2 className="text-skin-base text-lg md:text-xl xl:text-2xl font-medium transition-colors duration-300 hover:text-skin-primary">
                    {router.locale === 'vi' ? dishName : dishNameEn}
                  </h2>
                </div>
                {/* {unit && isEmpty(variations) ? (
                                    <div className="text-sm md:text-15px font-medium">{unit}</div>
                                ) : (
                                    <VariationPrice
                                        selectedVariation={selectedVariation}
                                        minPrice={data.min_price}
                                        maxPrice={data.max_price}
                                    />
                                )} */}
                <div className="my-3 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-skin-primary text-white rounded-full">
                  {router.locale === 'vi'
                    ? data?.type.typeName
                    : data?.type.typeNameEn}
                </div>
                <div className="my-3 mx-2 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-skin-primary text-white rounded-full">
                  {data?.status === 1
                    ? router.locale === 'vi'
                      ? 'Đang bán'
                      : 'On Sale'
                    : router.locale === 'vi'
                    ? 'Tạm xóa'
                    : 'Deleted'}
                </div>
                <div className="text-skin-base font-bold text-base md:text-xl xl:text-[22px] py-4">
                  {data.DishHasSizes.length > 0
                    ? `${minPrice} - ${maxPrice}`
                    : price}
                </div>
                {data.DishHasSizes.length > 0 && (
                  <div className={cn('mb-2 pt-0.5')}>
                    <h4 className="text-15px text-skin-base text-opacity-70 font-normal mb-3 capitalize">
                      {data.DishHasSizes.every(
                        (size: any) => size.quantityLeft === 0
                      )
                        ? t('text-out-stock')
                        : t('text-product-available')}
                      :
                    </h4>

                    <ul className="flex flex-wrap -me-2">
                      {data.DishHasSizes.map((size: any) => (
                        <li
                          key={size.size.id}
                          className={cn(
                            'cursor-pointer rounded border h-9 md:h-10 p-1 mb-2 md:mb-3 me-2 flex justify-center items-center font-medium text-sm md:text-15px text-skin-base transition duration-200 ease-in-out hover:text-skin-primary hover:border-skin-primary px-3',
                            {
                              'border-skin-primary text-skin-primary':
                                currentSize?.size.id === size.size.id,
                            }
                          )}
                          onClick={() => {
                            setCurSize(size);
                            setSelectedQuantity(1);
                          }}
                        >
                          {t(`text-${size.size.sizeEn}`)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentSize &&
                  data.DishHasSizes.length > 0 &&
                  (currentSize.quantityLeft > 0 ? (
                    <span className="text-sm font-medium text-skin-yellow-two my-3 inline-block">
                      {router.locale === 'en'
                        ? t('text-only') +
                          ' ' +
                          currentSize.quantityLeft +
                          ' ' +
                          t('text-left-item')
                        : t('text-only') +
                          ' ' +
                          t('text-left-item') +
                          ' ' +
                          currentSize.quantityLeft}
                    </span>
                  ) : (
                    <div className="text-base text-red-500 whitespace-nowrap">
                      {t('text-out-stock')}
                    </div>
                  ))}
                {data.DishHasSizes.length === 0 && (
                  <span className="text-sm font-medium text-skin-yellow-two">
                    {data.quantityLeft > 0
                      ? router.locale === 'en'
                        ? t('text-only') +
                          ' ' +
                          data.quantityLeft +
                          ' ' +
                          t('text-left-item')
                        : t('text-only') +
                          ' ' +
                          t('text-left-item') +
                          ' ' +
                          data.quantityLeft
                      : t('text-out-stock')}
                  </span>
                )}
                <div className="my-3">
                  <div className="flex basis-auto items-center">
                    <div className="text-[#F3B81F] underline pe-2">
                      {ratingScore}
                    </div>
                    <div className="flex space-s-1 ms-1 ">
                      {[...Array(5)].map((_, idx) => {
                        let widthPercent;
                        if (idx + 1 >= ratingScore) {
                          if (ratingScore - idx > 0) {
                            widthPercent =
                              (round(ratingScore - idx, 2) * 100).toString() +
                              '%';
                          } else {
                            widthPercent = '0%';
                          }
                        }
                        return (
                          <div className="relative" key={idx}>
                            <div
                              style={{
                                width:
                                  idx + 1 < ratingScore ? '100%' : widthPercent,
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
                    <div className="text-[#F3B81F] ps-2">
                      {ratings && ratings.length > 0 ? ratings.length : 0}{' '}
                      {t('text-ratings')}
                    </div>
                  </div>
                </div>
                <div className="text-skin-base text-base md:text-[16px] xl:text-[18px] flex items-center">
                  <BsEyeFill className="inline text-skin-primary mr-2" />
                  {t('text-views')}:{' '}
                  <span className="ml-2">
                    {
                      data.Interacts.filter(
                        (interact: any) => interact.type === 3
                      ).length
                    }{' '}
                  </span>
                </div>
              </div>

              <div className="pt-1.5 lg:pt-3 xl:pt-4 space-y-2.5 md:space-y-3.5">
                <Counter
                  variant="single"
                  value={selectedQuantity}
                  onIncrement={() => setSelectedQuantity((prev) => prev + 1)}
                  onDecrement={() =>
                    setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
                  }
                  disabled={
                    status === 0 ||
                    selectedQuantity >
                      (data.DishHasSizes.length > 0
                        ? currentSize
                          ? currentSize.quantityLeft - 1
                          : selectedQuantity - 1
                        : data.quantityLeft - 1)
                  }
                />
                <Button
                  onClick={addToCart}
                  className="w-full px-1.5"
                  disabled={!isSelected || !isAuthorized || status === 0}
                  loading={addToCartLoader}
                >
                  <CartIcon color="#ffffff" className="me-3" />
                  {t('text-add-to-cart')}
                </Button>
                <div className="grid grid-cols-2 gap-2.5">
                  <Button
                    variant="border"
                    onClick={addToWishlist}
                    loading={addToWishlistLoader}
                    className={`group hover:text-skin-primary ${
                      favorite === true && 'text-skin-primary'
                    }`}
                  >
                    {favorite === true ? (
                      <IoIosHeart className="text-2xl md:text-[26px] me-2 transition-all" />
                    ) : (
                      <IoIosHeartEmpty className="text-2xl md:text-[26px] me-2 transition-all group-hover:text-skin-primary" />
                    )}

                    {t('text-wishlist')}
                  </Button>
                  <div className="relative group">
                    <Button
                      variant="border"
                      className={`w-full hover:text-skin-primary ${
                        shareButtonStatus === true && 'text-skin-primary'
                      }`}
                      onClick={handleChange}
                    >
                      <IoArrowRedoOutline className="text-2xl md:text-[26px] me-2 transition-all group-hover:text-skin-primary" />
                      {t('text-share')}
                    </Button>
                    <SocialShareBox
                      className={`absolute z-10 end-0 w-[300px] md:min-w-[400px] transition-all duration-300 ${
                        shareButtonStatus === true
                          ? 'visible opacity-100 top-full'
                          : 'opacity-0 invisible top-[130%]'
                      }`}
                      shareUrl={productUrl}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <RelatedProductFeed
          type={data.type}
          carouselBreakpoint={breakpoints}
          className="mb-0.5 md:mb-2 lg:mb-3.5 xl:mb-4 2xl:mb-6"
        />
      </div>
    </div>
  );
}
