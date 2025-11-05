import { Check, Edit } from 'react-feather'
import teleSvg from '@src/assets/images/svg/telegram.svg'
import zalo from '@src/assets/images/svg/zalo.svg'
import ttdk from '@src/assets/images/svg/ttdk.svg'
import fpt from '@src/assets/images/svg/fpt.svg'
import viettel from '@src/assets/images/svg/viettel.svg'
import vnpt from '@src/assets/images/svg/vnpt.svg'
import vivas from '@src/assets/images/icons/logo_vivas.png'
import vmg from '@src/assets/images/icons/vmg.png'
import zaloZns from '@src/assets/images/icons/zalo-zns.png'
import sunpay from '@src/assets/images/icons/sunpay.png'
import capitalpay from '@src/assets/images/svg/capitalpay.svg'
import mailgun from '@src/assets/images/svg/mailgun.svg'
import vnpay from '@src/assets/images/svg/vnpay.svg'


export const FETCH_APPS_REQUEST = 'FETCH_APPS_REQUEST'
export const FETCH_APPS_SUCCESS = 'FETCH_APPS_SUCCESS'
export const FETCH_APP_CHANGE = 'FETCH_APP_CHANGE'

export const ALL_AREA = 'ALL'

export const VEHICLE_TYPE = {
  CAR : 1,
  OTHER : 10,
  RO_MOOC : 20,
  MOTOBIKE: 30,
}

export const VEHICLE_SUB_TYPE = {
  CAR: 1, //'Xe ô tô con',
  OTHER: 10, //'Xe bán tải, phương tiện khác',
  XE_KHACH: 11, //'Xe khách'
  XE_TAI: 12, //'Xe tải'
  XE_TAI_DOAN: 13, //'Đoàn ô tô (ô tô đầu kéo + sơ mi rơ mooc)',
  XE_BAN_TAI: 14, //'Xe bán tải
  RO_MOOC: 20, //label: 'Rơ moóc và sơ mi rơ moóc',
  MOTORCYCLE_OVER_50CC: 30, // 'Xe máy > 50cc'
  MOTORCYCLE_UNDER_50CC: 31, // 'Xe máy < 50cc'
  ELECTRIC_MOTORBIKE: 32, // 'Xe máy điện'
}

export const VEHICLE_SUB_TYPE_LABEL = {
  1: 'Xe ô tô con',
  10: 'Xe bán tải, phương tiện khác',
  11: 'Xe khách',
  12: 'Xe tải',
  13: 'Đoàn ô tô (ô tô đầu kéo + sơ mi rơ mooc)',
  14: 'Xe bán tải',
  20: 'Rơ moóc và sơ mi rơ moóc',
  30: 'Xe máy > 50cc',
  31: 'Xe máy < 50cc',
  32: 'Xe máy điện',
}

export const SIZE_INPUT = 'md'
export const ACTIVE_STATUS = {
  OPEN : '1',
  LOCK : '0'
}

export const SCHEDULE_STATUS = {
  NEW: 0,
  CONFIRMED: 10,
  CANCELED: 20,
  CLOSED: 30,
}
export const SCHEDULE_STATUS_LABEL = {
  NEW: {
    value: SCHEDULE_STATUS.NEW,
    label: 'Chưa xác nhận',
  },
  CONFIRMED: {
    value: SCHEDULE_STATUS.CONFIRMED,
    label: 'Đã xác nhận',
  },
  CANCELED: {
    value: SCHEDULE_STATUS.CANCELED,
    label: 'Đã huỷ',
  },
  CLOSED: {
    value: SCHEDULE_STATUS.CLOSED,
    label: 'Đã đóng',
  },
}

const BANNER_SECTION = {
  HOMEPAGE_MAIN_BANNER: 10, // Banner chính trang chủ trang chủ
  HOMEPAGE_HOT_BANNER: 11, // Banner nổi bật trên trang chủ
  HOMEPAGE_BOTTOM_BANNER: 12, // Banner trang chủ dưới
  WELCOME_SCREEN: 13, // Banner màn hình chào
  DETAIL_SCHEDULE: 14, // Banner chi tiết lịch hẹn
  SUCCESSFUL_APPOINTMENT: 15, // Banner đặt lịch thành công
  // Từ 1001 - 1999 => Dùng cho các "Điểm dịch vụ"
  EXTERNAL: 1001, //Trung tâm đăng kiểm
  INTERNAL: 1002, //Nội bộ TTDK
  GARAGE: 1003, //Garage
  HELPSERVICE: 1004, //cứu hộ
  INSURANCE: 1005, // Đơn vị Bảo hiểm
  CONSULTING: 1006, // Đơn vị tư vấn
  AFFILIATE: 1007, // Đơn vị liên kết
  ADVERTISING: 1008, // Đơn vị quảng cáo
  COOPERATIVE: 1009, // Hợp tác xã
  USED_VEHICLES_DEALERSHIP: 1010, // Đơn vị mua bán xe cũ
  SPARE_PARTS_DEALERSHIP: 1011, // Mua bán phụ tùng ô tô
  PARKING_LOT: 1012, // Bãi giữ xe
  VEHICLE_MODIFICATION: 1013, // Đơn vị cải tạo xe
  DRIVING_SCHOOL: 1014, // Trường học lái xe
  CHAUFFEUR_SERVICE: 1015, // Dịch vụ lái xe hộ
  PARTS_MANUFACTURING_CONSULTANCY: 1016, // Tư vấn sản xuất phụ tùng xe
  DRIVER_HEALTH: 1017, //  Khám sức khoẻ lái xe
  CAR_EVALUATION_SERVICE: 1018, // Dịch vụ định giá xe
}

