import moment from 'moment';
// dateFormats.js 
export const DATE_DISPLAY_FORMAT = 'DD/MM/YYYY';
export const DATE_DISPLAY_FORMAT_HOURS = 'hh:mm - DD/MM/YYYY';
export const DATE_DISPLAY_FORMAT_HOURS_SECONDS = 'hh:mm:ss - DD/MM/YYYY';
export const DATE_HOURS_SECONDS = 'hh:mm:ss';

// Chuyển đổi đối tượng Moment thành số năm
export const getYearFromMoment = (momentObj) => {
  if (momentObj && moment.isMoment(momentObj)) {
    return momentObj.year();
  }
  return 0;
}

// Chuyển đổi số năm thành đối tượng Moment
export const getMomentFromYear = (year) => {
  if (year && typeof year === 'number' && year !== 0) {
    return moment({ year: year });
  }
  return null;
}

// Chuyển đổi đối tượng Moment theo format "DD/MM/YYYY" thành chuỗi ngày
export const getDateStringFromMoment = (momentObj) => {
  if (momentObj && moment.isMoment(momentObj)) {
    return momentObj.format('DD/MM/YYYY');
  }
  return null;
}

// Chuyển đổi chuỗi ngày theo format "DD/MM/YYYY" thành đối tượng Moment
export const getMomentFromDateString = (dateString) => {
  if (dateString && typeof dateString === 'string') {
    if (moment(dateString, 'DD/MM/YYYY').isValid()) {
      return moment(dateString, 'DD/MM/YYYY');
    }
  }
  return null;
}

export const convertDateVN = (value) => {
  return moment(value?.toString())?.format('DD/MM/YYYY')
}

export const convertTimeDate = (value) => {
  if(value){
    return moment(value?.toString())?.format('HH:mm DD/MM/YYYY')
  } else {
    return ''
  }
}

export const convertTimeDateMinute = (value) => {
  return moment(value?.toString())?.format('HH:mm:ss - DD/MM/YYYY')
}


export const stationTypes = [
  { value: 1, label: 'Trung tâm đăng kiểm'},
  { value: 2, label: 'Nội bộ TTDK'},
  { value: 3, label: 'Garage'},
  { value: 4, label: 'Cứu hộ'},
  { value: 5, label: 'Đơn vị Bảo hiểm'},
  { value: 6, label: 'Đơn vị tư vấn'},
  { value: 7, label: 'Đơn vị liên kết'},
  { value: 8, label: 'Đơn vị quảng cáo'},
  { value: 9, label: 'Hợp tác xã'},
  { value: 10, label: 'Đơn vị mua bán xe cũ'},
  { value: 11, label: 'Mua bán phụ tùng ô tô'},
  { value: 12, label: 'Bãi giữ xe'},
  { value: 13, label: 'Đơn vị cải tạo xe'},
  { value: 14, label: 'Trường học lái xe'},
  { value: 15, label: 'Dịch vụ lái xe hộ'},
  { value: 16, label: 'Tư vấn sản xuất phụ tùng xe'},
  { value: 17, label: 'Khám sức khoẻ lái xe'},
]
export const scheduleTypes = [
  { value : 'ALL', label: 'Tất cả trung tâm'},
  { value : 1, label: 'Đăng kiểm xe định kỳ'},
  { value : 2, label: 'Đăng kiểm xe mới'},
  { value : 3, label: 'Nộp hồ sơ xe mới'},
  { value : 7, label: 'Tư vấn bảo dưỡng'},
  { value : 8, label: 'Tư bảo hiểm'},
  { value : 9, label: 'Tư vấn hoán cải'},
  { value : 4, label: 'Thay đổi thông tin xe'},
  { value : 14, label: 'Tư vấn bảo hiểm TNDS xe ô tô'},
  { value : 10, label: 'Mất giấy đăng kiểm'},
  { value : 11, label: 'Cấp lại tem đăng kiểm'},
  { value : 13, label: 'Tư vấn xử lý phạt nguội'},
  { value : 12, label: 'Tư vấn đăng kiểm xe'},
  { value : 15, label: 'Tra cứu cảnh báo đăng kiểm'},
  { value : 16, label: 'Hỗ trợ xử lý phạt nguội'},
  { value : 17, label: 'Gia hạn định vị'},
  { value : 18, label: 'Gia hạn phù hiệu xe kinh doanh'},
  { value : 19, label: 'Gia hạn giấy tập huấn'},
  { value : 20, label: 'Gia hạn camera hành trình'},
  { value : 21, label: 'Đăng ký dán thẻ VETC'},
  { value : 22, label: 'Gia hạn BH TNDS'},
  { value : 23, label: 'Nộp hồ sơ xe mới (Ngoài giờ HC)'},
  { value : 24, label: 'Đăng kiểm xe (Ngoài giờ HC)'},
  { value : 25, label: 'Tư vấn bồi thường bảo hiểm'},
]

export const orderStatus = [
  { value : 0, label: 'Chưa xác nhận'},
  { value : 10, label: 'Đã xác nhận'},
  { value : 20, label: 'Đã huỷ'},
  { value : 30, label: 'Đã đóng'},
]

export const CRIMINAL_STATUS = {
  NO: 'Chưa xử phạt',
  YES: 'Đã xử phạt',
  NOT_CRIMINAL: 'Không có cảnh báo',
}

export const TYPE_VEHICLE_REPORT = [
  {
    value : 1,
    label : "Ô tô từ 9 ghế đổ xuống, CThg"
  },
  {
    value : 2,
    label : "Ô tô khách 10 - 24 ghế"
  },
  {
    value : 3,
    label :  "Ô tô khách 25 - 40 ghế"
  },
  {
    value : 4,
    label : "Ô tô khách trên 40 ghế"
  },
  {
    value : 5,
    label : "Ô tô tải đến 2T"
  },
  {
    value : 6,
    label : "Ô tô tải trên 2T đến 7T"
  },
  {
    value : 7,
    label : "Ô tô tải trên 7T đến 20T, CD"
  },
  {
    value : 8,
    label : "Ô tô tải trên 20T, CD"
  },
  {
    value : 9,
    label : "PT vận tải nhỏ"
  },
  {
    value : 10,
    label : "Ro mooc, sơ mi rooc moc"
  },
  {
    value : 11,
    label : "xe lam, xích lô máy 3 bánh"
  },
  {
    value : "",
    label : "Tổng cộng"
  },
]

export const STATION_STATUS_FILTER = '1'
export const STATION_STATUS_FILTER_ZERO = '0'