import { useState, useEffect } from 'react';
import Heading from '@components/ui/heading';
import { useCustomersQuery } from '@framework/customer/get-customer';
import { useTranslation } from 'next-i18next';
import { LoadingScreen } from '@components/common/loading-screen';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Input from '@components/ui/form/input';
import { useForm } from 'react-hook-form';
import { UpdateUserType } from '@framework/customer/use-update-customer';
import Text from '@components/ui/text';
import { RadioBox } from '@components/ui/radiobox';
import Button from '@components/ui/button';
import Cookies from 'js-cookie';
import { useFollowMutation } from '@framework/customer/follow-customer';
import { useUI } from '@contexts/ui.context';
import { useFollowingsQuery } from '@framework/customer/get-followings';
import { Customer } from '@framework/types';
import { useCart } from '@contexts/cart/cart.context';
import { useUnfollowMutation } from '@framework/customer/unfollow-customer';

const AccountDetails: React.FC = () => {
  const {
    query: { id },
  } = useRouter();
  const { temp } = useCart();
  const [currentUser, setCurrentUser] = useState<Customer>();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const { data: user, isLoading: isUserLoading } = useCustomersQuery(
    id as string
  );
  const {
    data: followings,
    isLoading: isFollowingLoad,
    refetch: followingsRefetch,
    isRefetching: isFollowingRefetching,
  } = useFollowingsQuery(currentUser?.id as string);
  const { mutate: follow, isLoading: isFollowLoading } = useFollowMutation();
  const { mutate: unfollow, isLoading: isUnFollowLoading } =
    useUnfollowMutation();

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    control,
  } = useForm<UpdateUserType>({});
  console.log(followings);

  useEffect(() => {
    try {
      const currentUser = JSON.parse(Cookies.get('user') as string);
      setCurrentUser(currentUser);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Invalid JSON:', error.message);
      } else {
        throw error;
      }
    }
  }, []);

  useEffect(() => {
    followingsRefetch();
  }, [temp, followingsRefetch]);

  useEffect(() => {
    if (followings) {
      let isFollowing = followings.some(
        (following: any) =>
          following.followingId === currentUser?.id &&
          following.followedId === user?.id
      );
      setIsFollowing(isFollowing);
    } else {
      setIsFollowing(false);
    }
  }, [followings, user?.id, currentUser?.id]);

  useEffect(() => {
    setValue('firstName', user?.firstName);
    setValue('lastName', user?.lastName);
    setValue('phoneNum', user?.phoneNum);
    setValue('email', user?.email);
    setValue('username', user?.username);
  }, [user, setValue]);

  function handleFollow() {
    follow({ followingId: currentUser?.id, followedId: user?.id });
  }

  function handleUnFollow() {
    let currentFollow = followings.filter(
      (following: any) =>
        following.followingId === currentUser?.id &&
        following.followedId === user?.id
    )[0];
    unfollow(currentFollow.id);
  }

  if (isUserLoading) return <LoadingScreen size={45} />;
  return (
    <div className="w-full flex flex-col">
      <Heading variant="titleLarge" className="mb-5 md:mb-6 lg:mb-7 lg:-mt-1">
        Theo dõi
      </Heading>
      {user && (
        <form
          /* onSubmit={handleSubmit(onSubmit)} */
          className="w-full mx-auto flex flex-col justify-center"
          noValidate
        >
          <div className="border-skin-base border-b pb-7 md:pb-8 lg:pb-10">
            <div className="flex flex-col justify-center space-y-4 sm:space-y-5">
              <div className=" -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
                <div className="flex flex-col items-center -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
                  {
                    <Image
                      src={user.avatar as string}
                      alt={'Product Image'}
                      width={200}
                      height={200}
                      quality={100}
                      objectFit="cover"
                      className="rounded-full bg-skin-thumbnail border-solid border-2 border-sky-500"
                      style={{ overflow: 'hidden' }}
                    />
                  }
                </div>
                <Button
                  type="button"
                  loading={isFollowing ? isUnFollowLoading : isFollowLoading}
                  disabled={isFollowing ? isUnFollowLoading : isFollowLoading}
                  onClick={isFollowing ? handleUnFollow : handleFollow}
                  variant="formButton"
                  className="w-full sm:w-auto w-50 m-auto"
                >
                  {isFollowing ? 'Đang Theo dõi' : 'Theo dõi'}
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
                <Input
                  label={t('forms:label-first-name')}
                  {...register('firstName', {
                    required: 'forms:first-name-required',
                  })}
                  variant="solid"
                  className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                  inputClassName="disabled:bg-gray-500/[.06]"
                  error={errors.firstName?.message}
                  disabled
                />
                <Input
                  label={t('forms:label-last-name')}
                  {...register('lastName', {
                    required: 'forms:last-name-required',
                  })}
                  variant="solid"
                  className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                  error={errors.lastName?.message}
                  inputClassName="disabled:bg-gray-500/[.06]"
                  disabled
                />
              </div>
              <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
                <Input
                  type="tel"
                  label={t('forms:label-phone')}
                  {...register('phoneNum', {
                    pattern: {
                      value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                      message: 'forms:phone-error',
                    },
                  })}
                  variant="solid"
                  className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                  error={errors.phoneNum?.message}
                  inputClassName="disabled:bg-gray-500/[.06]"
                  disabled
                />
              </div>
              <div className="-mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0 pl-3">
                <Text variant="small">{t('common:label-gender')}</Text>
                <div>
                  <RadioBox
                    label={t('forms:label-male')}
                    value="male"
                    {...register('gender')}
                    defaultChecked
                    disabled
                  />
                  <RadioBox
                    label={t('forms:label-female')}
                    value="female"
                    {...register('gender', {})}
                    disabled
                  />
                  <RadioBox
                    label={t('forms:label-gender-other')}
                    value="others"
                    {...register('gender', {})}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
          <Heading
            variant="titleLarge"
            className="mb-5 xl:mb-8 pt-6 md:pt-7 lg:pt-8"
          >
            {t('common:text-account-details-account')}
          </Heading>
          <div></div>
          {/* <div className="border-skin-base border-b pb-7 md:pb-9 lg:pb-10">
                    <div className="flex flex-col space-y-4 sm:space-y-5">
                        <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
                            <Input
                                type="email"
                                label={t('forms:label-email-star')}
                                {...register('email', {
                                    required: 'forms:email-required',
                                    pattern: {
                                        value:
                                            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                        message: 'forms:email-error',
                                    },
                                })}
                                variant="solid"
                                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                                error={errors.email?.message}
                            />
                            <Input
                                type="text"
                                label={t('forms:label-username-star')}
                                {...register('username')}
                                variant="solid"
                                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                                error={errors.username?.message}
                                disabled={username ? true : false}
                            />
                        </div>
                    </div>
                </div> */}
        </form>
      )}
    </div>
  );
};

export default AccountDetails;
