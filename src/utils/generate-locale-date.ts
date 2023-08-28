import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';

var enMonth = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
var enShortMonth = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function generateLocaleDate(
  date: string,
  locale?: string,
  isTime = false
) /* , variation: Variation */ {
  const curDate = new Date(date);
  const year = curDate.getFullYear();
  const month = curDate.getMonth();
  const day = curDate.getDate();
  const minute =
    curDate.getMinutes() < 10
      ? '0' + curDate.getMinutes()
      : curDate.getMinutes();
  const hour =
    curDate.getHours() < 10 ? '0' + curDate.getHours() : curDate.getHours();
  switch (locale) {
    case 'en':
      return (
        enMonth[month] +
        ' ' +
        day +
        ', ' +
        year +
        (isTime ? ' | ' + hour + ':' + minute : '')
      );
    case 'vi':
      return (
        day +
        '-' +
        (month + 1) +
        '-' +
        year +
        (isTime ? ' | ' + hour + ':' + minute : '')
      );
    default:
      return date + (isTime ? ' | ' + hour + ':' + minute : '');
  }
}

export function generateDiffLocaleDate(date: string, locale?: string) {
  const curDate = new Date(date);
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
  }
  dayjs.extend(relativeTime);
  dayjs.extend(utc);
  dayjs.extend(timezone);

  return dayjs.utc(curDate).tz(dayjs.tz.guess()).fromNow();
}

export function numberFormatter(num: number, digits: number) {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'G' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol
    : '0';
}
