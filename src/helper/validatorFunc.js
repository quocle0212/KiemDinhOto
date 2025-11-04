export const validatePhoneNumber = (value) => {
  const phonePattern = /^(03|05|07|08|09|01[2|6|8|9])+([0-9]){8}$/; 

  if (!value) {
    return Promise.reject('Vui lòng nhập số điện thoại');
  }
  if (value.length < 10) {
    return Promise.reject('Số điện thoại quá ngắn');
  }
  if (value.length > 11) {
    return Promise.reject('Số điện thoại quá dài');
  }
  if (!phonePattern.test(value)) {
    return Promise.reject('Số điện thoại không hợp lệ');
  }
  return Promise.resolve();
};

export const validateEmail = (value) => {
  const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; 

  if (!value) {
    return Promise.reject('Vui lòng nhập email');
  }
  if (!emailPattern.test(value)) {
    return Promise.reject('Email không hợp lệ');
  }
  return Promise.resolve();
};

export const validateVehicleIdentity = (value) => {
  const MIN_PLATE_NUMBER = 6;
  const MAX_PLATE_NUMBER = 16;

  if (!value) {
    return Promise.reject('Vui lòng nhập biển số xe');
  }
  if (value.length < MIN_PLATE_NUMBER || value.length > MAX_PLATE_NUMBER) {
    return Promise.reject('Biển số xe phải từ 6 đến 16 ký tự');
  }
  if (!/^([A-Z0-9Đ]*[A-ZĐ]|[A-ZĐ]|[0-9])+$/i.test(value)) {
    return Promise.reject('Biển số xe chỉ được nhập chữ và số');
  }
  if (!/^[A-Z0-9Đ]+$/i.test(value)) {
    return Promise.reject('Biển số xe chỉ được nhập chữ và số');
  }
  if (!/[A-ZĐ]/i.test(value)) {
    return Promise.reject('Biển số xe phải có ít nhất một chữ cái');
  }
  return Promise.resolve();
};

export const validateYearManufacture = (value) => {
  const currentYear = new Date().getFullYear().toString().split('');
  const yearPattern = new RegExp(`^(19[0-9][0-9]|[1-${currentYear[0]}][0-${currentYear[1]}][0-${currentYear[2]}][0-${currentYear[3]}])$`);

  if (!value) {
    return Promise.reject('Vui lòng nhập năm sản xuất');
  }
  if (!yearPattern.test(value)) {
    return Promise.reject('Năm sản xuất không hợp lệ');
  }
  return Promise.resolve();
};

export const validateLoadCapacity = (value) => {
  if (!value) {
    return Promise.reject('Vui lòng nhập trọng tải')
  }
  const numValue = Number(value)
  if (isNaN(numValue) || numValue < 1 || numValue > 40) {
    return Promise.reject('Trọng tải phải từ 1-40 tấn')
  }
  return Promise.resolve()
}