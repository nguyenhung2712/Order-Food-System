import { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import Heading from '@components/ui/heading';
import ProductReviewRating from './product-review-rating';
import { Product1 } from '@framework/types';
import ReviewForm from '@components/common/form/review-form';
import { useCart } from '@contexts/cart/cart.context';
import { useRatingsQuery } from '@framework/rating/get-ratings';
import { LoadingScreen } from '@components/common/loading-screen';
import { useTranslation } from 'next-i18next';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  product?: Product1;
}
const ProductDetailsTab: React.FC<Props> = ({ product }) => {
  const { t } = useTranslation('common');
  let [tabHeading] = useState({
    /* Product_Details: '', */
    'all-rating': '',
    '5-star': '',
    '4-star': '',
    '3-star': '',
    '2-star': '',
    '1-star': '',
  });
  const [five, setFive] = useState([]);
  const [four, setFour] = useState([]);
  const [three, setThree] = useState([]);
  const [two, setTwo] = useState([]);
  const [one, setOne] = useState([]);
  const { temp } = useCart();
  //Load more
  const { data, isLoading, refetch } = useRatingsQuery(product?.id as string);

  useEffect(() => {
    refetch();
  }, [temp, refetch]);

  useEffect(() => {
    if (data) {
      setFive(data.filter((rating: any) => rating.score === '5'));
      setFour(data.filter((rating: any) => rating.score === '4'));
      setThree(data.filter((rating: any) => rating.score === '3'));
      setTwo(data.filter((rating: any) => rating.score === '2'));
      setOne(data.filter((rating: any) => rating.score === '1'));
    }
  }, [data]);

  if (isLoading) return <LoadingScreen size={45} />;

  return (
    <div className="lg:grid grid-cols-2 gap-4 w-full xl:px-2 sm:px-0">
      <div>
        <Tab.Group>
          <Tab.List className="block border-b border-skin-base space-s-8">
            {Object.keys(tabHeading).map((item) => (
              <Tab
                key={item}
                className={({ selected }) =>
                  classNames(
                    'relative inline-block transition-all text-15px lg:text-17px leading-5 text-skin-base focus:outline-none pb-3 lg:pb-5 hover:text-skin-primary',
                    selected
                      ? 'font-semibold after:absolute after:w-full after:h-0.5 after:bottom-0 after:translate-y-[1px] after:start-0 after:bg-skin-primary'
                      : ''
                  )
                }
              >
                {t(`text-${item}`)}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2 lg:mt-4">
            <Tab.Panel>
              <ProductReviewRating data={data} />
            </Tab.Panel>
            <Tab.Panel>
              <ProductReviewRating data={five} />
            </Tab.Panel>
            <Tab.Panel>
              <ProductReviewRating data={four} />
            </Tab.Panel>
            <Tab.Panel>
              <ProductReviewRating data={three} />
            </Tab.Panel>
            <Tab.Panel>
              <ProductReviewRating data={two} />
            </Tab.Panel>
            <Tab.Panel>
              <ProductReviewRating data={one} />
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
      <ReviewForm
        className="lg:w-[500px] xl:w-[540px] 2xl:w-[600px] 3xl:w-[730px] lg:ps-10 xl:ps-14 3xl:ps-20 flex-shrink-0 pt-10"
        product={product}
      />
    </div>
  );
};

export default ProductDetailsTab;