export const BANNER_TYPE = [
  { title: 'Banner chính trang chủ', value: BANNER_SECTION.HOMEPAGE_MAIN_BANNER },
  { title: 'Banner quảng cáo', value: BANNER_SECTION.HOMEPAGE_HOT_BANNER },
  { title: 'Banner trang chủ dưới', value: BANNER_SECTION.HOMEPAGE_BOTTOM_BANNER },
  { title: 'Banner màn hình chào', value: BANNER_SECTION.WELCOME_SCREEN },
  { title: 'Banner chi tiết lịch hẹn', value: BANNER_SECTION.DETAIL_SCHEDULE },
  { title: 'Banner đặt lịch thành công', value: BANNER_SECTION.SUCCESSFUL_APPOINTMENT },
  // Các loại banner điểm dịch vụ
  { title: 'Bãi giữ xe', value: BANNER_SECTION.PARKING_LOT },
  { title: 'Garage', value: BANNER_SECTION.GARAGE },
  { title: 'Cứu hộ đăng kiểm', value: BANNER_SECTION.HELPSERVICE },
  { title: 'Dịch vụ lái xe hộ', value: BANNER_SECTION.CHAUFFEUR_SERVICE },
  { title: 'Dịch vụ định giá xe', value: BANNER_SECTION.CAR_EVALUATION_SERVICE },
  { title: 'Đơn vị Bảo hiểm', value: BANNER_SECTION.INSURANCE },
  { title: 'Đơn vị tư vấn', value: BANNER_SECTION.CONSULTING },
  { title: 'Đơn vị liên kết', value: BANNER_SECTION.AFFILIATE },
  { title: 'Đơn vị quảng cáo', value: BANNER_SECTION.ADVERTISING },
  { title: 'Đơn vị mua bán xe cũ', value: BANNER_SECTION.USED_VEHICLES_DEALERSHIP },
  { title: 'Đơn vị cải tạo xe', value: BANNER_SECTION.VEHICLE_MODIFICATION },
  { title: 'Hợp tác xã', value: BANNER_SECTION.COOPERATIVE },
  { title: 'Mua bán phụ tùng ô tô', value: BANNER_SECTION.SPARE_PARTS_DEALERSHIP },
  { title: 'Nội bộ TTDK', value: BANNER_SECTION.INTERNAL },
  { title: 'Khám sức khoẻ lái xe', value: BANNER_SECTION.DRIVER_HEALTH },
  { title: 'Trung tâm đăng kiểm', value: BANNER_SECTION.EXTERNAL },
  { title: 'Trường học lái xe', value: BANNER_SECTION.DRIVING_SCHOOL },
  { title: 'Tư vấn sản xuất phụ tùng xe', value: BANNER_SECTION.PARTS_MANUFACTURING_CONSULTANCY },
];

export const STATUS_OPTIONS = {
  STATUS:{ value: '', label: 'stationStatus' },
  OK:{ value: 1, label: 'ok' },
  LOCKED:{ value: 0, label: 'locked' },
}
export const NAVIGATION_TYPE= {
  DIRECT: { value: 1, label: "Trực tiếp"},
  EXTERNAL: { value: 2, label: "Ra ngoài"},
  INTERNAL: { value: 3, label: "Nội bộ"},
}
export const STATION_TYPES = {
  ALL_TYPE:{ value: '', label: 'station_type' },
  STATION:{ value: 1, label: 'external' },
  GARAGE:{ value: 3, label: 'garage' },
  INSURANCE:{ value: 5, label: 'insurance_unit' },
  HELP:{ value: 4, label: 'help_service' },
  CONSULTING:{ value: 6, label: 'consulting_unit' },
}

export const LICENSEPLATES_COLOR = {
  white: 1,
  blue: 2,
  yellow: 3,
  red: 4,
}
export const VEHICLE_PLATE_COLOR = {
  WHITE: {
    value: LICENSEPLATES_COLOR.white,
    label: 'Trắng',
  },
  BLUE: {
    value: LICENSEPLATES_COLOR.blue,
    label: 'Xanh',
  },
  YELLOW: {
    value: LICENSEPLATES_COLOR.yellow,
    label: 'Vàng',
  },
  RED: {
    value: LICENSEPLATES_COLOR.red,
    label: 'Đỏ',
  },
}

export const VIOLATION_STATUS = {
  PENDING: { value: 'PENDING', label: 'Chưa xử lý', color: 'danger' },
  PROCESSED: { value: 'PROCESSED', label: 'Đã xử lý', color: 'success' },
  NO_VIOLATION: { value: 'NO_VIOLATION', label: 'Không vi phạm', color: 'secondary' }
}

export const LOCAL = {
  normal : 2,
  high_level : 3
}

export const APP_USER_ROLE  = {
  patern : 1,
  technician : 2,
  technicians_senior : 3,
  accountant : 4
}

export const VEHICLEVERIFIEDINFO = {
  NOT_VERIFIED: 0, // chưa kiểm tra
  VERIFIED: 1,  // đã kt và có dữ liệu
  VERIFIED_BUT_NO_DATA: -1, // đã kt nhưng ko có dữ liệu
  VERIFIED_BUT_WRONG_EXPIRE_DATE: -2, // đã kt nhưng sai ngày hết hạn
  VERIFIED_BUT_WRONG_VEHICLE_TYPE: -10, //Đã kiểm tra nhưng sai loai phuong tien
  VERIFIED_BUT_ERROR: -3, //Đã kiểm tra nhưng thất bại
  NOT_VALID_SERIAL: -20, // số seri GCN ko hợp lệ
}

