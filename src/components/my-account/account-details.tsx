import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Image from '@components/ui/image';
import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import Heading from '@components/ui/heading';
import { useForm, Controller } from 'react-hook-form';
import {
  useUpdateUserMutation,
  UpdateUserType,
} from '@framework/customer/use-update-customer';
import {
  fetchCustomers,
  useCustomersQuery,
} from '@framework/customer/get-customer';
import { Customer } from '@framework/types';
import { useTranslation } from 'next-i18next';
import Switch from '@components/ui/switch';
import Text from '@components/ui/text';

import CameraIcon from '@components/icons/camera-icon';
import { RadioBox } from '@components/ui/radiobox';
import CropEasy from '@components/common/crop/crop-easy';
import { useModalAction } from '@components/common/modal/modal.context';

const defaultValues = {};

const AccountDetails: React.FC = () => {
  let userCookie: string = Cookies.get('user')!;
  const { closeModal, openModal } = useModalAction();
  const [username, setUsername] = useState<any | undefined>();
  const [file, setFile] = useState<any>(null);
  const [photoURL, setPhotoURL] = useState<string>('');
  const [openCrop, setOpenCrop] = useState<boolean>(false);
  const { mutate: updateUser, isLoading } = useUpdateUserMutation();
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
  } = useForm<UpdateUserType>({
    defaultValues,
  });

  /* const { ref, ...fields } = register('avatar'); */
  useEffect(() => {
    try {
      const obj = JSON.parse(userCookie);
      setUsername(obj.username);
      setPhotoURL(obj.avatar);
      setValue('id', obj.id);
      setValue('firstName', obj.firstName);
      setValue('lastName', obj.lastName);
      setValue('phoneNum', obj.phoneNum);
      setValue('email', obj.email);
      setValue('username', obj.username);
      setValue('isShared', obj.isShared);
      setValue('is2FA', obj.is2FA);
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Invalid JSON:', error.message);
      } else {
        throw error;
      }
    }
  }, [setValue, userCookie]);

  function onSubmit(input: UpdateUserType) {
    updateUser({ ...input, avatar: file });
  }

  return (
    <div className="w-full flex flex-col">
      <Heading variant="titleLarge" className="mb-5 md:mb-6 lg:mb-7 lg:-mt-1">
        {t('common:text-account-details-personal')}
      </Heading>
      {openCrop && (
        <CropEasy
          {...{ photoURL, setOpenCrop, setPhotoURL, setFile }}
          open={openCrop}
          handleClose={() => setOpenCrop(false)}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full mx-auto flex flex-col justify-center"
        noValidate
      >
        <div className="border-skin-base border-b pb-7 md:pb-8 lg:pb-10">
          <div className="flex flex-col space-y-4 sm:space-y-5">
            <div className="flex justify-center sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <div className="flex flex-col items-center -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
                <div className="relative">
                  {photoURL && (
                    <Image
                      src={photoURL}
                      alt={'Product Image'}
                      width={200}
                      height={200}
                      quality={100}
                      objectFit="cover"
                      className="rounded-full bg-skin-thumbnail border-solid border-2 border-sky-500"
                      style={{ overflow: 'hidden' }}
                    />
                  )}
                  <label
                    htmlFor="avatar"
                    className="py-1 px-2 block cursor-pointer bg-[#02B290] rounded-full absolute bottom-2 right-2"
                  >
                    <CameraIcon />
                  </label>
                  {file && (
                    <Button
                      type="button"
                      onClick={() => setOpenCrop(true)}
                      className="rounded-full absolute bottom-20 -right-24"
                    >
                      Crop
                    </Button>
                  )}
                </div>
                <input
                  id="avatar"
                  type="file"
                  accept=".jpg,.png,.jpeg"
                  style={{ display: 'none' }}
                  {...register('avatar', {
                    onChange: (event) => {
                      if (event?.target?.files?.[0]) {
                        const file = event.target.files[0];
                        setFile(file);
                        setPhotoURL(URL.createObjectURL(file));
                        setOpenCrop(true);
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                      }
                    },
                  })}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                label={t('forms:label-first-name')}
                {...register('firstName', {
                  required: 'forms:first-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.firstName?.message}
              />
              <Input
                label={t('forms:label-last-name')}
                {...register('lastName', {
                  required: 'forms:last-name-required',
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.lastName?.message}
              />
            </div>
            <div className="flex flex-col sm:flex-row -mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0">
              <Input
                type="tel"
                label={t('forms:label-phone')}
                {...register('phoneNum', {
                  /* required: 'forms:phone-required', */
                  pattern: {
                    value: /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                    message: 'forms:phone-error',
                  },
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.phoneNum?.message}
              />
            </div>
            <div className="-mx-1.5 md:-mx-2.5 space-y-4 sm:space-y-0 pl-3">
              <Text variant="small">{t('common:label-gender')}</Text>
              <div>
                <RadioBox
                  label={t('forms:label-male')}
                  value="male"
                  {...register('gender', {
                    /* required: 'forms:phone-required', */
                    /* pattern: {
                                                                                    value:
                                                                                    /(84|0[3|5|7|8|9])+([0-9]{8})\b/g,
                                                                                    message: 'forms:phone-error',
                                                                                }, */
                  })}
                  /* className="w-full sm:w-1/2 px-1.5 md:px-2.5" */
                  defaultChecked
                />
                <RadioBox
                  label={t('forms:label-female')}
                  value="female"
                  {...register('gender', {})}
                />
                <RadioBox
                  label={t('forms:label-gender-other')}
                  value="others"
                  {...register('gender', {})}
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
        <div className="border-skin-base border-b pb-7 md:pb-9 lg:pb-10">
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
                {...register('username', {
                  /* required: 'forms:username-required', */
                })}
                variant="solid"
                className="w-full sm:w-1/2 px-1.5 md:px-2.5"
                error={errors.username?.message}
                disabled={username ? true : false}
                inputClassName="disabled:bg-gray-500/[.06]"
              />
            </div>
          </div>
        </div>
        <div className="relative flex pt-6 md:pt-8 lg:pt-10">
          <div className="pe-2.5">
            <Heading className="font-medium mb-1">
              {t('common:text-share-profile-data')}
            </Heading>
            <Text variant="small">
              {t('common:text-share-profile-data-description')}
            </Text>
          </div>
          <div className="ms-auto">
            <Controller
              name="isShared"
              control={control}
              defaultValue={true}
              render={({ field: { value, onChange } }) => (
                <Switch onChange={onChange} checked={value} />
              )}
            />
          </div>
        </div>
        <div className="relative flex mt-5 md:mt-6 lg:mt-7 mb-1 sm:mb-4 lg:mb-6">
          <div className="pe-2.5">
            <Heading className="font-medium mb-1">
              {t('common:text-2fa')}
            </Heading>
            <Text variant="small">{t('common:text-2fa-description')}</Text>
          </div>
          <div className="ms-auto">
            <Controller
              name="is2FA"
              control={control}
              defaultValue={true}
              render={({ field: { value, onChange } }) => (
                <Switch onChange={onChange} checked={value} />
              )}
            />
          </div>
        </div>
        <div className="relative flex sm:ms-auto mt-5 pb-2 lg:pb-0">
          <Button
            type="submit"
            loading={isLoading}
            disabled={isLoading}
            variant="formButton"
            className="w-full sm:w-auto"
          >
            {t('common:button-save-changes')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AccountDetails;
