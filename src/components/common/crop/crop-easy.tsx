import React, { useState, FC, Fragment } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';
import Button from '@components/ui/button';
import Input from '@components/ui/form/input';
import CloseButton from '@components/ui/close-button';
import { useTranslation } from 'next-i18next';
import { useModalAction } from '@components/common/modal/modal.context';
import { Dialog, Transition } from '@headlessui/react';
import cn from 'classnames';

const CropEasy = ({
  photoURL,
  setOpenCrop,
  setPhotoURL,
  setFile,
  open,
  handleClose,
}: any) => {
  /* const { setAlert, setLoading } = useAuth(); */
  const [crop, setCrop] = useState<any>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const { t } = useTranslation();

  const cropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation
      );
      setPhotoURL(url);
      setFile(file);
      setOpenCrop(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto overflow-x-hidden"
        onClose={handleClose}
      >
        <div
          className={cn('min-h-screen lg:px-4 text-center', {
            'flex justify-center items-end': false,
          })}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed bg-skin-base bg-opacity-70 inset-0 z-40 cursor-pointer" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className={cn({
              'h-screen align-middle inline-block': true,
              'h-screen align-bottom': false,
            })}
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-110"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-110"
          >
            <div className="w-full md:w-auto inline-block p-4 md:p-6 xl:p-8 overflow-hidden text-start align-middle transition-all transform shadow-xl relative z-50">
              <div className="relative rounded-md">
                <button
                  onClick={handleClose}
                  aria-label="Close panel"
                  className="opacity-0 absolute top-2 md:top-4 end-2 md:end-4"
                />
                <div className="py-6 px-5 sm:p-8 bg-skin-fill mx-auto rounded-lg w-full">
                  <CloseButton onClick={handleClose} />
                  <div
                    style={{
                      background: '#333',
                      position: 'relative',
                      height: 400,
                      width: 'auto',
                      minWidth: 500,
                    }}
                  >
                    <Cropper
                      image={photoURL}
                      crop={crop}
                      zoom={zoom}
                      rotation={rotation}
                      aspect={1}
                      cropShape="round"
                      showGrid={false}
                      onZoomChange={setZoom}
                      onRotationChange={setRotation}
                      onCropChange={setCrop}
                      onCropComplete={cropComplete}
                    />
                  </div>
                  <div style={{ flexDirection: 'column', margin: '16px 12px' }}>
                    <div style={{ width: '100%', marginBottom: 1 }}>
                      <div>
                        <label
                          htmlFor="zoom-range"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Phóng to: {zoomPercent(zoom)}
                        </label>
                        <input
                          id="zoom-range"
                          type="range"
                          value={zoom}
                          min="1"
                          max="4"
                          step="0.05"
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="rotate-range"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Xoay: {rotation + '°'}
                        </label>
                        <input
                          id="rotate-range"
                          type="range"
                          value={rotation}
                          min="0"
                          max="360"
                          step="0.1"
                          onChange={(e) => setRotation(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-around mt-5">
                      <Button type="button" onClick={handleClose}>
                        Giữ nguyên
                      </Button>
                      <Button type="button" onClick={cropImage} className="p-0">
                        Cắt
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CropEasy;

const zoomPercent = (value: number) => {
  return `${Math.round(value * 100)}%`;
};
