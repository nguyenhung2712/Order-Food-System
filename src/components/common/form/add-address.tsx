import Input from '@components/ui/form/input';
import Button from '@components/ui/button';
import TextArea from '@components/ui/form/text-area';
import { useForm } from 'react-hook-form';
import { useModalState } from '@components/common/modal/modal.context';
import { useModalAction } from '@components/common/modal/modal.context';
import CloseButton from '@components/ui/close-button';
import Heading from '@components/ui/heading';
import Map from '@components/ui/map';
import { useTranslation } from 'next-i18next';
import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition, Combobox } from '@headlessui/react';
import { HiOutlineSelector, HiCheck } from 'react-icons/hi';
import { useRouter } from 'next/router';
import { http1 } from '@framework/utils/http';
import { API_ENDPOINTS } from '@framework/utils/api-endpoints';
import { useAddAddressMutation } from '@framework/address/add_address';
import { useCart } from '@contexts/cart/cart.context';
import { useUpdateAddressMutation } from '@framework/address/update_address';

interface ContactFormValues {
  title: string;
  address?: string;
}

const AddAddressForm: React.FC = () => {
  const { t } = useTranslation();
  const { data: address } = useModalState();
  const { closeModal } = useModalAction();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    defaultValues: {
      title: address || address?.title ? address?.title : '',
      address:
        address || address?.address?.address ? address?.address?.address : '',
    },
  });
  console.log();

  const { mutate: addAddress, isLoading: addLoading } = useAddAddressMutation();
  const { mutate: updateAddress, isLoading: updateLoading } =
    useUpdateAddressMutation();

  function onSubmit(values: ContactFormValues, e: any) {
    if (!address.address) {
      addAddress({
        ...values,
        provinceId: selectedProvince.id,
        districtId: selectedDistrict.id,
        wardId: selectedWard.id,
      });
    } else {
      updateAddress({
        ...values,
        id: address.address.id,
        provinceId: selectedProvince.id,
        districtId: selectedDistrict.id,
        wardId: selectedWard.id,
      });
    }
  }

  const [provinces, setProvinces] = useState<any[]>();
  const [districts, setDistricts] = useState<any[]>();
  const [wards, setWards] = useState<any[]>();
  const [selectedProvince, setSelectedProvince] = useState<any>(
    address.address && address.address.province
  );
  const [selectedDistrict, setSelectedDistrict] = useState<any>(
    address.address && address.address.district
  );
  const [selectedWard, setSelectedWard] = useState<any>(
    address.address && address.address.ward
  );
  const [provinceQuery, setProvinceQuery] = useState('');
  const [districtQuery, setDistrictQuery] = useState('');
  const [wardQuery, setWardQuery] = useState('');
  const [filteredProvince, setFilteredProvince] = useState<any>([]);
  const [filteredDistrict, setFilteredDistrict] = useState<any>([]);
  const [filteredWard, setFilteredWard] = useState<any>([]);

  useEffect(() => {
    (async () => {
      await getProvinces();
    })();
  }, [address, getProvinces]);
  useEffect(() => {
    (async () => {
      if (provinces) {
        if (provinceQuery === '') {
          setFilteredProvince(provinces);
        } else {
          let filtered = provinces?.filter((province) => {
            return province.provinceName
              .toLowerCase()
              .includes(provinceQuery.toLowerCase());
          });
          setFilteredProvince(filtered);
        }
        if (selectedProvince) {
          await getDistricts();
        }
      }
    })();
  }, [provinces, selectedProvince, provinceQuery]);
  useEffect(() => {
    (async () => {
      if (districts) {
        if (districtQuery === '') {
          setFilteredDistrict(districts);
        } else {
          let filtered = districts?.filter((district) => {
            return district.districtName
              .toLowerCase()
              .includes(districtQuery.toLowerCase());
          });
          setFilteredDistrict(filtered);
        }
        if (selectedDistrict) {
          await getWards();
        }
      }
    })();
  }, [districts, selectedDistrict, districtQuery]);

  useEffect(() => {
    (async () => {
      if (wards) {
        if (wardQuery === '') {
          setFilteredWard(wards);
        } else {
          let filtered = wards?.filter((ward) => {
            return ward.wardName
              .toLowerCase()
              .includes(wardQuery.toLowerCase());
          });
          setFilteredWard(filtered);
        }
      }
    })();
  }, [wards, wardQuery]);

  async function getProvinces() {
    const { data } = await http1.get(API_ENDPOINTS.PROVINCES);
    setProvinces(data.payload);
    if (!selectedProvince) {
      setSelectedProvince(data.payload[0]);
    }
  }

  async function getDistricts() {
    const { data } = await http1.get(
      `${API_ENDPOINTS.DISTRICTS}/${selectedProvince.id}`
    );
    setDistricts(data.payload);
    if (
      !selectedDistrict ||
      (address.address && selectedProvince !== address.address.province) ||
      !address.address
    ) {
      setSelectedDistrict(data.payload[0]);
    }
  }

  async function getWards() {
    const { data } = await http1.get(
      `${API_ENDPOINTS.WARDS}/${selectedDistrict.id}`
    );
    setWards(data.payload);
    if (
      !selectedWard ||
      (address.address && selectedDistrict !== address.address.district) ||
      !address.address
    ) {
      setSelectedWard(data.payload[0]);
    }
  }

  function handleProvinceClick(values: any) {
    setSelectedProvince(values);
  }
  function handleDistrictClick(values: any) {
    setSelectedDistrict(values);
  }
  function handleWardClick(values: any) {
    setSelectedWard(values);
  }

  return (
    <div className="w-full md:w-[600px] lg:w-[900px] xl:w-[1000px] mx-auto p-5 sm:p-8 bg-skin-fill rounded-md">
      <CloseButton onClick={closeModal} />
      <Heading variant="title" className="mb-8 -mt-1.5">
        {t('common:text-add-delivery-address')}
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="mb-6">
          <Input
            variant="solid"
            label="common:text-address-title"
            {...register('title', { required: 'Title Required' })}
            error={errors.title?.message}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 mb-6 gap-3 ">
          {selectedProvince && (
            <div>
              <label
                className={`block font-normal text-sm leading-none mb-3 cursor-pointer text-skin-base text-opacity-70`}
              >
                {t('forms:label-province')}
              </label>
              <Combobox value={selectedProvince} onChange={handleProvinceClick}>
                {({ open }) => (
                  <div className="relative lg:ms-0 min-w-[180px]">
                    <Combobox.Input
                      className="w-full py-2 px-4 w-full appearance-none transition duration-150 ease-in-out border text-input text-13px lg:text-sm font-body rounded placeholder-[#B3B3B3] min-h-12 transition duration-200 ease-in-out text-skin-base bg-skin-fill border-skin-two focus:border-2 focus:outline-none focus:border-skin-primary h-11 md:h-12"
                      onChange={(event: any) =>
                        setProvinceQuery(event.target.value)
                      }
                      displayValue={(option: any) =>
                        option ? option.provinceName : 'Choose Province'
                      }
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiOutlineSelector
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                    <Transition
                      show={open}
                      /* as={Fragment} */
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options
                        static
                        className="z-10 absolute w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
                      >
                        {filteredProvince.length === 0 &&
                        provinceQuery !== '' ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found.
                          </div>
                        ) : (
                          filteredProvince?.map(
                            (option: any, personIdx: number) => (
                              <Combobox.Option
                                key={personIdx}
                                className={({ active }: any) =>
                                  `${
                                    active
                                      ? 'text-amber-900 bg-gray-100'
                                      : 'text-gray-900'
                                  }
                                                    cursor-default select-none relative py-2 ps-10 pe-4`
                                }
                                value={option}
                              >
                                {({ selected, active }: any) => (
                                  <>
                                    <span
                                      className={`${
                                        selectedProvince.id === option.id
                                          ? 'font-medium'
                                          : 'font-normal'
                                      } block truncate`}
                                    >
                                      {option.provinceName}
                                    </span>
                                    {selectedProvince.id === option.id ? (
                                      <span
                                        className={`${
                                          active ? 'text-amber-600' : ''
                                        }
                                                            check-icon absolute inset-y-0 start-0 flex items-center ps-3`}
                                      >
                                        <HiCheck
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            )
                          )
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                )}
              </Combobox>
            </div>
          )}

          {selectedDistrict && selectedProvince && (
            <div>
              <label
                className={`block font-normal text-sm leading-none mb-3 cursor-pointer text-skin-base text-opacity-70`}
              >
                {t('forms:label-district')}
              </label>
              <Combobox value={selectedDistrict} onChange={handleDistrictClick}>
                {({ open }) => (
                  <div className="relative lg:ms-0 min-w-[180px]">
                    <Combobox.Input
                      className="w-full py-2 px-4 w-full appearance-none transition duration-150 ease-in-out border text-input text-13px lg:text-sm font-body rounded placeholder-[#B3B3B3] min-h-12 transition duration-200 ease-in-out text-skin-base bg-skin-fill border-skin-two focus:border-2 focus:outline-none focus:border-skin-primary h-11 md:h-12"
                      onChange={(event: any) =>
                        setDistrictQuery(event.target.value)
                      }
                      displayValue={(option: any) =>
                        option ? option.districtName : 'Choose District'
                      }
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiOutlineSelector
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                    <Transition
                      show={open}
                      /* as={Fragment} */
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options
                        static
                        className="z-10 absolute w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
                      >
                        {filteredDistrict.length === 0 &&
                        districtQuery !== '' ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found.
                          </div>
                        ) : (
                          filteredDistrict?.map(
                            (option: any, personIdx: number) => (
                              <Combobox.Option
                                key={personIdx}
                                className={({ active }: any) =>
                                  `${
                                    active
                                      ? 'text-amber-900 bg-gray-100'
                                      : 'text-gray-900'
                                  }
                                                    cursor-default select-none relative py-2 ps-10 pe-4`
                                }
                                value={option}
                              >
                                {({ selected, active }: any) => (
                                  <>
                                    <span
                                      className={`${
                                        selectedDistrict.id === option.id
                                          ? 'font-medium'
                                          : 'font-normal'
                                      } block truncate`}
                                    >
                                      {option.districtName}
                                    </span>
                                    {selectedDistrict.id === option.id ? (
                                      <span
                                        className={`${
                                          active ? 'text-amber-600' : ''
                                        }
                                                            check-icon absolute inset-y-0 start-0 flex items-center ps-3`}
                                      >
                                        <HiCheck
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            )
                          )
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                )}
              </Combobox>
            </div>
          )}

          {selectedDistrict && selectedProvince && selectedWard && (
            <div>
              <label
                className={`block font-normal text-sm leading-none mb-3 cursor-pointer text-skin-base text-opacity-70`}
              >
                {t('forms:label-ward')}
              </label>
              <Combobox value={selectedWard} onChange={handleWardClick}>
                {({ open }) => (
                  <div className="relative lg:ms-0 min-w-[180px]">
                    <Combobox.Input
                      className="w-full py-2 px-4 w-full appearance-none transition duration-150 ease-in-out border text-input text-13px lg:text-sm font-body rounded placeholder-[#B3B3B3] min-h-12 transition duration-200 ease-in-out text-skin-base bg-skin-fill border-skin-two focus:border-2 focus:outline-none focus:border-skin-primary h-11 md:h-12"
                      onChange={(event: any) =>
                        setWardQuery(event.target.value)
                      }
                      displayValue={(option: any) =>
                        option ? option.wardName : 'Choose Ward'
                      }
                    />
                    <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <HiOutlineSelector
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </Combobox.Button>
                    <Transition
                      show={open}
                      /* as={Fragment} */
                      leave="transition ease-in duration-100"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <Combobox.Options
                        static
                        className="z-10 absolute w-full py-1 mt-1 overflow-auto bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm"
                      >
                        {filteredWard.length === 0 && wardQuery !== '' ? (
                          <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                            Nothing found.
                          </div>
                        ) : (
                          filteredWard?.map(
                            (option: any, personIdx: number) => (
                              <Combobox.Option
                                key={personIdx}
                                className={({ active }: any) =>
                                  `${
                                    active
                                      ? 'text-amber-900 bg-gray-100'
                                      : 'text-gray-900'
                                  }
                                                    cursor-default select-none relative py-2 ps-10 pe-4`
                                }
                                value={option}
                              >
                                {({ selected, active }: any) => (
                                  <>
                                    <span
                                      className={`${
                                        selectedWard.id === option.id
                                          ? 'font-medium'
                                          : 'font-normal'
                                      } block truncate`}
                                    >
                                      {option.wardName}
                                    </span>
                                    {selectedWard.id === option.id ? (
                                      <span
                                        className={`${
                                          active ? 'text-amber-600' : ''
                                        }
                                                            check-icon absolute inset-y-0 start-0 flex items-center ps-3`}
                                      >
                                        <HiCheck
                                          className="w-5 h-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            )
                          )
                        )}
                      </Combobox.Options>
                    </Transition>
                  </div>
                )}
              </Combobox>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 gap-7">
          <TextArea
            label="common:text-address"
            {...register('address', {
              required: 'forms:address-required',
            })}
            error={errors.address?.message}
            className="text-skin-base"
            variant="solid"
          />
        </div>
        <div className="flex w-full justify-end">
          <Button
            className="h-11 md:h-12 mt-1.5"
            type="submit"
            loading={address.address ? updateLoading : addLoading}
            disabled={address.address ? updateLoading : addLoading}
          >
            {t('common:text-save-address')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAddressForm;
