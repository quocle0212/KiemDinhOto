export const ROLE_ADMIN = 1

export const ALL_PERMISSION = {
  VIEW_DASHBOARD: {
    value: 'VIEW_DASHBOARD',
    label: 'Dashboard'
  },
  OVERVIEW: {
    value: 'OVERVIEW',
    label: 'Tổng quan',
    childrens: {
      OVERVIEW_SCHEDULE: {
        value: 'OVERVIEW_SCHEDULE',
        label: 'Tổng quan lịch hẹn'
      },
      OVERVIEW_ACTIVE: {
        value: 'OVERVIEW_ACTIVE',
        label: 'Tổng quan hoạt động'
      },
      OVERVIEW_CENTER: {
        value: 'OVERVIEW_CENTER',
        label: 'Tổng quan trung tâm'
      }
    }
  },
  VIEW_MANAGER_STATIONS: {
    value: 'VIEW_MANAGER_STATIONS',
    label: 'Quản lý',
    childrens: {
      VIEW_STATIONS: {
        value: 'VIEW_STATIONS',
        label: 'Quản lý - Trung tâm'
      },
      VIEW_STATIONS_USERS: {
        value: 'VIEW_STATIONS_USERS',
        label: 'Quản lý - Nhân viên'
      },
      VIEW_STATIONS_STAFFS: {
        value: 'VIEW_STATIONS_STAFFS',
        label: 'Quản lý - Đăng kiểm viên'
      },
      VIEW_STATIONS_VEHICLES: {
        value: 'VIEW_STATIONS_VEHICLES',
        label: 'Quản lý - Hồ sơ phương tiện'
      },
      VIEW_STATIONS_SCHEDULE: {
        value: 'VIEW_STATIONS_SCHEDULE',
        label: 'Quản lý - Lịch hẹn'
      },
      VIEW_STATIONS_REPORT: {
        value: 'VIEW_STATIONS_REPORT',
        label: 'Quản lý - Báo cáo'
      },
      VIEW_STATIONS_DEVICES: {
        value: 'VIEW_STATIONS_DEVICES',
        label: 'Quản lý - Thiết bị'
      },
      VIEW_STATIONS_DOCUMENT: {
        value: 'VIEW_STATIONS_DOCUMENT',
        label: 'Quản lý - Tài liệu'
      },
      VIEW_STATIONS_CAMERA: {
        value: 'VIEW_STATIONS_CAMERA',
        label: 'Quản lý - Camera'
      },
      VIEW_STATIONS_ALERT: {
        value: 'VIEW_STATIONS_ALERT',
        label: 'Quản lý - Cảnh báo'
      }
    }
  },
  VIEW_USER: {
    value: 'VIEW_USER',
    label: 'Người dùng',
    childrens: {
      VIEW_APP_USERS: {
        value: 'VIEW_APP_USERS',
        label: 'Người dùng - Danh sách'
      },
      VIEW_STAFFS: {
        value: 'VIEW_STAFFS',
        label: 'Người dùng - Quản trị viên'
      }
    }
  },
  VIEW_VEHICLE: {
    value: 'VIEW_VEHICLE',
    label: 'Phương tiện',
    childrens: {
      VIEW_VEHICLE_LIST: {
        value: 'VIEW_VEHICLE_LIST',
        label: 'Phương tiện - Danh sách'
      },
      VIEW_VEHICLE_WARNING: {
        value: 'VIEW_VEHICLE_WARNING',
        label: 'Phương tiện - Cảnh báo'
      }
    }
  },
  MANAGE_SERVICE_SCHEDULE: {
    value: 'MANAGE_SERVICE_SCHEDULE',
    label: 'Đơn Tư vấn',
    childrens: {
      MANAGE_VEHICLE_INSPECTION: {
        value: 'MANAGE_VEHICLE_INSPECTION',
        label: 'Đơn Tư vấn - Đăng kiểm định kỳ'
      },
      MANAGE_NEW_VEHICLE_INSPECTION: {
        value: 'MANAGE_NEW_VEHICLE_INSPECTION',
        label: 'Đơn Tư vấn - Đăng ký dán thẻ ePass'
      },
      MANAGE_NEW_VEHICLE_REGISTRATION: {
        value: 'MANAGE_NEW_VEHICLE_REGISTRATION',
        label: 'Đơn Tư vấn - Nộp hồ sơ xe mới'
      },
      MANAGE_CHANGE_VEHICLE_INFO: {
        value: 'MANAGE_CHANGE_VEHICLE_INFO',
        label: 'Đơn Tư vấn - Thay đổi thông tin xe'
      },
      MANAGE_MAINTENANCE_CONSULTING: {
        value: 'MANAGE_MAINTENANCE_CONSULTING',
        label: 'Đơn Tư vấn - Tư vấn bảo dưỡng'
      },
      MANAGE_INSURANCE_CONSULTING: {
        value: 'MANAGE_INSURANCE_CONSULTING',
        label: 'Đơn Tư vấn - Tư vấn bảo hiểm'
      },
      MANAGE_CONVERSION_CONSULTING: {
        value: 'MANAGE_CONVERSION_CONSULTING',
        label: 'Đơn Tư vấn - Tư vấn hoán cải'
      },
      MANAGE_LOST_REGISTRATION: {
        value: 'MANAGE_LOST_REGISTRATION',
        label: 'Đơn Tư vấn - Mất giấy đăng kiểm'
      },
      MANAGE_REISSUE_REGISTRATION_STAMP: {
        value: 'MANAGE_REISSUE_REGISTRATION_STAMP',
        label: 'Đơn Tư vấn - Cấp lại tem đăng kiểm'
      },
      MANAGE_VEHICLE_REGISTRATION_CONSULTING: {
        value: 'MANAGE_VEHICLE_REGISTRATION_CONSULTING',
        label: 'Đơn Tư vấn - Tư vấn đăng ký xe'
      },
      MANAGE_COLD_PENALTY_CONSULTING: {
        value: 'MANAGE_COLD_PENALTY_CONSULTING',
        label: 'Đơn Tư vấn - Tư vấn phạt nguội'
      },
      MANAGE_TNDS_INSURANCE_CONSULTING: {
        value: 'MANAGE_TNDS_INSURANCE_CONSULTING',
        label: 'Đơn Tư vấn - Tư vấn bảo hiểm TNDS'
      },
      MANAGE_CHECK_REGISTRATION_DEADLINE: {
        value: 'MANAGE_CHECK_REGISTRATION_DEADLINE',
        label: 'Đơn Tư vấn - Tra hạn đăng kiểm'
      }
    }
  },
  VIEW_INTERACTION: {
    value: 'VIEW_INTERACTION',
    label: 'Tương tác',
    childrens: {
      VIEW_NOTIFICATION: {
        value: 'VIEW_NOTIFICATION',
        label: 'Tương tác - Thông báo'
      },
      VIEW_DOCUMENTS: {
        value: 'VIEW_DOCUMENTS',
        label: 'Tương tác - Công văn'
      },
      VIEW_NEWS: {
        value: 'VIEW_NEWS',
        label: 'Tương tác - Tin Tức'
      }
    }
  },
  VIEW_INTEGRATIONS: {
    value: 'VIEW_INTEGRATIONS',
    label: 'Tích hợp'
  },
  VIEW_SELL: {
    value: 'VIEW_SELL',
    label: 'Bán hàng',
    childrens: {
      VIEW_SELL_ORDER: {
        value: 'VIEW_SELL_ORDER',
        label: 'Bán hàng - Đơn hàng'
      },
      VIEW_SELL_MOTORBIKE_INSURANCE: {
        value: 'VIEW_SELL_MOTORBIKE_INSURANCE',
        label: 'Bán hàng - Bảo hiểm xe máy'
      },
      VIEW_SELL_OTO_INSURANCE: {
        value: 'VIEW_SELL_OTO_INSURANCE',
        label: 'Bán hàng - Bảo hiểm ô tô'
      },
      VIEW_SELL_COLD_PENALTY_MESSAGE: {
        value: 'VIEW_SELL_COLD_PENALTY_MESSAGE',
        label: 'Bán hàng - Tin nhắn phạt nguội'
      },
      VIEW_SELL_INSTALL: {
        value: 'VIEW_SELL_INSTALL',
        label: 'Bán hàng - Cài đặt'
      }
    }
  },
  VIEW_PAYMENTS: {
    value: 'VIEW_PAYMENTS',
    label: 'Thanh toán',
    childrens: {
      VIEW_PAYMENTS_SCHEDULE: {
        value: 'VIEW_PAYMENTS_SCHEDULE',
        label: 'Thanh toán - Lịch hẹn'
      },
      VIEW_PAYMENTS_INVOICE: {
        value: 'VIEW_PAYMENTS_INVOICE',
        label: 'Thanh toán - Hóa đơn'
      },
      VIEW_PAYMENTS_METHOD: {
        value: 'VIEW_PAYMENTS_METHOD',
        label: 'Thanh toán - Phương thức thanh toán'
      }
    }
  },
  VIEW_SYSTEM_CONFIGURATIONS: {
    value: 'VIEW_SYSTEM_CONFIGURATIONS',
    label: 'Thiết lập',
    childrens: {
      VIEW_SYSTEM_SETUP: {
        value: 'VIEW_SYSTEM_SETUP',
        label: 'Thiết lập - Hệ thống'
      },
      VIEW_SYSTEM_DASHBOARD: {
        value: 'VIEW_SYSTEM_DASHBOARD',
        label: 'Thiết lập - Trang chủ'
      },
      VIEW_SYSTEM_BANNER: {
        value: 'VIEW_SYSTEM_BANNER',
        label: 'Thiết lập - Quảng cáo banner'
      },
      VIEW_SYSTEM_APIKEY: {
        value: 'VIEW_SYSTEM_APIKEY',
        label: 'Thiết lập - API Key'
      },
      VIEW_SYSTEM_DAYOFF: {
        value: 'VIEW_SYSTEM_DAYOFF',
        label: 'Thiết lập - Ngày nghỉ'
      },
      VIEW_SYSTEM_EXTEND: {
        value: 'VIEW_SYSTEM_EXTEND',
        label: 'Thiết lập - Mở rộng'
      },
      VIEW_SYSTEM_AUTOMATION: {
        value: 'VIEW_SYSTEM_AUTOMATION',
        label: 'Thiết lập - Tự động hóa'
      },
    }
  },
  VIEW_AUTOMATION: {
    value: 'VIEW_AUTOMATION',
    label: 'Tự động hóa',
    childrens: {
      VIEW_AUTOMATION_CUSTOMER: {
        value: 'VIEW_AUTOMATION_CUSTOMER',
        label: 'Tự động hóa - Tự động CSKH'
      }
    }
  }
}

export const getAllPermissionFormatArray = () => {
  const result = []

  function recurse(current) {
    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        const item = current[key]
        result.push({
          value: item.value,
          label: item.label
        })

        if (item.childrens) {
          recurse(item.childrens)
        }
      }
    }
  }

  recurse(ALL_PERMISSION)
  return result
}

export const getAllPermissionFormatString = () => {
  const values = [];

  function recurse(current) {
    for (const key in current) {
      if (current.hasOwnProperty(key)) {
        const item = current[key];
        values.push(item.value);
        if (item.childrens) {
          recurse(item.childrens);
        }
      }
    }
  }

  recurse(ALL_PERMISSION);
  return values.join(',');
};