export const SCHEDULE_TYPE = {
  VEHICLE_INSPECTION: 1, // Đăng kiểm xe cũ
  REGISTER_EPASS_TAG: 2, // Đăng ký dán thẻ EPASS
  REGISTER_NEW_VEHICLE: 3, // nộp hồ sơ xe mới
  CHANGE_REGISTATION: 4, // Đổi mục đích sử dụng, đổi chủ, đổi thông tin hồ sơ
  PAY_ROAD_FEE: 5, // Thanh toán phí đường bộ
  PAY_INSURRANCE_FEE: 6, // Thanh toán phí bảo hiểm
  CONSULTANT_MAINTENANCE: 7, // Đặt lịch tư vấn bảo dưỡng
  CONSULTANT_INSURANCE: 8, // Đặt lịch tư bảo hiểm
  CONSULTANT_RENOVATION: 9, // Đặt lịch tư vấn hoán cải
  LOST_REGISTRATION_PAPER: 10, // Mất giấy đăng kiểm
  REISSUE_INSPECTION_STICKER: 11, // Cấp lại tem đăng kiểm
  VEHICLE_INSPECTION_CONSULTATION: 12, // Tư vấn đăng kiểm xe
  TRAFFIC_FINE_CONSULTATION: 13, // Tư vấn xử lý phạt nguội
  CONSULTANT_TNDS_INSURANCE: 14, // Tư vấn bảo hiểm TNDS xe ô tô
  AUTO_NOTIFY_VIOLATION: 15, // Tra cứu cảnh báo đăng kiểm
  SUPPORT_FINE_RESOLUTION: 16, // Hỗ trợ xử lý phạt nguội
  GPS_RENEWAL: 17, // Gia hạn định vị
  BUSINESS_VEHICLE_BADGE_RENEWAL: 18, // Gia hạn phù hiệu xe kinh doanh
  TRAINING_CERTIFICATE_RENEWAL: 19, // Gia hạn giấy tập huấn
  DASHCAM_RENEWAL: 20, // Gia hạn camera hành trình
  REGISTER_VETC_TAG: 21, // Đăng ký dán thẻ VETC
  TNDS_INSURANCE_RENEWAL: 22, // Gia hạn BH TNDS
  OFF_HOUR_NEW_VEHICLE_REGISTER: 23, // Nộp hồ sơ xe mới (Ngoài giờ HC)
  OFF_HOUR_VEHICLE_INSPECTION: 24, // Đăng kiểm xe (Ngoài giờ HC)
  CONSULTANT_INSURANCE_COMPENSATION: 25, // Tư vấn bồi thường bảo hiểm
  CONSULTANT_DRIVER_HEALTH: 26, // Tư vấn sức khỏe lái xe
}

export const SCHEDULE_TYPE_LABEL = [
  {
    value: SCHEDULE_TYPE.VEHICLE_INSPECTION,
    label: 'Đăng kiểm xe định kỳ',
    color: "light-warning"
  },
  {
    value: SCHEDULE_TYPE.REGISTER_EPASS_TAG,
    label: 'Đăng ký dán thẻ EPASS',
    color: "light-info"
  },
  {
    value: SCHEDULE_TYPE.REGISTER_NEW_VEHICLE,
    label: 'Nộp hồ sơ xe mới',
    color: "light-info"
  },
  {
    value: SCHEDULE_TYPE.CHANGE_REGISTATION,
    label: 'Thay đổi thông tin xe',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.PAY_ROAD_FEE,
    label: 'Thanh toán phí đường bộ',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.PAY_INSURRANCE_FEE,
    label: 'Thanh toán phí bảo hiệm',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.CONSULTANT_MAINTENANCE,
    label: 'Tư vấn bảo dưỡng',
    color: "light-success"
  },
  {
    value: SCHEDULE_TYPE.CONSULTANT_INSURANCE,
    label: 'Tư vấn bảo hiểm',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.CONSULTANT_RENOVATION,
    label: 'Tư vấn hoán cải',
    color: "light-success"
  },
  {
    value: SCHEDULE_TYPE.LOST_REGISTRATION_PAPER,
    label: 'Mất giấy đăng kiểm',
    color: "light-warning"
  },
  {
    value: SCHEDULE_TYPE.REISSUE_INSPECTION_STICKER,
    label: 'Cấp lại tem đăng kiểm',
    color: "light-warning"
  },
  {
    value: SCHEDULE_TYPE.VEHICLE_INSPECTION_CONSULTATION,
    label: 'Tư vấn đăng kiểm xe',
    color: "light-success"
  },
  {
    value: SCHEDULE_TYPE.TRAFFIC_FINE_CONSULTATION,
    label: 'Tư vấn xử lý phạt nguội',
    color: "light-info"
  },
  {
    value: SCHEDULE_TYPE.CONSULTANT_TNDS_INSURANCE,
    label: 'Tư vấn bảo hiệm TNDS xe ô tô',
    color: "light-danger"
  },
  {
    value: SCHEDULE_TYPE.AUTO_NOTIFY_VIOLATION,
    label: 'Tra cứu cảnh báo đăng kiểm',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.SUPPORT_FINE_RESOLUTION,
    label: 'Hỗ trợ xử lý phạt nguội',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.GPS_RENEWAL,
    label: 'Gia hạn định vị',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.BUSINESS_VEHICLE_BADGE_RENEWAL,
    label: 'Gia hạn phù hiệu xe kinh doanh',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.TRAINING_CERTIFICATE_RENEWAL,
    label: 'Gia hạn giấy tập huấn',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.DASHCAM_RENEWAL,
    label: 'Gia hạn camera hành trình',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.REGISTER_VETC_TAG,
    label: 'Đăng ký dán thẻ VETC',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.TNDS_INSURANCE_RENEWAL,
    label: 'Gia hạn BH TNDS',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.OFF_HOUR_NEW_VEHICLE_REGISTER,
    label: 'Nộp hồ sơ xe mới (Ngoài giờ HC)',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.OFF_HOUR_VEHICLE_INSPECTION,
    label: 'Đăng kiểm xe (Ngoài giờ HC)',
    color: "light-primary"
  },
  {
    value: SCHEDULE_TYPE.CONSULTANT_INSURANCE_COMPENSATION,
    label: 'Tư vấn bồi thường bảo hiểm',
    color: "light-success"
  },
  {
    value: SCHEDULE_TYPE.CONSULTANT_DRIVER_HEALTH,
    label: 'Tư vấn sức khỏe lài xe',
    color: "light-primary"
  }
]

