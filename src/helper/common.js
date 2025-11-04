// @ts-nocheck
import queryString from 'query-string'

export const getQueryString = (query) => {
  const result = queryString.stringify(
    query,
  )

  if (!result) return ''
  return `?${result}`
}

export const debounced = (delay, fn) => {
  let timerId

  return (...args) => {
    if (timerId) {
      clearTimeout(timerId)
    }

    timerId = setTimeout(() => {
      fn(...args)
      timerId = null
    }, delay)
  }
}

export const capitalizeFirstLetter = (stringText) => {
  return stringText.charAt(0).toUpperCase() + stringText.slice(1)
}

export const getParameterByName = (name, url) => {
  if (!url) url = ''
  // eslint-disable-next-line
  name = name.replace(/[\[\]]/g, '\\$&')
  let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export const isEquivalent = (a, b) => {
  // Create arrays of property names
  let aProps = Object.getOwnPropertyNames(a)
  let bProps = Object.getOwnPropertyNames(b)
  // If number of properties is different,
  // objects are not equivalent
  if (aProps.length !== bProps.length) {
    return false
  }
  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i]
    // If values of same property are not equal,
    // objects are not equivalent
    if (a[propName] !== b[propName]) {
      return false
    }
  }
  // If we made it this far, objects
  // are considered equivalent
  return true
}

export const xoa_dau = (str) => {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  return str;
}

export const number_to_price = (v) => {

  if (v === 0) { return '0'; }

  if (!v || v === "") {
    return v
  }
  v = v.toString();

  v = v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");

  v = v.split(',').join('*').split('.').join(',').split('*').join('.');
  return v;
}

export const formatNumberThapPhan = (number) =>{
  const value = number?.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return value
}

export const price_to_number = (v) => {
  if (!v) { return 0; }
  v = v.split(',').join('');
  v = v.split('.').join(',');

  return Number(v);
}

export function validateEmail(email) {
  // eslint-disable-next-line
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function validatePass(pass) {
  const passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
  return passw.test(pass);
}

export function validateNumberPhone(number) {
  let c1 = number.substring(0, 4);
  if (c1 === "+855") {
    return true;
  }
  c1 = number.substring(0, 3);
  return c1 === "+60" || c1 === "+84";
}

export function toDataURL(src, callback, outputFormat) {
  var img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function () {
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    var dataURL;
    canvas.height = this.naturalHeight;
    canvas.width = this.naturalWidth;
    ctx.drawImage(this, 0, 0);
    dataURL = canvas.toDataURL(outputFormat);
    callback(dataURL);
  };
  img.src = src;
  if (img.complete || img.complete === undefined) {
    img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    img.src = src;
  }
}

export function convertFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });
}


const _cutNumber = (number) => {
  const num = number.toString()
  if(num.length > 3) {
    let count = 0
    let arr = []
    for(let i = num.length - 1; i >= 0; i--) {
      count++
      if(count === 3) {
        const str = num[i] + num[i+1] + num[i+2]
        arr.push(str)
        count = 0;
      }
      if(i === 0) {
        if(count === 2) {
          const str = num[i] + num[i+1]
          arr.push(str)
        } else if(count === 1) {
          const str = num[i]
          arr.push(str)
        } else {
          break;
        }
      }
    }
    console.log(arr)
    return arr.reverse().join(',')
  } else {
    return num;
  }
}

export function formatDot(number) {
  if (!number) {
    return ''
  }
  return _cutNumber(number)
}

export function formatVND(number) {
  if (!number) {
    return ''
  }
  if (typeof number === 'number') {
    return _cutNumber(number)
  }

  if(typeof number === 'string') {
    let arrValue = number.split('.')
    let formatedValue = _cutNumber(arrValue[0]);
    return `${formatedValue}.${arrValue[1]}`;
  }
}

export function capitalizeTheFirstLetterOfEachWord(words) {
  let separateWord = words.toLowerCase().split(' ');
  for (let i = 0; i < separateWord.length; i++) {
     separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
     separateWord[i].substring(1);
  }
  return separateWord.join(' ');
}

export function getInsuranceTypeName(insuranceType, insuranceName) {
  const INSURANCE_TYPES = {
    INSURANCE_MOTORBIKE_TNDSBB: 6,
    INSURANCE_CAR_TNDSBB: 7,
    INSURANCE_CAR_BHTV: 8,
  }
  switch (insuranceType) {
    case INSURANCE_TYPES.INSURANCE_MOTORBIKE_TNDSBB:
      return `Bảo hiểm trách nhiệm dân sự xe máy - ${insuranceName}`;
    case INSURANCE_TYPES.INSURANCE_CAR_TNDSBB:
      return `Bảo hiểm trách nhiệm dân sự ôtô - ${insuranceName}`;
    case INSURANCE_TYPES.INSURANCE_CAR_BHTV:
       return `Bảo hiểm thân vỏ ôtô - ${insuranceName}`;
    default:
      return `${insuranceName}`;
  }
}

export function trimStrings(obj) {
  if (typeof obj === 'string') {
    return obj.trim()
  } else if (Array.isArray(obj)) {
    return obj.map(trimStrings)
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.keys(obj).reduce((acc, key) => {
      acc[key] = trimStrings(obj[key])
      return acc
    }, {})
  }

  return obj
}