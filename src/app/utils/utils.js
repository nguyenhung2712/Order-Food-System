import { differenceInSeconds } from 'date-fns';

export const convertHexToRGB = (hex) => {
    // check if it's a rgba
    if (hex.match('rgba')) {
        let triplet = hex.slice(5).split(',').slice(0, -1).join(',');
        return triplet;
    }

    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');

        return [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',');
    }
};

export function debounce(func, wait, immediate) {
    var timeout;
    return function () {
        var context = this,
            args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        }, wait);
        if (immediate && !timeout) func.apply(context, args);
    };
}

export function isMobile() {
    if (window) {
        return window.matchMedia(`(max-width: 767px)`).matches;
    }
    return false;
}

export function isMdScreen() {
    if (window) {
        return window.matchMedia(`(max-width: 1199px)`).matches;
    }
    return false;
}

function currentYPosition(elm) {
    if (!window && !elm) {
        return;
    }
    if (elm) return elm.scrollTop;
    // Firefox, Chrome, Opera, Safari
    if (window.pageYOffset) return window.pageYOffset;
    // Internet Explorer 6 - standards mode
    if (document.documentElement && document.documentElement.scrollTop)
        return document.documentElement.scrollTop;
    // Internet Explorer 6, 7 and 8
    if (document.body.scrollTop) return document.body.scrollTop;
    return 0;
}

function elmYPosition(elm) {
    var y = elm.offsetTop;
    var node = elm;
    while (node.offsetParent && node.offsetParent !== document.body) {
        node = node.offsetParent;
        y += node.offsetTop;
    }
    return y;
}

export function scrollTo(scrollableElement, elmID) {
    var elm = document.getElementById(elmID);

    if (!elmID || !elm) {
        return;
    }

    var startY = currentYPosition(scrollableElement);
    var stopY = elmYPosition(elm);

    var distance = stopY > startY ? stopY - startY : startY - stopY;
    if (distance < 100) {
        scrollTo(0, stopY);
        return;
    }
    var speed = Math.round(distance / 50);
    if (speed >= 20) speed = 20;
    var step = Math.round(distance / 25);
    var leapY = stopY > startY ? startY + step : startY - step;
    var timer = 0;
    if (stopY > startY) {
        for (var i = startY; i < stopY; i += step) {
            setTimeout(
                (function (leapY) {
                    return () => {
                        scrollableElement.scrollTo(0, leapY);
                    };
                })(leapY),
                timer * speed
            );
            leapY += step;
            if (leapY > stopY) leapY = stopY;
            timer++;
        }
        return;
    }
    for (let i = startY; i > stopY; i -= step) {
        setTimeout(
            (function (leapY) {
                return () => {
                    scrollableElement.scrollTo(0, leapY);
                };
            })(leapY),
            timer * speed
        );
        leapY -= step;
        if (leapY < stopY) leapY = stopY;
        timer++;
    }
    return false;
}

export function getTimeDifference(date) {
    let difference = differenceInSeconds(new Date(), date);
    if (difference < 60) return "vài giây trước";
    else if (difference < 3600) return `${Math.floor(difference / 60)} phút trước`;
    else if (difference < 86400) return `${Math.floor(difference / 3660)} giờ trước`;
    else if (difference < 86400 * 30) return `${Math.floor(difference / 86400)} ngày trước`;
    else if (difference < 86400 * 30 * 12) return `${Math.floor(difference / 86400 / 30)} tháng trước`;
    else return `${(difference / 86400 / 30 / 12).toFixed(1)} năm trước`;
}

export function generateRandomId() {
    let tempId = Math.random().toString();
    let uid = tempId.substr(2, tempId.length - 1);
    return uid;
}

export function getQueryParam(prop) {
    var params = {};
    var search = decodeURIComponent(
        window.location.href.slice(window.location.href.indexOf('?') + 1)
    );
    var definitions = search.split('&');
    definitions.forEach(function (val, key) {
        var parts = val.split('=', 2);
        params[parts[0]] = parts[1];
    });
    return prop && prop in params ? params[prop] : params;
}

export function classList(classes) {
    return Object.entries(classes)
        .filter((entry) => entry[1])
        .map((entry) => entry[0])
        .join(' ');
}

export const flat = (array) => {
    var result = [];
    array.forEach(function (a) {
        result.push(a);
        if (Array.isArray(a.children)) {
            result = result.concat(flat(a.children));
        }
    });
    return result;
};

export const convertToVND = (num) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num);
}

export const deepObjectEqual = (object1, object2) => {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        const val1 = object1[key];
        const val2 = object2[key];
        const areObjects = isObject(val1) && isObject(val2);
        if (
            (areObjects && !deepObjectEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            return false;
        }
    }
    return true;
}
export const isObject = (object) => {
    return object != null && typeof object === 'object';
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

export function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

export function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export function not(a, b) {
    return a.filter((value) => b.indexOf(value) === -1);
}

export function intersection(a, b) {
    return a.filter((value) => b.indexOf(value) !== -1);
}

export function union(a, b) {
    return [...a, ...not(b, a)];
}

export function convertToDateTimeStr(data, type, isShowTime) {
    const date = new Date(data[type]);
    let minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    let hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    let day = date.getUTCDate() < 10 ? "0" + date.getUTCDate() : date.getUTCDate();
    let month = date.getUTCMonth() < 10 ? "0" + (date.getUTCMonth() + 1) : (date.getUTCMonth() + 1);
    let year = date.getUTCFullYear();
    if (isShowTime) {
        return day + "/" + month + "/" + year + " | " + hour + ':' + minute;
    } else {
        return day + "/" + month + "/" + year;
    }
}

export function numberFormatter(num, digits) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup.slice().reverse().find(function (item) {
        return num >= item.value;
    });
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export function getFirstAndLastDate(num, isYear = false) {
    let firstDate = new Date();
    let lastDate;
    if (!isYear) {
        firstDate.setMonth(firstDate.getMonth() - num);
        firstDate.setDate(1);
        lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + num, 0);
    } else {
        firstDate = new Date();
        firstDate.setFullYear(firstDate.getFullYear() - num);
        firstDate.setMonth(0);
        firstDate.setDate(1);

        lastDate = new Date(firstDate.getFullYear() + num, 0, 0);
    }
    lastDate.setHours(23);
    lastDate.setMinutes(59);
    lastDate.setSeconds(59);
    return {
        firstDate, lastDate
    }
}