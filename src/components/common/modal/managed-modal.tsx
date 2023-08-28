import Modal from '@components/common/modal/modal';
import dynamic from 'next/dynamic';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
const LoginForm = dynamic(() => import('@components/auth/login-form'));
const SignUpForm = dynamic(() => import('@components/auth/sign-up-form'));
const ForgetPasswordForm = dynamic(
  () => import('@components/auth/forget-password-form')
);
const ChangePassswordForm = dynamic(
  () => import('@components/auth/change-password-form')
);
const OTPForm = dynamic(() => import('@components/auth/otp-form'));
const ReportForm = dynamic(() => import('@components/common/form/report-form'));
const CropForm = dynamic(() => import('@components/common/crop/crop-easy'));
const ProductPopup = dynamic(() => import('@components/product/product-popup'));
const AddressPopup = dynamic(
  () => import('@components/common/form/add-address')
);
const PaymentPopup = dynamic(
  () => import('@components/common/form/add-payment')
);
const PhoneNumberPopup = dynamic(
  () => import('@components/common/form/add-contact')
);
const DeliveryAddresses = dynamic(
  () => import('@components/address/delivery-addresses')
);
const CategoryPopup = dynamic(
  () => import('@components/category/category-popup')
);
const ImagePopup = dynamic(() => import('@components/common/image-popup'));
const ManagedModal: React.FC = () => {
  const { isOpen, view } = useModalState();
  const { closeModal } = useModalAction();

  if (view === 'CATEGORY_VIEW') {
    return (
      <Modal open={isOpen} onClose={closeModal} variant="bottom">
        {view === 'CATEGORY_VIEW' && <CategoryPopup />}
      </Modal>
    );
  }
  return (
    <Modal open={isOpen} onClose={closeModal}>
      {view === 'IMAGE_VIEW' && <ImagePopup />}
      {view === 'OTP_VIEW' && <OTPForm />}
      {view === 'LOGIN_VIEW' && <LoginForm />}
      {view === 'SIGN_UP_VIEW' && <SignUpForm />}
      {view === 'FORGET_PASSWORD' && <ForgetPasswordForm />}
      {view === 'CHANGEPASS_VIEW' && <ChangePassswordForm />}
      {view === 'PRODUCT_VIEW' && <ProductPopup />}
      {view === 'ADDRESS_VIEW_AND_EDIT' && <AddressPopup />}
      {view === 'PAYMENT' && <PaymentPopup />}
      {view === 'PHONE_NUMBER' && <PhoneNumberPopup />}
      {view === 'DELIVERY_VIEW' && <DeliveryAddresses />}
      {view === 'REPORT_VIEW' && <ReportForm />}
      {view === 'CROP_VIEW' && <CropForm />}
    </Modal>
  );
};

export default ManagedModal;
