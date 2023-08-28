import { OrderDetailsContent } from './order-details-content';
import { formatAddress } from '@utils/format-address';
import OrderStatus from './order-status';
import {
  DiscountPrice,
  DeliveryFee,
  TotalPrice,
  SubTotalPrice,
} from '@components/order/price';

import { useUI } from '@contexts/ui.context';
import { useRouter } from 'next/router';
import { useOrderDetailsQuery } from '@framework/order/get-order-details';
import { useUpdateOrderMutation } from '@framework/order/use-update-order';
import { useExportOrderMutation } from '@framework/order/export-order';

const OrderDrawer: React.FC = () => {
  const { data, closeDrawer } = useUI();
  const { mutate: cancelOrder, isLoading: isCancelLoading } =
    useUpdateOrderMutation();
  const { mutate: exportOrder, isLoading: isExportLoading } =
    useExportOrderMutation();
  const { locale } = useRouter();
  const handleCancelOrder = () => {
    cancelOrder({ orderId: data.id, status: 0 });
  };
  const handleExportOrder = () => {
    exportOrder({ orderId: data.id, locale: locale, number: data.number });
  };
  return (
    <>
      {data && (
        <>
          <div className="p-8">
            <div className="flex justify-between mb-8">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <span
                onClick={handleExportOrder}
                className="h-fit py-3 px-5 cursor-pointer inline-block text-[12px] md:text-[14px] text-white font-medium bg-skin-primary rounded border border-solid border-skin-primary  hover:bg-white hover:text-black hover:border-[#DEE5EA] bg-skin-primary transition-all capitalize"
              >
                Export
                {isExportLoading && (
                  <span className="visually-hidden">
                    <svg
                      className="animate-spin inline w-4 h-4 rounded-full ml-2"
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
              </span>
            </div>
            <div className="text-[14px] opacity-70 mb-3 text-skin-base">
              Delivery Address
            </div>
            <div className="rounded border border-solid min-h-[90px] bg-skin-two p-4 border-skin-two text-[12px] md:text-[14px]">
              <p className="text-skin-base opacity-70">
                {locale === 'vi'
                  ? data?.address.address +
                    ', ' +
                    data?.address.ward.fullname +
                    ' - ' +
                    data?.address.district.fullname +
                    ' - ' +
                    data.address.province.fullname
                  : data?.address.address +
                    ' Street, ' +
                    data?.address.ward.fullnameEn +
                    ' - ' +
                    data?.address.district.fullnameEn +
                    ' - ' +
                    data.address.province.fullnameEn}
              </p>
            </div>
            <OrderStatus status={data?.status} />
            <div className="grid grid-cols-12 bg-skin-two py-3 rounded-[3px] text-black text-[12px] md:text-[14px]">
              <div className="col-span-2 opacity-50"></div>
              <div className="col-span-5 opacity-50">Items Name</div>
              <div className="col-span-3 opacity-50 md:text-start text-center">
                Quantity
              </div>
              <div className="col-span-2 opacity-50">Price</div>
            </div>
            {data.OrderDetails && (
              <>
                {data.OrderDetails.map((item: any, index: number) => (
                  <OrderDetailsContent key={index} item={item} />
                ))}
                <div className="mt-3 text-end">
                  <div className="text-black inline-flex flex-col text-[12px] md:text-[14px]">
                    <div className="mb-2 pb-1 border-b border-skin-base ps-20">
                      <p className="flex justify-between mb-1">
                        <span className="me-8">Sub total: </span>
                        <span className="font-medium">
                          <SubTotalPrice items={data.OrderDetails} />
                        </span>
                      </p>
                      {typeof data?.discount === 'number' && (
                        <p className="flex justify-between mb-2">
                          <span className="me-8">Discount: </span>
                          <span className="font-medium">
                            {/* <DiscountPrice discount={data?.discount} /> */}
                          </span>
                        </p>
                      )}
                      {typeof data?.delivery_fee === 'number' && (
                        <p className="flex justify-between mb-2">
                          <span className="me-8">Delivery Fee:</span>
                          <span className="font-medium">
                            {/* <DeliveryFee delivery={data?.delivery_fee} /> */}
                          </span>
                        </p>
                      )}
                    </div>
                    <p className="flex justify-between ps-20 mb-2">
                      <span className="me-8">Total Cost:</span>
                      <span className="font-medium">
                        <TotalPrice items={data.OrderDetails} />
                      </span>
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="text-end mt-12">
              {/* <span className="py-3 px-5 cursor-pointer inline-block text-[12px] md:text-[14px] text-black font-medium bg-white rounded border border-solid border-[#DEE5EA] me-4 hover:bg-[#F35C5C] hover:text-white hover:border-[#F35C5C] transition-all capitalize">
                                Report order
                            </span> */}
              {data.status === 4 && (
                <span
                  onClick={handleCancelOrder}
                  className="py-3 px-5 cursor-pointer inline-block text-[12px] md:text-[14px] text-white font-medium bg-[#F35C5C] rounded border border-solid border-[#F35C5C]  hover:bg-white hover:text-black hover:border-[#DEE5EA] transition-all capitalize"
                >
                  Cancel order
                  {isCancelLoading && (
                    <span className="visually-hidden">
                      <svg
                        className="animate-spin inline w-4 h-4 rounded-full ml-2"
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
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OrderDrawer;
