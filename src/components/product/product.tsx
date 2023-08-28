import { useState, useEffect } from 'react';
import Button from '@components/ui/button';
import Counter from '@components/ui/counter';
import { useRouter } from 'next/router';
import { ROUTES } from '@utils/routes';
import useWindowSize from '@utils/use-window-size';
import { useProductQuery } from '@framework/product/get-product';
import { getVariations } from '@framework/utils/get-variations';
import usePrice from '@framework/product/use-price';
import { useCart } from '@contexts/cart/cart.context';
import { generateCartItem } from '@utils/generate-cart-item';
import ProductAttributes from '@components/product/product-attributes';
import isEmpty from 'lodash/isEmpty';
import { useUI } from '@contexts/ui.context';
import { toast } from 'react-toastify';
import ThumbnailCarousel from '@components/ui/carousel/thumbnail-carousel';
import { useTranslation } from 'next-i18next';
import Image from '@components/ui/image';
import CartIcon from '@components/icons/cart-icon';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import TagLabel from '@components/ui/tag-label';
import LabelIcon from '@components/icons/label-icon';
import { IoArrowRedoOutline } from 'react-icons/io5';
import SocialShareBox from '@components/ui/social-share-box';
import ProductDetailsTab from '@components/product/product-details/product-tab';
import VariationPrice from './variation-price';
import isEqual from 'lodash/isEqual';
import StarIcon from '@components/icons/star-icon';
import { useRatingsQuery } from '@framework/rating/get-ratings';
import { BsEyeFill } from 'react-icons/bs';
import { Tab } from '@headlessui/react';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const ProductSingleDetails: React.FC = () => {
  const { t } = useTranslation('common');
  const { isAuthorized } = useUI();
  const router = useRouter();
  const {
    query: { slug },
  } = router;

  const { width } = useWindowSize();
  const { data, isLoading } = useProductQuery(slug as string);
  const { data: ratings } = useRatingsQuery(data?.id);

  const gallery = data?.image.split('|').filter((image: any) => image !== '');
  const { addItemToCart, isInCart, getItemFromCart /* , isInStock  */ } =
    useCart();
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const [favorite, setFavorite] = useState<boolean>(false);
  const [quantity, setQuantity] = useState(1);
  const [ratingScore, setRatingScore] = useState(0);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const [addToWishlistLoader, setAddToWishlistLoader] =
    useState<boolean>(false);
  const [shareButtonStatus, setShareButtonStatus] = useState<boolean>(false);
  const productUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${ROUTES.PRODUCT}/${router.query.slug}`;
  const { price, basePrice, discount } = usePrice(
    /* data && {
                amount: data.sale_price ? data.sale_price : Number(router.locale === "vi" ? data.price : (data.price * 43) / 1000000),
                baseAmount: Number(router.locale === "vi" ? data.price : (data.price * 43) / 1000000),
                currencyCode: router.locale === "vi" ? "VND" : "USD",
            } */
    {
      amount: Number(
        router.locale === 'vi' ? data?.price : (data?.price! * 43) / 1000000
      ),
      baseAmount: Number(
        router.locale === 'vi' ? data?.price : (data?.price! * 43) / 1000000
      ),
      currencyCode: router.locale === 'vi' ? 'VND' : 'USD',
    }
  );
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
  const handleChange = () => {
    setShareButtonStatus(!shareButtonStatus);
  };
  if (isLoading) return <p>Loading...</p>;
  /* const variations = getVariations(data?.variations); */

  /* const isSelected = !isEmpty(variations)
          ? !isEmpty(attributes) &&
          Object.keys(variations).every((variation) =>
              attributes.hasOwnProperty(variation)
          )
          : true;
      let selectedVariation: any = {};
      if (isSelected) {
          const dataVaiOption: any = data?.variation_options;
          selectedVariation = dataVaiOption?.find((o: any) =>
              isEqual(
                  o.options.map((v: any) => v.value).sort(),
                  Object.values(attributes).sort()
              )
          ); */
  const item = generateCartItem(data! /*  selectedVariation */);
  /* const outOfStock = isInCart(item.id) && !isInStock(item.id); */
  function addToCart() {
    /* if (!isSelected) return; */
    /* to show btn feedback while product carting */
    setAddToCartLoader(true);
    setTimeout(() => {
      setAddToCartLoader(false);
    }, 1500);

    const item = generateCartItem(data! /* , selectedVariation */);
    addItemToCart(item, selectedQuantity);
    toast('Added to the bag', {
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

  function round(value: any, precision: any) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
  return (
    <div className="pt-6 md:pt-7 pb-2">
      <div className="lg:grid grid-cols-10 gap-7 2xl:gap-8">
        <div className="col-span-5 xl:col-span-6 overflow-hidden mb-6 md:mb-8 lg:mb-0">
          {!!gallery?.length ? (
            <ThumbnailCarousel
              gallery={gallery}
              thumbnailClassName="xl:w-[700px] 2xl:w-[900px]"
              galleryClassName="xl:w-[150px] 2xl:w-[170px]"
            />
          ) : (
            <div className="w-auto flex items-center justify-center">
              <Image
                src={'/product-placeholder.svg'}
                alt={data?.dishName!}
                width={900}
                height={680}
              />
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex flex-col col-span-5 xl:col-span-4 xl:ps-2">
          <div className="pb-3 lg:pb-5">
            <div className="block -mt-1.5">
              <h2 className="text-skin-base text-lg md:text-xl xl:text-2xl font-medium transition-colors duration-300">
                {router.locale === 'vi' ? data?.dishName : data?.dishNameEn}
              </h2>
            </div>
            <div className="my-3 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-skin-primary text-white rounded-full">
              {data?.type.typeName}
            </div>
            <div className="my-3 mx-2 text-xs inline-flex items-center font-bold leading-sm uppercase px-3 py-1 bg-skin-primary text-white rounded-full">
              {data?.status === 1
                ? router.locale === 'vi'
                  ? 'Đang bán'
                  : 'On Sale'
                : router.locale === 'vi'
                ? 'Đã hết'
                : 'Out of stock'}
            </div>
            <div className="text-skin-base font-bold text-base md:text-xl xl:text-[22px]">
              {price}
            </div>

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
                          (round(ratingScore - idx, 2) * 100).toString() + '%';
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
                  {ratings && ratings.length > 0 ? ratings.length : 0} ratings
                </div>
              </div>
            </div>
            <div className="text-skin-base text-base md:text-[16px] xl:text-[18px]">
              <BsEyeFill className="inline text-skin-primary mr-2" />
              Views: <span>{data.views}</span>
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
            />
            <Button
              onClick={addToCart}
              className="w-full px-1.5"
              disabled={/* !isSelected ||  */ !isAuthorized}
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
      <div className="w-full xl:px-2 py-11 lg:py-14 xl:py-16 sm:px-0">
        <Tab.Group>
          <Tab.List className="block border-b border-skin-base space-s-8">
            <Tab
              className={({ selected }) =>
                classNames(
                  'relative inline-block transition-all text-15px lg:text-17px leading-5 text-skin-base focus:outline-none pb-3 lg:pb-5 hover:text-skin-primary',
                  selected
                    ? 'font-semibold after:absolute after:w-full after:h-0.5 after:bottom-0 after:translate-y-[1px] after:start-0 after:bg-skin-primary'
                    : ''
                )
              }
            >
              {t('text-ratings')}
            </Tab>
            <Tab
              className={({ selected }) =>
                classNames(
                  'relative inline-block transition-all text-15px lg:text-17px leading-5 text-skin-base focus:outline-none pb-3 lg:pb-5 hover:text-skin-primary',
                  selected
                    ? 'font-semibold after:absolute after:w-full after:h-0.5 after:bottom-0 after:translate-y-[1px] after:start-0 after:bg-skin-primary'
                    : ''
                )
              }
            >
              {t('text-ingredients')}
            </Tab>
          </Tab.List>
          <Tab.Panels className="mt-2 lg:mt-4">
            <Tab.Panel>
              <ProductDetailsTab product={data} />
            </Tab.Panel>
            <Tab.Panel>
              <ul className="list mt-5">
                {data.ingredients
                  .replaceAll(/[.]/g, '')
                  .split(', ')
                  .map((ingre: any, index: number) => (
                    <li
                      key={index}
                      style={{
                        textTransform: 'capitalize',
                        margin: 5,
                      }}
                    >
                      {ingre}
                    </li>
                  ))}
              </ul>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default ProductSingleDetails;
