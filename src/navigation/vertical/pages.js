// @ts-nocheck
/* eslint-disable import/no-anonymous-default-export */

import {
  Archive,
  Home,
  Circle,
  DollarSign,
  List,
  Slack,
  BookOpen,
  User,
  Divide,
  Shield,
  HardDrive,
  Cast,
  Image,
  Settings,
  Book,
  MessageCircle,
  Cpu,
  Bell,
  CreditCard,
  Clipboard,
  Sliders,
  Tool,
  Grid,
  Camera,
  FileText
} from 'react-feather'
import { ALL_PERMISSION } from '../../constants/permission'

const App = [
  // {
  //   id: 'dashboards',
  //   title: 'home',
  //   icon: <Home size={20} />,
  //   navLink: '/dashboard/analytics',
  //   permissions: [ALL_PERMISSION.VIEW_DASHBOARD.value]
  // },
  // {
  //   id: 'overview',
  //   title: 'overview',
  //   icon: <Image size={20} />,
  //   permissions: [ALL_PERMISSION.OVERVIEW.value],
  //   children: [
  //     {
  //       id: 'schedule',
  //       title: 'schedule',
  //       icon: <Circle size={12} />,
  //       permissions: [ALL_PERMISSION.OVERVIEW.childrens.OVERVIEW_SCHEDULE.value],
  //       navLink: '/overview/center'
  //     },
  //     {
  //       id: 'actived',
  //       title: 'actived',
  //       icon: <Circle size={12} />,
  //       permissions: [ALL_PERMISSION.OVERVIEW.childrens.OVERVIEW_ACTIVE.value],
  //       navLink: '/overview/schedule'
  //     },
  //     {
  //       id: 'center',
  //       title: 'center',
  //       icon: <Circle size={12} />,
  //       permissions: [ALL_PERMISSION.OVERVIEW.childrens.OVERVIEW_CENTER.value],
  //       navLink: '/overview/actived'
  //     },
  //   ]
  // },
  {
    id: 'manager_ttdk',
    title: 'manager',
    icon: <Archive size={20} />,
    permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.value],
    children: [
      {
        id: 'station',
        title: 'stations',
        icon: <HardDrive size={12} />,
        permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.childrens.VIEW_STATIONS.value],
        navLink: '/pages/station'
      },
      {
        id: 'center_staff',
        title: 'staff',
        icon: <Cast size={12} />,
        permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.childrens.VIEW_STATIONS_USERS.value],
        navLink: '/pages/center-staff'
      },
      {
        id: 'technicians',
        title: 'technicians',
        icon: <Slack size={12} />,
        permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.childrens.VIEW_STATIONS_STAFFS.value],
        navLink: '/pages/technicians'
      },
      {
        id: 'file',
        title: 'vehicle_profile',
        icon: <Circle size={12} />,
        permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.childrens.VIEW_STATIONS_VEHICLES.value],
        navLink: '/pages/file'
      },
      {
        id: 'schedules',
        title: 'schedules',
        icon: <Book size={12} />,
        permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.childrens.VIEW_STATIONS_SCHEDULE.value],
        navLink: '/pages/schedule'
      },
      {
        id: 'report',
        title: 'report',
        icon: <List size={12} />,
        permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.childrens.VIEW_STATIONS_REPORT.value],
        navLink: '/pages/report'
      },
      {
        id: 'device',
        title: 'devices',
        icon: <Divide size={12} />,
        permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.childrens.VIEW_STATIONS_DEVICES.value],
        navLink: '/pages/devices'
      },
      {
        id: 'documentaryFromStation',
        title: 'documentaryFromStation',
        icon: <FileText size={12} />,
        permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.childrens.VIEW_STATIONS_DOCUMENT.value],
        navLink: '/pages/documentaryFromStation'
      },
      {
        id: 'list-camera',
        title: 'Camera',
        icon: <Camera size={12} />,
        navLink: '/pages/camera',
        permissions: [ALL_PERMISSION.VIEW_MANAGER_STATIONS.childrens.VIEW_STATIONS_CAMERA.value],
      },
    ]
  },
  {
    id: 'user',
    title: 'User',
    icon: <User size={12} />,
    permissions: [ALL_PERMISSION.VIEW_USER.value],
    children: [
      {
        id: 'User',
        title: 'list',
        icon: <Circle size={12} />,
        navLink: '/pages/users',
        permissions: [ALL_PERMISSION.VIEW_USER.childrens.VIEW_APP_USERS.value],
      },
      {
        id: 'account-admin',
        title: 'admin',
        icon: <Shield size={12} />,
        permissions: [ALL_PERMISSION.VIEW_USER.childrens.VIEW_STAFFS.value],
        navLink: '/pages/account-admin'
      }
    ]
  },
  {
    id: 'vehicle',
    title: 'Vehicle',
    icon: <Cpu size={12} />,
    permissions: [ALL_PERMISSION.VIEW_VEHICLE.value],
    // navLink: '/pages/vehicle',
    children: [
      {
        id: 'list-schedule',
        title: 'list',
        icon: <Circle size={12} />,
        permissions: [ALL_PERMISSION.VIEW_VEHICLE.childrens.VIEW_VEHICLE_LIST.value],
        navLink: '/pages/vehicle',
      },
      {
        id: 'warning',
        title: 'warning',
        icon: <Circle size={12} />,
        permissions: [ALL_PERMISSION.VIEW_VEHICLE.childrens.VIEW_VEHICLE_WARNING.value],
        navLink: '/pages/warning',
      },
    ]
  },
  {
    id: 'consultation_form',
    title: 'consultation_form',
    icon: <Book size={12} />,
    permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.value],
    children: [
      {
        id: 'old_car_registration',
        title: 'old_car_registration',
        icon: <MessageCircle size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_VEHICLE_INSPECTION.value],
        navLink: '/pages/consultation_form/1'
      },
      {
        id: 'register_for_ePass',
        title: 'register_for_ePass',
        icon: <Bell size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_NEW_VEHICLE_INSPECTION.value],
        navLink: '/pages/consultation_form/2'
      },
      {
        id: 'new_car_profile',
        title: 'new_car_profile',
        icon: <BookOpen size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_NEW_VEHICLE_REGISTRATION.value],
        navLink: '/pages/consultation_form/3'
      },
      {
        id: 'CHANGE_REGISTATION',
        title: 'CHANGE_REGISTATION',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_CHANGE_VEHICLE_INFO.value],
        navLink: '/pages/consultation_form/4'
      },
      {
        id: 'CONSULTANT_MAINTENANCE',
        title: 'CONSULTANT_MAINTENANCE',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_MAINTENANCE_CONSULTING.value],
        navLink: '/pages/consultation_form/7'
      },
      {
        id: 'CONSULTANT_INSURANCE',
        title: 'CONSULTANT_INSURANCE',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_INSURANCE_CONSULTING.value],
        navLink: '/pages/consultation_form/8'
      },
      {
        id: 'CONSULTANT_RENOVATION',
        title: 'CONSULTANT_RENOVATION',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_CONVERSION_CONSULTING.value],
        navLink: '/pages/consultation_form/9'
      },
      {
        id: 'LOST_REGISTRATION_PAPER',
        title: 'LOST_REGISTRATION_PAPER',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_LOST_REGISTRATION.value],
        navLink: '/pages/consultation_form/10'
      },
      {
        id: 'REISSUE_INSPECTION_STICKER',
        title: 'REISSUE_INSPECTION_STICKER',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_REISSUE_REGISTRATION_STAMP.value],
        navLink: '/pages/consultation_form/11'
      },
      {
        id: 'VEHICLE_INSPECTION_CONSULTATION',
        title: 'VEHICLE_INSPECTION_CONSULTATION',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_VEHICLE_REGISTRATION_CONSULTING.value],
        navLink: '/pages/consultation_form/12'
      },
      {
        id: 'TRAFFIC_FINE_CONSULTATION',
        title: 'TRAFFIC_FINE_CONSULTATION',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_COLD_PENALTY_CONSULTING.value],
        navLink: '/pages/consultation_form/13'
      },
      {
        id: 'CONSULTANT_INSURANCE_TNDS',
        title: 'CONSULTANT_INSURANCE_TNDS',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_TNDS_INSURANCE_CONSULTING.value],
        navLink: '/pages/consultation_form/14'
      },
      {
        id: 'check_registration_deadline',
        title: 'check_registration_deadline',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.MANAGE_SERVICE_SCHEDULE.childrens.MANAGE_CHECK_REGISTRATION_DEADLINE.value],
        navLink: '/pages/registration_deadline'
      },
    ]
  },
  {
    id: 'Interact',
    title: 'Interact',
    icon: <Cpu size={12} />,
    permissions: [ALL_PERMISSION.VIEW_INTERACTION.value],
    children: [
      // {
      //   id: 'Chat',
      //   title: 'Chat',
      //   icon: <MessageCircle size={12} />,
      //   permissions: ['VIEW_CHAT'],
      //   navLink: '/apps/chat'
      // },
      {
        id: 'notification',
        title: 'notification',
        icon: <Bell size={12} />,
        permissions: [ALL_PERMISSION.VIEW_INTERACTION.childrens.VIEW_NOTIFICATION.value],
        navLink: '/pages/notification'
      },
      {
        id: 'documentary',
        title: 'documentary',
        icon: <BookOpen size={12} />,
        permissions: [ALL_PERMISSION.VIEW_INTERACTION.childrens.VIEW_DOCUMENTS.value],
        navLink: '/pages/documentary'
      },
      {
        id: 'news',
        title: 'post',
        icon: <Clipboard size={12} />,
        permissions: [ALL_PERMISSION.VIEW_INTERACTION.childrens.VIEW_NEWS.value],
        navLink: '/pages/news'
      }

    ]
  },
  // {
  //   id: 'advertising',
  //   title: 'advertising',
  //   icon: <Image size={12} />,
  //   permissions: [],
  //   navLink: '/pages/advertising'
  // },
  //TODO : Tạm đóng, khi nào cấp quyền thì mở ra lại cho đúng quyền theo yêu cầu
  {
    id: 'integrated',
    title: 'integrated',
    icon: <CreditCard size={12} />,
    permissions: [ALL_PERMISSION.VIEW_INTEGRATIONS.value],
    navLink: '/pages/integrated'
  },
  {
    id: 'sell',
    title: 'sell',
    icon: <Grid size={12} />,
    permissions: [ALL_PERMISSION.VIEW_SELL.value],
    children: [
      {
        id: 'order',
        title: 'order',
        icon: <Circle size={12} />,
        navLink: '/pages/order',
        permissions: [ALL_PERMISSION.VIEW_SELL.childrens.VIEW_SELL_ORDER.value],
      },
      {
        id: 'motorbike-insurance',
        title: 'motorbike-insurance',
        icon: <Circle size={12} />,
        navLink: '/pages/motorbikeInsurance',
        permissions: [ALL_PERMISSION.VIEW_SELL.childrens.VIEW_SELL_MOTORBIKE_INSURANCE.value],
      },
      {
        id: 'oto-insurance',
        title: 'oto-insurance',
        icon: <Circle size={12} />,
        navLink: '/pages/otoInsurance',
        permissions: [ALL_PERMISSION.VIEW_SELL.childrens.VIEW_SELL_OTO_INSURANCE.value],
      },
      {
        id: 'punish-sms',
        title: 'punish-sms',
        icon: <Circle size={12} />,
        navLink: '/pages/punishsms',
        permissions: [ALL_PERMISSION.VIEW_SELL.childrens.VIEW_SELL_COLD_PENALTY_MESSAGE.value],
      },
      {
        id: 'setting-order',
        title: 'setting-order',
        icon: <Circle size={12} />,
        navLink: '/pages/order-setting',
        permissions: [ALL_PERMISSION.VIEW_SELL.childrens.VIEW_SELL_INSTALL.value],
      },
    ]
  },
  {
    id: 'pay',
    title: 'pay',
    icon: <DollarSign size={12} />,
    permissions: [ALL_PERMISSION.VIEW_PAYMENTS.value],
    children: [
      {
        id: 'schedule-pay',
        title: 'schedules',
        icon: <Circle size={12} />,
        navLink: '/pages/schedule-pay',
        permissions: [ALL_PERMISSION.VIEW_PAYMENTS.childrens.VIEW_PAYMENTS_SCHEDULE.value],
      },
      {
        id: 'bill-pay',
        title: 'bill',
        icon: <Circle size={12} />,
        navLink: '/pages/bill-pay',
        permissions: [ALL_PERMISSION.VIEW_PAYMENTS.childrens.VIEW_PAYMENTS_INVOICE.value],
      },
      {
        id: 'methods-pay',
        title: 'payment_methods',
        icon: <Circle size={12} />,
        navLink: '/pages/methods-pay',
        permissions: [ALL_PERMISSION.VIEW_PAYMENTS.childrens.VIEW_PAYMENTS_METHOD.value],
      }
    ]
  },
  {
    id: 'setting',
    title: 'setting',
    icon: <Settings size={12} />,
    permissions: [ALL_PERMISSION.VIEW_SYSTEM_CONFIGURATIONS.value],
    children: [
      {
        id: 'setting-system',
        title: 'setting-system',
        icon: <Circle size={12} />,
        navLink: '/pages/schedule-system',
        permissions: [ALL_PERMISSION.VIEW_SYSTEM_CONFIGURATIONS.childrens.VIEW_SYSTEM_SETUP.value],
      },
      {
        id: 'setting-home',
        title: 'setting-home',
        icon: <Circle size={12} />,
        navLink: '/pages/setting',
        permissions: [ALL_PERMISSION.VIEW_SYSTEM_CONFIGURATIONS.childrens.VIEW_SYSTEM_DASHBOARD.value],
      },
      {
        id: 'advertising-banner',
        title: 'advertising-banner',
        icon: <Circle size={12} />,
        navLink: '/pages/advertising-banner',
        permissions: [ALL_PERMISSION.VIEW_SYSTEM_CONFIGURATIONS.childrens.VIEW_SYSTEM_BANNER.value],
      },
      {
        id: 'api_key',
        title: 'api_key',
        icon: <Circle size={12} />,
        navLink: '/pages/api-key',
        permissions: [ALL_PERMISSION.VIEW_SYSTEM_CONFIGURATIONS.childrens.VIEW_SYSTEM_APIKEY.value],
      },
      {
        id: 'schedule_day_off',
        title: 'schedule_day_off',
        icon: <Circle size={12} />,
        navLink: '/pages/schedule-day-off',
        permissions: [ALL_PERMISSION.VIEW_SYSTEM_CONFIGURATIONS.childrens.VIEW_SYSTEM_DAYOFF.value],
      },
      {
        id: 'expand',
        title: 'expand',
        icon: <Circle size={12} />,
        navLink: '/pages/expand-setting',
        permissions: [ALL_PERMISSION.VIEW_SYSTEM_CONFIGURATIONS.childrens.VIEW_SYSTEM_EXTEND.value],
      },
      {
        id: 'automation',
        title: 'automation',
        icon: <Circle size={12} />,
        navLink: '/pages/automation',
        permissions: [ALL_PERMISSION.VIEW_SYSTEM_CONFIGURATIONS.childrens.VIEW_SYSTEM_AUTOMATION.value],
      },
      // {
      //   id: 'smsCSKH',
      //   title: 'smsCSKH',
      //   icon: <Circle size={12} />,
      //   permissions: [],
      //   navLink: '/pages/smsCSKH'
      // },
    ]
  },
  {
    id: 'automatic',
    title: 'automation',
    icon: <Settings size={12} />,
    permissions: [ALL_PERMISSION.VIEW_AUTOMATION.value],
    children: [
      {
        id: 'automatic_takecare_customer',
        title: 'automatic_takecare_customer',
        icon: <Circle size={12} />,
        navLink: '/pages/automatic-takecare-customer',
        permissions: [ALL_PERMISSION.VIEW_AUTOMATION.childrens.VIEW_AUTOMATION_CUSTOMER.value],
      },
    ]
  },
  // {
  //   id: 'advanced',
  //   title: 'Nâng cao',
  //   icon: <Sliders size={12} />,
  //   permissions: [],
  //   children: [
  //     {
  //       id: 'entry',
  //       title: 'Mã hóa & Giải mã',
  //       icon: <Tool size={12} />,
  //       navLink: '/pages/advanced/entry',
  //       permissions: [],
  //     },
  //   ]
  // }
  // {
]

export default App
