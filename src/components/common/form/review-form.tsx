import { useState } from 'react';
import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import TextArea from '@components/ui/form/text-area';
import { useTranslation } from 'next-i18next';
import Heading from '@components/ui/heading';
import Text from '@components/ui/text';
import cn from 'classnames';
import StarRatingComponent from 'react-star-rating-component';
import StarIcon from '@components/icons/star-icon';
import { Product1 } from '@framework/types';
import { useRatingMutation } from '@framework/rating/use-rating';

interface ReviewFormProps {
  className?: string;
  product?: Product1;
}
interface ReviewFormValues {
  message: string;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ className = '', product }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>();
  const { mutate: rating, isLoading } = useRatingMutation();
  const [hoverRating, setHoverRating] = useState<number | undefined>(undefined);
  const [rating_custom_icon, set_rating_custom_icon] = useState(0);
  function onSubmit(values: ReviewFormValues) {
    rating({
      message: values.message,
      dishId: product?.id as string,
      score: rating_custom_icon,
    });
    setValue('message', '');
    set_rating_custom_icon(0);
  }

  const onStarClickCustomIcon = (
    nextValue: number,
    prevValue: number,
    name: string
  ) => {
    console.log(
      'name: %s, nextValue: %s, prevValue: %s',
      name,
      nextValue,
      prevValue
    );
    set_rating_custom_icon(nextValue);
  };
  return (
    <div className={cn(className)}>
      <Heading className="mb-2">{t('text-write-review')}</Heading>
      {/* <Text>
                Your email address will not be published. Required fields are marked*
            </Text> */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center mt-5 lg:mt-7 xl:mt-9"
        noValidate
      >
        <div className="flex flex-col space-y-5 md:space-y-6 lg:space-y-7">
          <div className="pb-1.5 flex items-center">
            <label className="flex-shrink-0 block text-skin-base text-sm md:text-15px leading-none cursor-pointer pe-3">
              {t('forms:label-your-rating')}
            </label>
            <StarRatingComponent
              name="rating"
              starCount={5}
              value={hoverRating ? hoverRating : rating_custom_icon}
              onStarClick={onStarClickCustomIcon}
              starColor="#F3B81F"
              emptyStarColor="#DFE6ED"
              renderStarIcon={() => (
                <StarIcon className="w-3.5 lg:w-4 h-3.5 lg:h-4" />
              )}
              onStarHover={(val) => setHoverRating(val)}
              onStarHoverOut={(val) => setHoverRating(undefined)}
            />
          </div>
          <TextArea
            variant="solid"
            label="forms:label-message-star"
            {...register('message', { required: 'Message is required' })}
            error={errors.message?.message}
          />
          <div className="pt-1">
            <Button
              type="submit"
              className="h-12 md:mt-1 text-sm lg:text-base w-full sm:w-auto"
              loading={isLoading}
              disabled={isLoading}
            >
              {t('common:button-submit')}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
