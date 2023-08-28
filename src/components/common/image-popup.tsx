import Image from '@components/ui/image';
import {
  useModalAction,
  useModalState,
} from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import cn from 'classnames';

interface ImagePopupProps {
  isPopup?: boolean;
  className?: string;
}

const ImagePopup: React.FC<ImagePopupProps> = ({
  isPopup = true,
  className,
}) => {
  const { closeModal, openModal } = useModalAction();
  const { data } = useModalState();
  return (
    <div
      className={cn(
        'max-w-full relative ' /* lg:w-[920px] xl:w-[1000px] 2xl:w-[1200px] */,
        className
      )}
    >
      <div className="w-full">
        {/* {isPopup === true && <CloseButton onClick={closeModal} />} */}

        <div className="w-full overflow-hidden m-auto">
          <Image
            src={data.image}
            alt="Popup Image"
            width={850}
            height={600}
            className="rounded-xl w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default ImagePopup;
