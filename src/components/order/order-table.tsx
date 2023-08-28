import { Table } from '@components/ui/table';
import Input from '@components/ui/form/input';
import { useState, useEffect } from 'react';
import Pagination from '@components/ui/pagination';
import ActionsButton from '@components/ui/action-button';
import { TotalPrice } from '@components/order/price';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { BsSearch } from 'react-icons/bs';
import { generateLocaleDate } from '@utils/generate-locale-date';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export const CreatedAt: React.FC<{ createdAt?: any }> = ({ createdAt }) => {
  const { locale } = useRouter();
  if (locale === 'vi') {
    dayjs.locale('vi', {
      relativeTime: {
        future: 'trong %s',
        past: '%s trước',
        s: 'vài giây',
        m: 'một phút',
        mm: '%d phút',
        h: 'một giờ',
        hh: '%d giờ',
        d: 'một ngày',
        dd: '%d ngày',
        M: 'một tháng',
        MM: '%d tháng',
        y: 'một năm',
        yy: '%d năm',
      },
    });
  } else {
    dayjs.locale('en');
  }
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  return (
    <span className="whitespace-nowrap">
      {dayjs.utc(createdAt).tz(dayjs.tz.guess()).fromNow()}
    </span>
  );
};

export const Status: React.FC<{ item?: any }> = ({ item }) => {
  const { locale } = useRouter();
  let stt;
  switch (item.status) {
    case 4:
      stt = {
        name: 'Order Received',
        color: '#64748B',
        nameVI: 'Đã nhận đơn',
      };
      break;
    case 3:
      stt = {
        name: 'Order Placed',
        color: '#3B82F6',
        nameVI: 'Đã duyệt',
      };
      break;
    case 2:
      stt = {
        name: 'On the way',
        color: '#FED030',
        nameVI: 'Đang giao',
      };
      break;
    case 1:
      stt = {
        name: 'Delivered',
        color: '#02B290',
        nameVI: 'Đã gửi hàng',
      };
      break;
    default:
      stt = {
        name: 'Order Canceled',
        nameVI: 'Đã hủy',
        color: '#EF4444',
      };
  }
  return (
    <span className={stt.name?.replace(/\s/g, '_').toLowerCase()}>
      <span className="bullet" style={{ backgroundColor: stt.color }} />
      {locale === 'vi' ? stt.nameVI : stt.name}
    </span>
  );
};

export const DeliveryTime: React.FC<{ item?: any }> = ({ item }) => {
  const { locale } = useRouter();
  return <span>{generateLocaleDate(item, locale)}</span>;
};

const OrderTable: React.FC<{ orders?: any }> = ({ orders }) => {
  const { locale } = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [value, setValue] = useState('');
  const countPerPage = 5;
  let [filterData, setDataValue] = useState();
  const { t } = useTranslation('common');
  const columns = [
    {
      title: locale === 'en' ? 'Order Number' : 'Mã đơn',
      dataIndex: 'number',
      key: 'number',
      className: 'id-cell',
    },
    {
      title: locale === 'en' ? 'Order Date' : 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: function createdAt(items: any) {
        return <CreatedAt createdAt={items} />;
      },
    },
    {
      title: locale === 'en' ? 'Status' : 'Tình trạng',
      key: 'status',
      render: function status(item: any) {
        return <Status item={item} />;
      },
    },
    {
      title: locale === 'en' ? 'Delivery Time' : 'Thời gian dự kiến',
      dataIndex: 'predictDate',
      key: 'predictDate',
      render: function predictDate(item: any) {
        return <DeliveryTime item={item} />;
      },
    },
    /* {
              title: 'Total Price',
              key: 'total',
              render: function totalPrice(items: any) {
                  return <TotalPrice items={items} />;
              },
          }, */
    {
      dataIndex: '',
      key: 'operations',
      render: function actionsButton(item: any) {
        return <ActionsButton item={item} />;
      },
      className: 'operations-cell',
    },
  ];
  useEffect(() => {
    orders && setDataValue(orders.slice(0, countPerPage));
  }, [orders]);
  const updatePage = (p: any) => {
    setCurrentPage(p);
    const to = countPerPage * p;
    const from = to - countPerPage;
    setDataValue(orders.slice(from, to));
  };

  const onChangeSearch = (e: any) => {
    setCurrentPage(1);
    let filter: any = orders
      .filter((item: any) =>
        item.number.toLowerCase().includes(e.target.value.toLowerCase())
      )
      .slice(0, countPerPage);
    setValue(e.target.value);
    if (!e.target.value) {
      updatePage(1);
    }
    setDataValue(filter);
  };
  const onSubmitHandle = (e: any) => {
    e.preventDefault();
  };

  return (
    <>
      <div className="md:flex md:justify-between items-center mb-5 sm:mb-10">
        <h2 className="font-semibold text-sm md:text-xl text-skin-base mb-4 md:mb-0">
          {t('text-order-list')}
        </h2>
        <form onSubmit={onSubmitHandle} className="relative">
          <span className="absolute end-3 top-[80%] transform -translate-y-1/2 order-icon-color">
            <BsSearch size={19} />
          </span>
          <Input
            name="search"
            type="search"
            value={value}
            onChange={onChangeSearch}
            placeholder={t('text-search-order')}
            inputClassName=" h-[46px] w-full placeholder-[rgba(0, 0, 0, .3)] bg-white border border-[#E3E8EC] rounded-md order-search focus:border-2 focus:outline-none focus:border-skin-primary"
          />
        </form>
      </div>
      <div className="order-list-table-wraper">
        <Table
          className="order-list-table"
          columns={columns}
          data={filterData}
          rowKey="id"
        />
      </div>
      {!value.trim() && (
        <div className="text-end mt-5">
          <Pagination
            current={currentPage}
            onChange={updatePage}
            pageSize={countPerPage}
            total={orders?.length}
            prevIcon={<GrPrevious size={12} style={{ color: '#090B17' }} />}
            nextIcon={<GrNext size={12} style={{ color: '#090B17' }} />}
            className="order-table-pagination"
          />
        </div>
      )}
    </>
  );
};

export default OrderTable;
