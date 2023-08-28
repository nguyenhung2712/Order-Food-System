import Button from '@components/ui/button';
import PasswordInput from '@components/ui/form/password-input';
import Logo from '@components/ui/logo';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import { useChangePasswordMutation } from '@framework/customer/use-change-password';

type FormValues = {
  newPassword: string;
  confirmPassword: string;
};

const defaultValues = {
  newPassword: '',
  confirmPassword: '',
};

const ChangePasswordForm = () => {
  const { t } = useTranslation();
  const { closeModal, openModal } = useModalAction();
  const { data } = useModalState();
  const { mutate: changePassword, isLoading } = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const onSubmit = (values: FormValues) => {
    changePassword({
      newPassword: values.newPassword,
      id: data.id,
      isResetPass: true,
    });
  };

  return (
    <div className="py-6 px-5 sm:p-8 bg-skin-fill mx-auto rounded-lg w-full sm:w-96 md:w-450px">
      <CloseButton onClick={closeModal} />
      <div className="text-center mb-9 pt-2.5">
        <div onClick={closeModal}>
          <Logo />
        </div>
        <p className="text-sm md:text-base text-body mt-3 sm:mt-4 mb-8 sm:mb-10">
          {t('common:forgot-password-helper')}
        </p>
      </div>
      <form
        onSubmit={handleSubmit((data) => onSubmit(data))}
        className="flex flex-col justify-center"
        noValidate
      >
        <PasswordInput
          label={t('forms:label-password')}
          error={errors.newPassword?.message}
          {...register('newPassword', {
            required: `${t('forms:password-required')}`,
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g,
              message: 'forms:password-error',
            },
          })}
        />
        <PasswordInput
          label={t('forms:label-confirm-password')}
          error={errors.confirmPassword?.message}
          className="mt-5"
          {...register('confirmPassword', {
            required: `${t('forms:password-required')}`,
            validate: (match) => {
              const password = getValues('newPassword');
              return match === password || 'Passwords should match!';
            },
            pattern: {
              value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/g,
              message: 'forms:password-error',
            },
          })}
        />
        {/*  <Button
                    type="submit"
                    variant="formButton"
                    className="h-11 md:h-12 w-full mt-0"
                >
                    {t('common:text-reset-password')}
                
                </Button> */}
        <Button
          type="submit"
          loading={isLoading}
          disabled={isLoading}
          variant="formButton"
          className="w-full sm:w-auto mt-5"
        >
          {t('common:text-change-password')}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
