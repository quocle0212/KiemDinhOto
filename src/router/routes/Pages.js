import { lazy } from 'react'
// import { Redirect } from 'react-router-dom'

const PagesRoutes = [
  {
    path: '/login',
    component: lazy(() => import('../../views/pages/authentication/Login')),
    layout: 'BlankLayout',
    meta: {
      authRoute: true
    }
  },
  {
    path: '/pages/station',
    component: lazy(() => import('../../views/pages/station/index'))
  },
  {
    path: '/pages/edit-integrated/:id',
    component: lazy(() => import('../../views/pages/Integrated/IntegratedEdit'))
  },
  {
    path: '/pages/integrated',
    component: lazy(() => import('../../views/pages/Integrated/index'))
  },
  {
    path: '/pages/order',
    component: lazy(() => import('../../views/pages/order/index'))
  },
  {
    path: '/pages/order-setting',
    component: lazy(() => import('../../views/pages/orderSetting/index'))
  },
  {
    path: '/pages/detail-order/:id',
    // component: lazy(() => import('../../views/pages/order/detail'))
    component: lazy(() => import('../../views/pages/order/orderDetail'))
  },
  {
    path: '/pages/motorbikeInsurance',
    component: lazy(() => import('../../views/pages/motorbike-insurance/index'))
  },
  {
    path: '/pages/detail-motorbikeInsurance/:id',
    component: lazy(() => import('../../views/pages/motorbike-insurance/detail'))
  },
  {
    path: '/pages/detail-motorbikeInsuranceOrder',
    component: lazy(() => import('../../views/pages/motorbikeInsuranceOrder/index'))
  },
  {
    path: '/pages/detail-autoNotifyViolation',
    component: lazy(() => import('../../views/pages/order/detailAutoNotifyViolation'))
  },
  {
    path: '/pages/otoInsurance',
    component: lazy(() => import('../../views/pages/oto-insurance/index'))
  },
  {
    path: '/pages/detail-otoInsurance/:id',
    component: lazy(() => import('../../views/pages/oto-insurance/detail'))
  },
  {
    path: '/pages/punishsms',
    component: lazy(() => import('../../views/pages/punishSMS/index'))
  },
  {
    path: '/pages/detail-punishsms/:id',
    component: lazy(() => import('../../views/pages/punishSMS/detail'))
  },
  {
    path: '/overview/center',
    component: lazy(() => import('../../views/pages/overviewCenter/index'))
  },
  {
    path: '/overview/schedule',
    component: lazy(() => import('../../views/pages/overviewSchedule/index'))
  },
  {
    path: '/overview/actived',
    component: lazy(() => import('../../views/pages/overviewActived/index'))
  },
  {
    path: '/pages/smsCSKH',
    component: lazy(() => import('../../views/pages/smsCSKH/index'))
  },
  {
    path: '/pages/detail-integrated/:id',
    component: lazy(() => import('../../views/pages/Integrated/Detail'))
  },
  {

    path: '/pages/news',
    component: lazy(() => import('../../views/pages/news/index'))
  },
  {

    path: '/pages/chat',
    component: lazy(() => import('../../views/apps/chat/index'))
  },
  {
    path: '/pages/form-station',
    component: lazy(() => import('../../views/pages/station/formStation'))
  },
  {
    path: '/pages/form-SMS',
    component: lazy(() => import('../../views/pages/station/formSMS'))
  },
  {
    path: '/pages/form-ZNS',
    component: lazy(() => import('../../views/pages/station/formZNS'))
  },
  {
    path: '/pages/form-email',
    component: lazy(() => import('../../views/pages/station/formEmail'))
  },
  {
    path: '/pages/form-vnpay',
    component: lazy(() => import('../../views/pages/station/formVNPay'))
  },
  {
    path: '/pages/users',
    component: lazy(() => import('../../views/pages/user/index'))
  },
  {
    path: '/pages/vehicle',
    component: lazy(() => import('../../views/pages/vehicle/index'))
  },
  {
    path: '/pages/documentary',
    component: lazy(() => import('../../views/pages/documentary/index'))
  },
  {
    path: '/pages/documentaryFromStation',
    component: lazy(() => import('../../views/pages/station/Document'))
  },
  {
    path: '/pages/technicians',
    component: lazy(() => import('../../views/pages/technicians/index'))
  },
  {
    path: '/pages/center-staff',
    component: lazy(() => import('../../views/pages/CenterStaff/index'))
  },
  {
    path: '/pages/report',
    component: lazy(() => import('../../views/pages/report/index'))
  },
  {
    path: '/pages/detail',
    component: lazy(() => import('../../views/pages/report/DetailedReport/index'))
  },
  {
    path: '/documentary/form-documentary',
    component: lazy(() => import('../../views/pages/documentary/formDocumentary'))
  },
  {
    path: '/documentary/form-file/:type/:id',
    component: lazy(() => import('../../views/pages/documentary/formFile'))
  },
  {
    path: '/notification/form-notification',
    component: lazy(() => import('../../views/pages/notification/formNotification'))
  },
  {
    path: '/notification/add-notification',
    component: lazy(() => import('../../views/pages/notification/addNotification'))
  },
  {
    path: '/documentary/add-documentary',
    component: lazy(() => import('../../views/pages/documentary/addDocumentary'))
  },
  {
    path: '/documentary/add-documentfile',
    component: lazy(() => import('../../views/pages/documentary/addDocumentFile'))
  },
  {
    path: '/pages/account-admin',
    component: lazy(() => import('../../views/pages/account-admin/index'))
  },
  {
    path: '/pages/notification',
    component: lazy(() => import('../../views/pages/notification/index'))
  },
  {
    path: '/pages/devices',
    component: lazy(() => import('../../views/pages/device/index'))
  },
  {
    path: '/pages/advertising',
    component: lazy(() => import('../../views/pages/advertising/index'))
  },
  {
    path: '/user/change-password',
    component: lazy(() => import('../../views/pages/change-password/index'))
  },
  {
    path: '/user/list',
    component: lazy(() => import('../../views/pages/change-password/index'))
  },
  {
    path: '/user/form-user',
    component: lazy(() => import('../../views/pages/user/formUser'))
  },
  {
    path: '/user/form-technicians',
    component: lazy(() => import('../../views/pages/technicians/formTechnician'))
  },
  {
    path: '/users/form-center',
    component: lazy(() => import('../../views/pages/CenterStaff/formCenter'))
  },
  {
    path: '/misc/not-authorized',
    component: lazy(() => import('../../views/pages/misc/NotAuthorized')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/misc/maintenance',
    component: lazy(() => import('../../views/pages/misc/Maintenance')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/misc/error',
    component: lazy(() => import('../../views/pages/misc/Error')),
    layout: 'BlankLayout',
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/pages/role/add',
    component: lazy(() => import('../../views/pages/role/add')),
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/pages/role/edit',
    component: lazy(() => import('../../views/pages/role/edit')),
    meta: {
      publicRoute: true
    }
  },
  {
    path: '/pages/form-device',
    component: lazy(() => import('../../views/pages/station/formDevice'))
  },
  {
    path: '/pages/add-device',
    component: lazy(() => import('../../views/pages/station/addDevice'))
  },
  {
    path: '/pages/schedule',
    component: lazy(() => import('../../views/pages/schedule/index'))
  },
  {
    path: '/pages/edit-schedule',
    component: lazy(() => import('../../views/pages/schedule/formSchedule'))
  },
  {
    path: '/pages/edit-vehicle',
    component: lazy(() => import('../../views/pages/vehicle/formVehicle'))
  },
  {
    path: '/pages/methods-pay',
    component: lazy(() => import('../../views/pages/pay/index'))
  },
  {
    path: '/pages/edit-pay',
    component: lazy(() => import('../../views/pages/pay/EditPay'))
  },
  {
    path: '/pages/schedule-pay',
    component: lazy(() => import('../../views/pages/schedule-pay/index'))
  },
  {
    path: '/pages/bill-pay',
    component: lazy(() => import('../../views/pages/bill-pay/index'))
  },
  {
    path: '/pages/file',
    component: lazy(() => import('../../views/pages/File/index'))
  },
  {
    path: '/pages/add-file',
    component: lazy(() => import('../../views/pages/File/addFile'))
  },
  {
    path: '/pages/edit-file',
    component: lazy(() => import('../../views/pages/File/editFile'))
  },
  {
    path: '/pages/setting',
    component: lazy(() => import('../../views/pages/setting'))
  },
  {
    path: '/pages/advertising-banner',
    component: lazy(() => import('../../views/pages/setting/advertising-banner'))
  },
  {
    path: '/pages/edit-banner',
    component: lazy(() => import('../../views/pages/setting/editBanner'))
  },
  {
    path: '/pages/edit-homepageconfig',
    component: lazy(() => import('../../views/pages/setting/editHomepageConfig'))
  },
  {
    path: '/pages/update-banner',
    component: lazy(() => import('../../views/pages/setting/updateBanner'))
  },
  {
    path: '/pages/api-key',
    component: lazy(() => import('../../views/pages/ApiKey/index'))
  },
  {
    path: '/pages/schedule-system',
    component: lazy(() => import('../../views/pages/SystemSchedule/index'))
  },
  {
    path: '/pages/automation',
    component: lazy(() => import('../../views/pages/automation/index'))
  },
  {
    path: '/pages/schedule-day-off',
    component: lazy(() => import('../../views/pages/schedule-day-off'))
  },
  {
    path: '/pages/expand-setting',
    component: lazy(() => import('../../views/pages/expand-setting'))
  },
  {
    path: '/pages/third-party-setting/:partyCode/:id',
    component: lazy(() => import('../../views/pages/expand-setting/detail'))
  },
  {
    path: '/pages/warning',
    component: lazy(() => import('../../views/pages/Warning/index'))
  },
  {
    path: '/pages/consultation_form/:id',
    component: lazy(() => import('../../views/pages/consultetion/index'))
  },
  {
    path: '/pages/edit-consultation_form',
    component: lazy(() => import('../../views/pages/consultetion/FormConsultetion'))
  },
  {
    path: '/pages/registration_deadline',
    component: lazy(() => import('../../views/pages/checkRegistration'))
  },
  {
    path: '/pages/automatic-takecare-customer',
    component: lazy(() => import('../../views/pages/automation-customers'))
  },
  {
    path: '/pages/create-automatic-takecare-customer',
    component: lazy(() => import('../../views/pages/automation-customers/create'))
  },
  {
    path: '/pages/edit-automatic-takecare-customer',
    component: lazy(() => import('../../views/pages/automation-customers/edit'))
  },
  {
    path: '/pages/camera',
    component: lazy(() => import('../../views/pages/camera/index'))
  },
  {
    path: '/pages/detail-camera/:id',
    component: lazy(() => import('../../views/pages/camera/detail'))
  }
]

export default PagesRoutes
