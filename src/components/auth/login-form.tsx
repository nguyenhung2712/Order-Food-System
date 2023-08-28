import { useState } from 'react';
import Input from '@components/ui/form/input';
import PasswordInput from '@components/ui/form/password-input';
import Button from '@components/ui/button';
import { useForm } from 'react-hook-form';
import { useLoginMutation, LoginInputType } from '@framework/auth/use-login';
import Logo from '@components/ui/logo';
import { useTranslation } from 'next-i18next';
import Image from '@components/ui/image';
import { useModalAction } from '@components/common/modal/modal.context';
import Switch from '@components/ui/switch';
import CloseButton from '@components/ui/close-button';
import { FaFacebook, FaGoogle } from 'react-icons/fa';
import cn from 'classnames';
import { useUI } from '@contexts/ui.context';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase, { uiConfig } from '@utils/firebase';

interface LoginFormProps {
  isPopup?: boolean;
  className?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ isPopup = true, className }) => {
  const { t } = useTranslation();
  const { authorize } = useUI();
  const { closeModal, openModal } = useModalAction();
  const { mutate: login, isLoading } = useLoginMutation();
  const [remember, setRemember] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputType>();

  function onSubmit({ username, password, remember_me }: LoginInputType) {
    login({
      username,
      password,
      remember_me,
    });
  }
  function handelFBLogin() {
    /* const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
            .then((result) => {
                // Handle đăng nhập thành công ở đây
                window.location.assign('/'); // Điều hướng đến trang chủ sau khi đăng nhập thành công
            })
            .catch((error) => {
                // Handle lỗi đăng nhập ở đây
            }); */
  }
  function handelGGLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // Handle đăng nhập thành công ở đây
        window.location.assign('/'); // Điều hướng đến trang chủ sau khi đăng nhập thành công
      })
      .catch((error) => {
        // Handle lỗi đăng nhập ở đây
      });
  }
  function handleSignUp() {
    return openModal('SIGN_UP_VIEW');
  }
  function handleForgetPassword() {
    return openModal('FORGET_PASSWORD');
  }

  return (
    <div
      className={cn(
        'w-full lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] relative',
        className
      )}
    >
      {isPopup === true && <CloseButton onClick={closeModal} />}

      <div className="flex bg-skin-fill mx-auto rounded-lg overflow-hidden">
        <div className="md:w-[55%] xl:w-[60%] registration hidden md:block">
          <Image
            src="/assets/images/login.png"
            alt="signin Image"
            width={800}
            height={621}
            className="w-full"
          />
        </div>
        <div className="w-full md:w-[45%] xl:w-[40%] py-6 sm:py-10 px-4 sm:px-8 xl:px-12 rounded-md shadow-dropDown flex flex-col justify-center">
          <div className="text-center mb-6 ">
            <div onClick={closeModal}>
              <Logo />
            </div>
            <h4 className="text-skin-base font-semibold text-xl sm:text-2xl sm:pt-3 ">
              {t('common:text-welcome-back')}
            </h4>
            <div className="text-sm sm:text-15px text-body text-center mt-3 mb-1">
              {t('common:text-don’t-have-account')}
              <button
                type="button"
                className="text-skin-primary sm:text-15px text-sm ms-1 font-semibold  hover:no-underline focus:outline-none"
                onClick={handleSignUp}
              >
                {t('common:text-create-account')}
              </button>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center"
            noValidate
          >
            <div className="flex flex-col space-y-3.5">
              <Input
                label={t('forms:label-username')}
                type="text"
                variant="solid"
                {...register('username', {
                  required: `${t('forms:username-required')}`,
                })}
                error={errors.username?.message}
              />
              <PasswordInput
                label={t('forms:label-password')}
                error={errors.password?.message}
                {...register('password', {
                  required: `${t('forms:password-required')}`,
                })}
              />
              <div className="flex items-center justify-center">
                {/* <div className="flex items-center flex-shrink-0">
                                    <label className="switch relative inline-block w-10 cursor-pointer">
                                        <Switch checked={remember} onChange={setRemember} />
                                    </label>
                                    <label
                                        htmlFor="remember"
                                        className="flex-shrink-0 text-sm text-heading ps-5 mt-1 cursor-pointer"
                                    >
                                        {t('forms:label-remember-me')}
                                    </label>
                                </div> */}
                <div className="flex ms-auto mt-[3px]">
                  <button
                    type="button"
                    onClick={handleForgetPassword}
                    className="text-end text-sm text-heading ps-3  hover:no-underline hover:text-skin-base focus:outline-none focus:text-skin-base"
                  >
                    {t('common:text-forgot-password')}
                  </button>
                </div>
              </div>
              <div className="relative">
                <Button
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                  className="h-11 md:h-12 w-full mt-2 font-15px md:font-15px tracking-normal"
                  variant="formButton"
                >
                  {t('common:text-sign-in')}
                </Button>
              </div>
            </div>
          </form>
          <div className="flex flex-col items-center justify-center relative text-sm">
            <span className="mt-6 text-sm text-skin-base opacity-70">
              {t('common:text-or')}
            </span>
          </div>

          <div className="flex justify-center mt-5 space-x-2.5">
            {/* <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} /> */}
            <button
              className="group flex items-center justify-center cursor-pointer h-10 w-10 rounded-full border border-skin-one hover:border-skin-primary transition-all focus:border-skin-primary focus:text-skin-primary focus:outline-none"
              onClick={handelGGLogin}
            >
              <FaGoogle className="h-4 w-4 text-skin-base text-opacity-50 transition-all group-hover:text-skin-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;