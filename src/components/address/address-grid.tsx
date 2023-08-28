import { useState, useEffect } from 'react';
import { TiPencil } from 'react-icons/ti';
import { AiOutlinePlus } from 'react-icons/ai';
import { RadioGroup } from '@headlessui/react';
import { useModalAction } from '@components/common/modal/modal.context';
import { formatAddress } from '@utils/format-address';
import Button from '@components/ui/button';
import { useTranslation } from 'next-i18next';
import { useUpdateAddressMutation } from '@framework/address/update_address';
import { useCart } from '@contexts/cart/cart.context';
import { useRouter } from 'next/router';
import { FaTrash } from 'react-icons/fa';
import { useDeleteUAddressMutation } from '@framework/address/delete_uaddress';
import Swal, { SweetAlertOptions } from 'sweetalert2';

interface ContactFormValues {
    isDefault: boolean;
}

const AddressGrid: React.FC<{ address?: any }> = ({ address }) => {
    const { locale } = useRouter();
    const { t } = useTranslation('common');
    const { openModal } = useModalAction();
    const { mutate: updateAddress, isLoading: updateLoading } =
        useUpdateAddressMutation();
    const { mutate: deleteAddress, isLoading: deleteLoading } =
        useDeleteUAddressMutation();

    const { setSelectedAddress } = useCart();
    function handlePopupView(item: any) {
        openModal('ADDRESS_VIEW_AND_EDIT', item);
    }
    function handleDeleteAddress(item: any) {
        const config = {
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            allowOutsideClick: (elem: any) => {
                console.log(elem);

                /* !elem.classList.contains('swal2-popup') */
                return true;
            },
        };
        Swal.fire<SweetAlertOptions>({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
            allowOutsideClick: (elem: any) => {
                console.log(elem);

                /* !elem.classList.contains('swal2-popup') */
                return true;
            },
        } as SweetAlertOptions).then((result) => {
            if (result.isConfirmed) {
                deleteAddress({ addressId: item.addressId, userId: item.userId });
            }
        });
    }

    address = address || [];

    const [selected, setSelected] = useState<any>();
    const [base, setBase] = useState<any>();

    useEffect(() => {
        let defaultValue = address.filter((item: any) => item.isDefault === 1)[0];
        setSelected(defaultValue);
        setBase(defaultValue);
    }, [address]);

    useEffect(() => {
        setSelectedAddress(selected);
    }, [selected, setSelectedAddress]);

    function onSubmit(e: any) {
        let selectedId = selected.address.id;
        let baseId = base.address.id;

        if (baseId !== selectedId) {
            updateAddress({
                id: selectedId,
                oldAddressId: baseId,
            });
        }
    }

    return (
        <div className="text-15px h-full flex flex-col justify-between -mt-4 md:mt-0">
            <RadioGroup
                value={selected}
                onChange={setSelected}
                className="md:grid md:grid-cols-2 md:gap-5 auto-rows-auto space-y-4 md:space-y-0"
            >
                <RadioGroup.Label className="sr-only">{t('address')}</RadioGroup.Label>
                {address?.length > 0 ? (
                    address?.map((item: any, index: any) => (
                        <RadioGroup.Option
                            key={index}
                            value={item}
                            className={({ checked }) =>
                                `${checked ? 'border-skin-primary' : 'border-skin-base'}
                                    border-2 relative shadow-md focus:outline-none rounded-md p-5 block cursor-pointer min-h-[112px] h-full group address__box`
                            }
                        >
                            <RadioGroup.Label
                                as="h3"
                                className="text-skin-base font-semibold mb-2 -mt-1"
                            >
                                {item?.title}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                                as="div"
                                className="text-skin-muted leading-6"
                            >
                                {locale === 'vi'
                                    ? item?.address.address +
                                    ', ' +
                                    item?.address.ward.fullname +
                                    ' - ' +
                                    item?.address.district.fullname +
                                    ' - ' +
                                    item.address.province.fullname
                                    : item?.address.addressEn +
                                    ' Street, ' +
                                    item?.address.ward.fullnameEn +
                                    ' - ' +
                                    item?.address.district.fullnameEn +
                                    ' - ' +
                                    item.address.province.fullnameEn}
                            </RadioGroup.Description>
                            <div className="flex absolute end-3 top-3 z-10 lg:opacity-0 transition-all address__actions">
                                <button
                                    onClick={() => handleDeleteAddress(item)}
                                    className="mr-2 flex justify-center items-center bg-red-600 h-6 w-6 rounded-full text-skin-inverted text-opacity-80 text-base"
                                >
                                    <span className="sr-only">{t(item?.title)}</span>
                                    <FaTrash />
                                </button>
                                <button
                                    onClick={() => handlePopupView(item)}
                                    className="flex justify-center items-center bg-skin-primary h-6 w-6 rounded-full text-skin-inverted text-opacity-80 text-base"
                                >
                                    <span className="sr-only">{t(item?.title)}</span>
                                    <TiPencil />
                                </button>
                            </div>
                        </RadioGroup.Option>
                    ))
                ) : (
                    <div className="border-2 border-skin-base rounded font-semibold p-5 px-10 text-skin-red flex justify-start items-center min-h-[112px] h-full">
                        {t('text-no-address-found')}
                    </div>
                )}
                <button
                    className="w-full border-2 transition-all border-skin-base rounded font-semibold p-5 px-10 cursor-pointer text-skin-primary flex justify-start hover:border-skin-primary items-center min-h-[112px] h-full"
                    onClick={handlePopupView}
                >
                    <AiOutlinePlus size={18} className="me-2" />
                    {t('text-add-address')}
                </button>
            </RadioGroup>

            <div className="flex sm:justify-end mt-5 md:mt-10 lg:mt-20 save-change-button">
                <Button
                    className="w-full sm:w-auto"
                    loading={updateLoading}
                    disabled={updateLoading}
                    onClick={onSubmit}
                >
                    {t('button-save-changes')}
                </Button>
            </div>
        </div>
    );
};

export default AddressGrid;