export const CUSTOMER_RECEIPT_STATUS = {
  NEW: 'New', // chưa thanh toán
  PENDING: 'Pending', // đang xử lý
  FAILED: 'Failed', // thanh toán thất bại
  SUCCESS: 'Success', // thanh toán thành công
  CANCELED: 'Canceled', // đã hủy
  PROCESSING: 'Processing', // Tính phí thất bại cần xử lý lại
}

export const CUSTOMER_RECEIPT_LABEL = {
  NEW: {
    label: 'Chưa thanh toán',
    value: CUSTOMER_RECEIPT_STATUS.NEW,
  }, // chưa thanh toán
  PENDING: {
    label: 'Đang xử lý',
    value: CUSTOMER_RECEIPT_STATUS.PENDING,
  }, // đang xử lý
  FAILED: {
    label: 'Thanh toán thất bại',
    value: CUSTOMER_RECEIPT_STATUS.FAILED,
  }, // thanh toán thất bại
  SUCCESS: {
    label: 'Thanh toán thành công',
    value: CUSTOMER_RECEIPT_STATUS.SUCCESS,
  } , // thanh toán thành công
  CANCELED:{
    label: 'Đã hủy',
    value: CUSTOMER_RECEIPT_STATUS.CANCELED
  }, // đã hủy
  PROCESSING: {
    label: '"Đang tính lại phí',
    value: CUSTOMER_RECEIPT_STATUS.PROCESSING
  } // Tính phí thất bại cần xử lý lại
}

export const PAYMENT_TYPES =  {
  CASH: 1, // tiền mặt
  BANK_TRANSFER: 2, // chuyển khoản
  VNPAY_PERSONAL: 3, // Chuyển tiền qua VNPAY
  CREDIT_CARD: 4, // thẻ tín dụng
  MOMO_PERSONAL: 5, // Chuyển tiền qua MoMo
  ATM_TRANSFER: 6, // Thanh toán bằng thẻ nội địa (ATM)
  MOMO_BUSINESS: 7, // Thanh toán qua MoMo
  ZALOPAY_PERSONAL:8, // Chuyển tiền qua Zalo
  VIETTELPAY_PERSONAL:9, // Chuyển tiền qua Viettelpay
}

export const FUEL_TYPE = {
  GASOLINE : 1,
  OIL : 2
}

export const DEVICE_STATUS = {
  NEW : 'NEW',
  ACTIVE : 'ACTIVE',
  MAINTENANCE : 'MAINTENANCE',
  INACTIVE : 'INACTIVE',
  MAINTENANCE_SERVICE : "MAINTENANCE_SERVICE",
  REPAIR : "REPAIR"
}

export const DOCUMENT_CATEGORY = {
  OFFICIAL_LETTER: 1, //Công văn
  ESTABLISHMENT_APPOINTMENT_DOCUMENT: 2, // Giấy tờ thành lập / bổ nhiệm 
  PERIODIC_INSPECTION_DOCUMENT: 3, //Văn bản kiểm tra định kỳ
  TASK_ASSIGNMENT_FORM: 4 // Phiếu phân công nhiệm vụ
}

export const PAYMENT_TYPE_STATE = {
  CASH: 1, // Thanh toán bằng tiền mặt
  BANK_TRANSFER: 2, // Chuyển tiền qua tài khoản ngân hàng
  VNPAY_PERSONAL: 3, // Chuyển tiền qua VNPAY
  CREDIT_CARD: 4, // Thanh toán bằng thẻ tín dụng
  MOMO_PERSONAL: 5, // Chuyển tiền qua MoMo
  ATM_TRANSFER: 6, // Thanh toán bằng thẻ nội địa (ATM)
  MOMO_BUSINESS: 7, // Thanh toán qua MoMo
}

