import { useRef } from 'react';
import Button from '@components/ui/button';
import Input from '@components/ui/form/input';
import Logo from '@components/ui/logo';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import { useVerifyOTPMutation } from '@framework/auth/use-verify-otp';
import { useSendOTPMutation } from '@framework/auth/use-send-otp';

type FormValues = {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  /* otp5: string;
    otp6: string; */
};

const defaultValues = {
  otp1: '',
  otp2: '',
  otp3: '',
  otp4: '',
};

const ForgetPasswordForm = () => {
  /* let emailCookie: string = Cookies.get('email')!; */
  const { closeModal, openModal } = useModalAction();
  const { data } = useModalState();
  const { mutate: verifyOTP, isLoading } = useVerifyOTPMutation();
  const { mutate: sendOTP, isLoading: isSendLoading } = useSendOTPMutation();

  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setFocus,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  function transformEmail(value: string): string {
    return value
      ? value.replace(
          /\B.+@/g,
          (c) =>
            c
              .split('')
              .slice(-6, -1)
              .map((v) => '*')
              .join('') + '@'
        )
      : value;
  }

  function handleResendCode(event: any) {
    event.preventDefault();
    sendOTP(data.username ? data.username : data.email);
  }

  const onSubmit = (values: FormValues) => {
    let otpStr: string = values.otp1 + values.otp2 + values.otp3 + values.otp4;
    let otpNumber: number = +otpStr;

    if (data.password) {
      verifyOTP({
        otp: otpNumber,
        username: data.username,
        password: data.password,
        status: data.status,
        userId: data.userId,
      });
    } else {
      verifyOTP({
        otp: otpNumber,
        status: data.status,
        userId: data.userId,
      });
    }
  };

  return (
    <>
      <div className="relative bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
        <div className="mx-auto flex w-full flex-col space-y-16">
          <div className="flex flex-col items-center justify-center text-center space-y-2">
            <div className="font-semibold text-3xl">
              <Logo />
            </div>
            <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>{t('common:otp-helper') + ' ' + transformEmail(data.email)}</p>
            </div>
          </div>
          <div>
            <form
              onSubmit={handleSubmit((data) => onSubmit(data))}
              className="flex flex-col justify-center"
              noValidate
            >
              <div className="flex flex-col space-y-16">
                <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                  <Input
                    type="text"
                    variant="solid"
                    className="w-16 h-16 "
                    {...register('otp1', {
                      /* required: `${t('forms:otp-required')}`, */
                      onChange: (event) => {
                        event.target.value = event.target.value.replace(
                          /\D+/g,
                          ''
                        );
                        if (event.target.value.length === 1) {
                          setFocus('otp2');
                        }
                      },
                    })}
                    onPaste={(event) => {
                      const pasteData =
                        event.clipboardData.getData('text/plain');
                      setValue('otp1', pasteData[0]);
                      setValue('otp2', pasteData[1]);
                      setValue('otp3', pasteData[2]);
                      setValue('otp4', pasteData[3]);
                      setFocus('otp4');
                    }}
                    error={errors.otp1?.message}
                    maxLength={1}
                    inputClassName="text-xl w-full flex flex-col items-center justify-center text-center py-5 px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1"
                    style={{ height: '100%', fontSize: '24px' }}
                    inputMode="numeric"
                  />
                  <Input
                    type="text"
                    variant="solid"
                    className="w-16 h-16 "
                    {...register('otp2', {
                      /* required: `${t('forms:otp-required')}`, */
                      onChange: (event) => {
                        event.target.value = event.target.value.replace(
                          /\D+/g,
                          ''
                        );
                        if (event.target.value.length === 1) {
                          setFocus('otp3');
                        }
                        if (event.target.value.length < 1) {
                          setFocus('otp1');
                        }
                      },
                    })}
                    onPaste={(event) => {
                      const pasteData =
                        event.clipboardData.getData('text/plain');
                      setValue('otp1', pasteData[0]);
                      setValue('otp2', pasteData[1]);
                      setValue('otp3', pasteData[2]);
                      setValue('otp4', pasteData[3]);
                      setFocus('otp4');
                    }}
                    error={errors.otp2?.message}
                    maxLength={1}
                    inputClassName="text-xl w-full flex flex-col items-center justify-center text-center py-5 px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1"
                    style={{ height: '100%', fontSize: '24px' }}
                    inputMode="numeric"
                  />
                  <Input
                    type="text"
                    variant="solid"
                    className="w-16 h-16 "
                    {...register('otp3', {
                      /* required: `${t('forms:otp-required')}`, */
                      onChange: (event) => {
                        event.target.value = event.target.value.replace(
                          /\D+/g,
                          ''
                        );
                        if (event.target.value.length === 1) {
                          setFocus('otp4');
                        }
                        if (event.target.value.length < 1) {
                          setFocus('otp2');
                        }
                      },
                    })}
                    onPaste={(event) => {
                      const pasteData =
                        event.clipboardData.getData('text/plain');
                      setValue('otp1', pasteData[0]);
                      setValue('otp2', pasteData[1]);
                      setValue('otp3', pasteData[2]);
                      setValue('otp4', pasteData[3]);
                      setFocus('otp4');
                    }}
                    error={errors.otp3?.message}
                    maxLength={1}
                    inputClassName="text-xl w-full flex flex-col items-center justify-center text-center py-5 px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1"
                    style={{ height: '100%', fontSize: '24px' }}
                    inputMode="numeric"
                  />
                  <Input
                    type="text"
                    variant="solid"
                    className="w-16 h-16 "
                    {...register('otp4', {
                      /* required: `${t('forms:otp-required')}`, */
                      onChange: (event) => {
                        event.target.value = event.target.value.replace(
                          /\D+/g,
                          ''
                        );
                        if (event.target.value.length < 1) {
                          setFocus('otp3');
                        }
                      },
                    })}
                    onPaste={(event) => {
                      const pasteData =
                        event.clipboardData.getData('text/plain');
                      setValue('otp1', pasteData[0]);
                      setValue('otp2', pasteData[1]);
                      setValue('otp3', pasteData[2]);
                      setValue('otp4', pasteData[3]);
                      setFocus('otp4');
                    }}
                    error={errors.otp4?.message}
                    maxLength={1}
                    inputClassName="text-xl w-full flex flex-col items-center justify-center text-center py-5 px-5 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1"
                    style={{ height: '100%', fontSize: '24px' }}
                    inputMode="numeric"
                  />
                </div>

                <div className="flex flex-col space-y-5">
                  <div>
                    <Button
                      type="submit"
                      variant="formButton"
                      loading={isLoading}
                      disabled={isLoading}
                      className="flex flex-row items-center justify-center text-center w-full border rounded-xl outline-none py-5 border-none text-white text-sm shadow-sm"
                    >
                      {t('common:text-verify')}
                    </Button>
                  </div>

                  <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                    <p>{t('common:text-or-send')}</p>
                    <a
                      className="flex flex-row items-center text-[#02B290]"
                      href="http://"
                      rel="noopener noreferrer"
                      onClick={handleResendCode}
                    >
                      {t('common:text-otp')}
                    </a>
                    {isSendLoading && (
                      <span className="visually-hidden">
                        <svg
                          className="animate-spin -inline-block w-8 h-8 rounded-full"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPasswordForm;
