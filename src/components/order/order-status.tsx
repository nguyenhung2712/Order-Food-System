import ProgressBox from './progress-box';

interface Props {
  status: number;
}

const OrderStatus = ({ status }: Props) => {
  const statusArr = [
    {
      id: 1,
      name: 'Order Received',
      nameVI: 'Đã nhận đơn',
      serial: 4,
      color: '#02B290',
    },
    {
      id: 2,
      name: 'Order placed',
      nameVI: 'Đã duyệt',
      serial: 3,
      color: '#02B290',
    },
    {
      id: 3,
      name: 'On the way',
      nameVI: 'Đang giao',
      serial: 2,
      color: '#FED030',
    },
    {
      id: 4,
      name: 'Delivered',
      nameVI: 'Đã gửi hàng',
      serial: 1,
      color: '#02B290',
    },
  ];

  return <ProgressBox data={statusArr} status={status} />;
};

export default OrderStatus;