export const optionPaymentTypes =  [
    {
      value: PAYMENT_TYPE_STATE.CASH,
      label: 'pay_cash',
      icon: <Check color="green" />
    },
    {
      value: PAYMENT_TYPE_STATE.BANK_TRANSFER,
      label: 'pay_bank' ,
      icon: <Check color="green" />,
      edit : <Edit color="cornflowerblue" size={16}/>
    },
    {
      value: PAYMENT_TYPE_STATE.VNPAY_PERSONAL,
      label:  'pay_vnpay' ,
      icon: <Check color="green" />
    },
    {
      value: PAYMENT_TYPE_STATE.CREDIT_CARD,
      label:  'pay_card' ,
      icon: <Check color="green" />
    },
    {
      value: PAYMENT_TYPE_STATE.MOMO_PERSONAL,
      label:  'pay_momo' ,
      icon: <Check color="green" />,
      edit : <Edit color="cornflowerblue" size={16}/>
    },
    {
      value: PAYMENT_TYPE_STATE.ATM_TRANSFER,
      label: 'pay_atm' ,
      icon: <Check color="green" />
    },
    {
      value: PAYMENT_TYPE_STATE.MOMO_BUSINESS,
      label: 'pay_business' ,
      icon: <Check color="green" />,
      edit : <Edit color="cornflowerblue" size={16}/>
    }
  ];

  export const MAX_SCHEDULE_PER_INSPECTION_LINE = 100;

  export const THIRDPARTY_CODE = {
    //NOTIFICATION
    ZALO: 'ZALO',
    TELEGRAM: 'TELEGRAM',
    //SMS
    TTDK: 'TTDK',
    VIVAS: 'VIVAS',
    VMG:'VMG',
    FPT: 'FPT',
    VNPT: 'VNPT',
    VIETTEL: 'VIETTEL',
    //ZALO_MESSAGE
    ZALO_ZNS: 'ZALO_ZNS',
    SMARTGIFT: 'SMARTGIFT',
    //EMAIL
    SMTP: 'SMTP',
    MAILGUN: 'MALGUN'
  
  }
  
  export const THIRDPARTY_CATEGORY = {
    PAYMENT: 1,
    NOTIFICATION: 2000,
    SMS: 3000,
    ZALO_MESSAGE: 4000,
    EMAIL: 5000
  }
  
  //map image của thirdparty
  export const THIRDPARTY_CODE_IMAGE = {
    [THIRDPARTY_CODE.CAPITAL_PAY]: capitalpay,
    [THIRDPARTY_CODE.SUNPAY]: sunpay,
    [THIRDPARTY_CODE.VNPAYQR]: vnpay,
    [THIRDPARTY_CODE.TELEGRAM]: teleSvg,
    [THIRDPARTY_CODE.ZALO]: zalo,
    [THIRDPARTY_CODE.TTDK]: ttdk, 
    [THIRDPARTY_CODE.VIVAS]: vivas,
    [THIRDPARTY_CODE.VMG]: vmg,
    [THIRDPARTY_CODE.FPT]: fpt,
    [THIRDPARTY_CODE.VNPT]: vnpt,
    [THIRDPARTY_CODE.VIETTEL]: viettel,
    [THIRDPARTY_CODE.ZALO_ZNS]: zaloZns,
    [THIRDPARTY_CODE.MAILGUN]: mailgun
  
  }
  
  // tắt mở sử dụng thirdparty
  export const THIRDPARTY_CODE_ENABLE = {
    [THIRDPARTY_CODE.CAPITAL_PAY]: false,
    [THIRDPARTY_CODE.SUNPAY]: false,
    [THIRDPARTY_CODE.VNPAYQR]: false,
    [THIRDPARTY_CODE.TELEGRAM]: true,
    [THIRDPARTY_CODE.ZALO]: false,
  
  }

  export const PROCESSING_STATUS = {
    UNPROCESSED: 0, // Chưa xử lý
    FIRST_FOLLOWUP: 1, // Theo dõi lần 1
    SECOND_FOLLOWUP: 2, // Theo dõi lần 2
    CUSTOMER_THINKING: 3, // KH đang suy nghĩ
    CUSTOMER_NO_NEED: 4, // KH không có nhu cầu
    CERTIFICATE_ISSUED: 5, // Đã cấp chứng nhận
    WAITING_PAYMENT: 6, // Chờ KH thanh toán
    CANCEL_CERTIFICATION: 7, // Hủy chứng nhận
    PAID: 8, // Đã thanh toán
  }
  
  export const ORDER_ITEM_STATUS = {
    NEW: 'New', // Mới
    PROCESSING: 'Processing', // Đang sử lý
    PENDING: 'Pending', // Đang chờ
    FAILED: 'Failed', // Thất bại
    SUCCESS: 'Success', // Thành công
    CANCELED: 'Canceled', // Đã hủy
  }
  export const INSURTANCE_STATUS_REF = {
     NEW: {
       value: 'New',
       label: 'Mới'
     },
    PROCESSING: {
      value: 'Processing',
      label: 'Tính phí thất bại cần xử lý lại'
    },
    PENDING: {
      value: 'Pending',
      label: 'Đang trong quá trình xử lý chờ cấp giấy chứng nhận'
    },
    FAILED: {
      value: 'Failed',
      label: 'Đã xuất hợp đồng thất bại'
    },
    SUCCESS: {
      value: 'Success',
      label: 'Đã xuất hợp đồng thành công'
    },
    CANCELED: {
      value: 'Canceled',
      label: 'Đã hủy hợp đồng'
    },
  }

  export const VEHICLE_PURPOSE_USING=[
    {
      value:0,
      label:'Xe ô tô không kinh doanh vận tải'
    },
    {
      value:1,
      label:'Xe ô tô kinh doanh vận tải'
    },
  ]

  export const VEHICLE_PRACTIED_USING=[
    {
      value:0,
      label:'Không'
    },
    {
      value:1,
      label:'Có'
    }
  ]
  
  export const INSURTANCE_CAR_TYPES = [
    {
      label: 'Dưới 6 chỗ ngồi',
      value: 1,
      numberOfSeats: [2,3,4,5],
      insurance_type:"INSURANCE_OTO_NO_BUSINESS_UNDER_6_SEATS"
    },
    {
      label: '6-11 chỗ ngồi',
      value: 2,
      numberOfSeats: [6,7,8,9,10,11],
      insurance_type:"INSURANCE_OTO_NO_BUSINESS_6_TO_11_SEATS"
    },
   {
      label: 'Xe vừa chở người, vừa chở hàng (Pickup, minivan)',
      value: 14,
      numberOfSeats: [2,3,4,5,6,7,8],
      insurance_type:"INSURANCE_OTO_NO_BUSINESS_PICKUP_MINIVAN"
    },
    {
      label: 'Xe chở hàng',
      value: 12,
      numberOfSeats: [1,2,3],
      insurance_type:"INSURANCE_XE_TAI"
    },
    {
      label: 'Xe chuyên dụng',
      value: 10,
      numberOfSeats: [2,3,4,5,6,7,8,9],
      insurance_type:"INSURANCE_OTO_SPECIAL"
    },
  ]

  export const VEHICLE_SUB_CATEGORY_BHOT = {
    OTO_6CHO: 1003, //Ô tô 6 chỗ
    OTO_7CHO: 1004, //Ô tô 7 chỗ
    OTO_8CHO: 1005, //Ô tô 8 chỗ
    OTO_9CHO: 1006, //Ô tô 9 chỗ
    OTO_10CHO: 1007, //Ô tô 10 chỗ
    OTO_11CHO: 1008, //Ô tô 11 chỗ
    XE_BAN_TAI: 2001, //- Xe bán tải (20)
  }
  

  export const CONFIG_DAY_SETTING_FIELD = {
    enableAutoSentNotiBefore30Days: 'Trước 30 ngày',
    enableAutoSentNotiBefore15Days: 'Trước 15 ngày',
    enableAutoSentNotiBefore7Days: 'Trước 7 ngày',
    enableAutoSentNotiBefore3Days: 'Trước 3 ngày',
    enableAutoSentNotiBefore1Days: 'Trước 1 ngày',
    enableAutoSentNotiBeforeOtherDays: 'Khác'
  }
  
  export const CONFIG_SETTING_NOTIFICATION_FIELD = {
    enableNotiByAPNS: 'Thông báo qua APNS',
    enableNotiBySmsCSKH: 'Thông báo qua SMS CSKH',
    enableNotiByZaloCSKH: 'Thông báo qua Zalo CSKH',
    enableNotiBySMSRetry: 'Thông báo qua SMS Retry',
    enableNotiByAutoCall: 'Thông báo qua Auto Call'
  }
  
  export const CONFIG_SETTING_TEMPLATE_KEY = {
    SMS_CSKH_REMINDER_VEHICLE_INSPECTION_1: 1001, // Nhắc đăng kiểm mẫu 1
    SMS_CSKH_REMINDER_VEHICLE_INSPECTION_2: 1002, // Nhắc đăng kiểm mẫu 2
    SMS_AUTO_NOTIFY_VIOLATION_1: 1003, // Tự động thông báo phạt ngội 1
  
    SMS_PROMOTION_INSURANCE_1: 2003, // Khuyến mãi bảo hiểm mẫu 1
    SMS_PROMOTION_MAINTENANCE_1: 2004, // Khuyến mãi bảo dưỡng xe mẫu 1
    SMS_PROMOTION_REMINDER_MAINTENANCE_1: 2005, // Nhắc hẹn bảo dưỡng xe mẫu
    SMS_PROMOTION_MAINTENANCE_2: 2006, // Khuyến mãi bảo dưỡng xe mẫu 2
    SMS_PROMOTION_ADVERTISING_MAINTENANCE_1: 2007, // Quảng cáo bảo dưỡng xe mẫu 1
    SMS_PROMOTION_ADVERTISING_HELPER_1: 2008, // Quảng cáo cứu hộ mẫu 1
    SMS_PROMOTION_HELPER_1: 2009, // Khuyến mãi cứu hộ xe mẫu 1
  
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_1: 3010, // Nhắc đăng kiểm qua Zalo  mẫu 1
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_2: 3011, // Nhắc đăng kiểm qua Zalo mẫu 2
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_3: 3012, // Nhắc đăng kiểm qua Zalo mẫu 3
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_4: 3013, // Nhắc đăng kiểm qua Zalo mẫu 4
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_5: 3014, // Nhắc đăng kiểm qua Zalo mẫu 5
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_6: 3015, // Nhắc đăng kiểm qua Zalo mẫu 6
    ZALO_CSKH_NOTIFY_SCHEDULE_COMFIRMED: 3016, // Thông báo cho khách biết về thông tin lịch
    ZALO_CSKH_NOTIFY_MANAGEMENT_STATION: 3017, // Quản lý trung tâm trên TTDK
    ZALO_CSKH_NOTIFY_CONSULTANT_SCHEDULE: 3018, // Thông báo Xác nhận thông tin lịch hẹn tư vấn
    ZALO_CSKH_CONFIRM_CONSULTANT_SCHEDULE: 3019, // Xác nhận lịch tư vấn
    ZALO_CSKH_NOTIFY_CRIMINAL_RESULT: 3020, // Nhắc kết quả tra cứu phạt nguội (có phạt nguội)
    ZALO_CSKH_NOTIFY_MAINTENANCE_REMINDER_1_DAY: 3021, // Nhắc đi bảo dưỡng trước trước ngày đăng kiểm 1 ngày
    ZALO_CSKH_NOTIFY_MAINTENANCE_REMINDER_3_DAY: 3022, // Nhắc đi bảo dưỡng trước trước ngày đăng kiểm 2 ngày
    ZALO_CSKH_NOTIFY_MAINTENANCE_REMINDER: 3023, // Nhắc đi bảo dưỡng trước n ngày đăng kiểm
    ZALO_CSKH_PRE_INSPECTION_REMINDER: 3024, // Nhắc trước lúc KH chuẩn bị mang xe đi đăng kiểm
    ZALO_CSKH_NOTIFY_CHECK: 3035, // Nhắc trước lúc KH chuẩn bị mang xe đi đăng kiểm

    ZALO_PROMOTION_INSURANCE_1: 4012, // Khuyến mãi bảo hiểm qua Zalo mẫu 1
    ZALO_PROMOTION_MAINTENANCE_1: 4013, // Khuyến mãi bảo dưỡng xe qua Zalo mẫu 1
    ZALO_PROMOTION_REMINDER_MAINTENANCE_1: 4014, // Nhắc hẹn bảo dưỡng xe qua Zalo mẫu 1
    ZALO_PROMOTION_MAINTENANCE_2: 4015, // Khuyến mãi bảo dưỡng xe qua Zalo mẫu 2
    ZALO_PROMOTION_ADVERTISING_MAINTENANCE_1: 4016, // Quảng cáo bảo dưỡng xe qua Zalo mẫu 1
    ZALO_PROMOTION_ADVERTISING_HELPER_1: 4017, // Quảng cáo cứu hộ qua Zalo mẫu 1
    ZALO_PROMOTION_HELPER_1: 4018, // Khuyến mãi cứu hộ xe qua Zalo mẫu 1
    ZALO_PROMOTION_VOUCHER_INSURANCE: 4019, // Thông báo khuyến mãi BH TNDS.
  
    REPORT_DAILY_1: 5019, // Báo cáo tình hình hoạt động trong ngày tại trung tâm 1
    REPORT_WEEKLY: 5020, // Báo cáo tình hình hoạt động trong tuần tại trung tâm
    REPORT_DAILY_2: 5021, // Báo cáo tình hình hoạt động trong ngày tại trung tâm 2
  
    STATION_SMS_CSKH_REMINDER_VEHICLE_INSPECTION_3: 6022, // Nhắc đăng kiểm mẫu 3
    STATION_SMS_CSKH_REMINDER_VEHICLE_INSPECTION_4: 6023, // Nhắc đăng kiểm mẫu 4
    STATION_SMS_CSKH_REMINDER_INSURANCE_TNDS: 6024, // Mẫu nhắc gia hạn bảo hiểm TNDS
    STATION_SMS_CSKH_REMINDER_INSURANCE_BHTV: 6025, // Mẫu nhắc gia hạn bảo hiểm thân vỏ xe
    STATION_SMS_CSKH_REMINDER_SERVICE_GPS: 6026 // Mẫu nhắc gia hạn dịch vụ GPS
  }
  
  export const CONFIG_SETTING_TEMPLATE_VALUE = {
    SMS_CSKH_REMINDER_VEHICLE_INSPECTION_1: 'Nhắc đăng kiểm mẫu 1',
    SMS_CSKH_REMINDER_VEHICLE_INSPECTION_2: 'Nhắc đăng kiểm mẫu 2',
    SMS_AUTO_NOTIFY_VIOLATION_1: 'Tự động thông báo phạt ngội 1',
    SMS_PROMOTION_INSURANCE_1: 'Khuyến mãi bảo hiểm mẫu 1',
    SMS_PROMOTION_MAINTENANCE_1: 'Khuyến mãi bảo dưỡng xe mẫu 1',
    SMS_PROMOTION_REMINDER_MAINTENANCE_1: 'Nhắc hẹn bảo dưỡng xe mẫu',
    SMS_PROMOTION_MAINTENANCE_2: 'Khuyến mãi bảo dưỡng xe mẫu 2',
    SMS_PROMOTION_ADVERTISING_MAINTENANCE_1: 'Quảng cáo bảo dưỡng xe mẫu 1',
    SMS_PROMOTION_ADVERTISING_HELPER_1: 'Quảng cáo cứu hộ mẫu 1',
    SMS_PROMOTION_HELPER_1: 'Khuyến mãi cứu hộ xe mẫu 1',
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_1: 'Nhắc đăng kiểm qua Zalo  mẫu 1',
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_2: 'Nhắc đăng kiểm qua Zalo mẫu 2',
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_3: 'Nhắc đăng kiểm qua Zalo mẫu 3',
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_4: 'Nhắc đăng kiểm qua Zalo mẫu 4',
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_5: 'nhắc đăng kiểm kèm giảm giá',
    ZALO_CSKH_REMINDER_VEHICLE_INSPECTION_6: 'Nhắc đăng kiểm qua Zalo mẫu 6',
    ZALO_CSKH_NOTIFY_SCHEDULE_COMFIRMED: 'Thông báo cho khách biết về thông tin lịch',
    ZALO_CSKH_NOTIFY_MANAGEMENT_STATION: 'Quản lý trung tâm trên TTDK',
    ZALO_CSKH_NOTIFY_CONSULTANT_SCHEDULE: 'Thông báo Xác nhận thông tin lịch hẹn tư vấn',
    ZALO_CSKH_CONFIRM_CONSULTANT_SCHEDULE: 'Xác nhận lịch tư vấn',
    ZALO_CSKH_NOTIFY_CRIMINAL_RESULT: 'Nhắc kết quả tra cứu phạt nguội (có phạt nguội)',
    ZALO_CSKH_NOTIFY_MAINTENANCE_REMINDER_1_DAY: 'Nhắc đi bảo dưỡng trước trước ngày đăng kiểm 1 ngày',
    ZALO_CSKH_NOTIFY_MAINTENANCE_REMINDER_3_DAY: 'Nhắc đi bảo dưỡng trước trước ngày đăng kiểm 2 ngày',
    ZALO_CSKH_NOTIFY_MAINTENANCE_REMINDER: 'Nhắc đi bảo dưỡng trước n ngày đăng kiểm',
    ZALO_CSKH_PRE_INSPECTION_REMINDER: 'Nhắc trước lúc KH chuẩn bị mang xe đi đăng kiểm',
    ZALO_PROMOTION_INSURANCE_1: 'Khuyến mãi bảo hiểm qua Zalo mẫu 1',
    ZALO_PROMOTION_MAINTENANCE_1: 'Khuyến mãi bảo dưỡng xe qua Zalo mẫu 1',
    ZALO_PROMOTION_REMINDER_MAINTENANCE_1: 'Nhắc hẹn bảo dưỡng xe qua Zalo mẫu 1',
    ZALO_PROMOTION_MAINTENANCE_2: 'Khuyến mãi bảo dưỡng xe qua Zalo mẫu 2',
    ZALO_PROMOTION_ADVERTISING_MAINTENANCE_1: 'Quảng cáo bảo dưỡng xe qua Zalo mẫu 1',
    ZALO_PROMOTION_ADVERTISING_HELPER_1: 'Quảng cáo cứu hộ qua Zalo mẫu 1',
    ZALO_PROMOTION_HELPER_1: 'Khuyến mãi cứu hộ xe qua Zalo mẫu 1',
    ZALO_PROMOTION_VOUCHER_INSURANCE: 'Thông báo khuyến mãi BH TNDS.',
    REPORT_DAILY_1: 'Báo cáo tình hình hoạt động trong ngày tại trung tâm 1',
    REPORT_WEEKLY: 'Báo cáo tình hình hoạt động trong tuần tại trung tâm',
    REPORT_DAILY_2: 'Báo cáo tình hình hoạt động trong ngày tại trung tâm 2',
    STATION_SMS_CSKH_REMINDER_VEHICLE_INSPECTION_3: 'Nhắc đăng kiểm mẫu 3',
    STATION_SMS_CSKH_REMINDER_VEHICLE_INSPECTION_4: 'Nhắc đăng kiểm mẫu 4',
    STATION_SMS_CSKH_REMINDER_INSURANCE_TNDS: 'Mẫu nhắc gia hạn bảo hiểm TNDS',
    STATION_SMS_CSKH_REMINDER_INSURANCE_BHTV: 'Mẫu nhắc gia hạn bảo hiểm thân vỏ xe',
    STATION_SMS_CSKH_REMINDER_SERVICE_GPS: 'Mẫu nhắc gia hạn dịch vụ GPS',
    ZALO_CSKH_NOTIFY_CHECK:"Thông báo nhắc hạn đăng kiểm",
  }

  export const SETTING_STATUS = {
    ENABLE: 1,
    DISABLE: 0
  }

  export const CONFIG_NOTIFICATION_SETTING_FIELD = {
    notificationApp: 'Thông báo qua ứng dụng',
    notificationSMS: 'Tin nhắn SMS CSKH',
    notificationZalo: 'Tin nhắn Zalo CSKH',
    notificationSMSIfNoZalo: 'Thông báo qua SMS nếu khách hàng không có Zalo',
    autoCall: 'Cuộc gọi tự động'
  }

  export const messageTemplateField = {
    APNS: 'messageTemplateZaloCSKH',
    SMS_CSKH: 'SMS_CSKH',
    ZALO_CSKH: 'ZALO_CSKH',
    SMS_CSKH: 'SMS_CSKH',
    CALL: 'CALL'
  }

  export const optionServiceType = (intl) => [
    {
      value: 1,
      label: intl.formatMessage({ id: "checkingViolation" }),
      servicePrice: 0,
    },
    {
      value: 2,
      label: intl.formatMessage({ id: "createTagVetc" }),
      servicePrice: 0,
    },
    {
      value: 3,
      label: intl.formatMessage({ id: "payViolationFee" }),
      servicePrice: 0,
    },
    {
      value: 4,
      label: intl.formatMessage({ id: "extendInsuranceTnds" }),
      servicePrice: 0,
    },
    {
      value: 5,
      label: intl.formatMessage({ id: "payVetcFee" }),
      servicePrice: 0,
    },
    {
      value: 6,
      label: intl.formatMessage({ id: "extendIssuranceBody" }),
      servicePrice: 0,
    },
    {
      value: 7,
      label: intl.formatMessage({ id: "repairService" }),
      servicePrice: 0,
    },
    {
      value: 8,
      label: intl.formatMessage({ id: "inspectCar" }),
      servicePrice: 0,
    },
    {
      value: 9,
      label: intl.formatMessage({ id: "payEpassFee" }),
      servicePrice: 0,
    },
    {
      value: 10,
      label: intl.formatMessage({ id: "helpService" }),
      servicePrice: 0,
    },
    {
      value: 11,
      label: intl.formatMessage({ id: "consultationImprovement" }),
      servicePrice: 0,
    },
    {
      value: 12,
      label: intl.formatMessage({ id: "autoNotifyViolation" }),
      servicePrice: 0,
    },
    {
      value: 13,
      label: intl.formatMessage({ id: "vehicleInspection" }),
      servicePrice: 0,
    },
    {
      value: 14,
      label: intl.formatMessage({ id: "registerNewVehicle" }),
      servicePrice: 0,
    },
    {
      value: 15,
      label: intl.formatMessage({ id: "changeRegistration" }),
      servicePrice: 0,
    },
    {
      value: 16,
      label: intl.formatMessage({ id: "payRoadFee" }),
      servicePrice: 0,
    },
    {
      value: 18,
      label: intl.formatMessage({ id: "consultantMaintenance" }),
      servicePrice: 0,
    },
    {
      value: 19,
      label: intl.formatMessage({ id: "consultantInsurance" }),
      servicePrice: 0,
    },
    {
      value: 20,
      label: intl.formatMessage({ id: "lostRegistrationPaper" }),
      servicePrice: 0,
    },
    {
      value: 21,
      label: intl.formatMessage({ id: "reissueInspectionSticker" }),
      servicePrice: 0,
    },
    {
      value: 22,
      label: intl.formatMessage({ id: "vehicleInspectionConsultation" }),
      servicePrice: 0,
    },
    {
      value: 23,
      label: intl.formatMessage({ id: "trafficFineConsultation" }),
      servicePrice: 0,
    },
    {
      value: 24,
      label: intl.formatMessage({ id: "consultantTndsInsurance" }),
      servicePrice: 0,
    },
    {
      value: 25,
      label: intl.formatMessage({ id: "autoNotifyViolationCheck" }),
      servicePrice: 0,
    },
    {
      value: 26,
      label: intl.formatMessage({ id: "supportFineResolution" }),
      servicePrice: 0,
    },
    {
      value: 27,
      label: intl.formatMessage({ id: "gpsRenewal" }),
      servicePrice: 0,
    },
    {
      value: 28,
      label: intl.formatMessage({ id: "businessVehicleBadgeRenewal" }),
      servicePrice: 0,
    },
    {
      value: 29,
      label: intl.formatMessage({ id: "trainingCertificateRenewal" }),
      servicePrice: 0,
    },
    {
      value: 30,
      label: intl.formatMessage({ id: "dashcamRenewal" }),
      servicePrice: 0,
    },
    {
      value: 31,
      label: intl.formatMessage({ id: "tndsInsuranceRenewal" }),
      servicePrice: 0,
    },
    {
      value: 32,
      label: intl.formatMessage({ id: "offHourNewVehicleRegister" }),
      servicePrice: 0,
    },
    {
      value: 33,
      label: intl.formatMessage({ id: "offHourVehicleInspection" }),
      servicePrice: 0,
    },
    {
      value: 34,
      label: intl.formatMessage({ id: "driverHealth" }),
      servicePrice: 0,
    },
    {
      value: 35,
      label: intl.formatMessage({ id: "consultantInsuranceCompensation" }),
      servicePrice: 0,
    },
];
    
export const COLUMNS_WIDTH = {
  SMALL:"80px",
  LARGE:"150px",
  XLARGE:"200px",
  XXLARGE:"250px",
  XXXLARGE:"300px",
}
