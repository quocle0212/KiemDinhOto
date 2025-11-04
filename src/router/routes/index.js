// ** Routes Imports
 import AppRoutes from './Apps'
// import FormRoutes from './Forms'
import PagesRoutes from './Pages'
// import TablesRoutes from './Tables'
// import ChartMapsRoutes from './ChartsMaps'
import DashboardRoutes from './Dashboards'
// import UiElementRoutes from './UiElements'
// import ExtensionsRoutes from './Extensions'
// import PageLayoutsRoutes from './PageLayouts'
import AdvancedRoutes from './Advanced'
import App from '../../navigation/vertical/pages'
import addKeyLocalStorage, { APP_USER_DATA_KEY } from '../../helper/localStorage'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { toast } from 'react-toastify'
import { set } from 'lodash'
import { getAllPermissionFormatArray, getAllPermissionFormatString } from '../../constants/permission'

function collectAllPermissions(routes) {
  const result = [];

  const recurse = (item) => {
    if (Array.isArray(item.permissions)) {
      result.push(...item.permissions);
    }

    if (Array.isArray(item.children)) {
      item.children.forEach(recurse);
    }
  };

  routes.forEach(recurse);
  return result;
}

function checkInvalidPermissions(routes, validPermissions) {
  const allPermissions = collectAllPermissions(routes);
  const invalid = allPermissions.filter(p => !validPermissions.includes(p));
  const result = [...new Set(invalid)]
  if (result.length > 0) {
    result.forEach(perm => {
      toast.error(`Vui lòng cập nhật quyền ${perm} vào ALL_PERMISSIONS trong file permission.js`);
    })
  }
  return [...new Set(invalid)]; // lọc trùng nếu có
}

// ** Document title
const TemplateTitle = '%s - Vuexy React Admin Template'

// ** Default Route
const userData = JSON.parse(localStorage.getItem(APP_USER_DATA_KEY))
const listPermissionUser = userData?.permissions?.replaceAll(' ', '')?.split(',')
const listRouteFull = []

checkInvalidPermissions(App, getAllPermissionFormatString())

App.forEach((item) => {
  if (item?.children?.length > 0) {
    item?.children?.forEach((item2) => listRouteFull.push(item2))
  } else {
    listRouteFull.push(item)
  }
})

const linkDefault = listRouteFull?.find((item) => item?.permissions?.find((item2) => listPermissionUser?.includes(item2 || '')))

const DefaultRoute = linkDefault?.navLink

if (!DefaultRoute) {
  const userData = JSON.parse(localStorage.getItem(APP_USER_DATA_KEY || `{}`))
  if (userData?.token) {
    toast.error("Chưa có quyền truy cập")
    setTimeout(() => {
      localStorage.removeItem(APP_USER_DATA_KEY)
      localStorage.removeItem(addKeyLocalStorage('accessToken'))
      localStorage.removeItem(addKeyLocalStorage('refreshToken'))
      window.location.href = `/login`
    }, 1000)
  }
}

// ** Merge Routes
const Routes = [
  ...DashboardRoutes,
  ...AppRoutes,
  ...PagesRoutes,
  ...AdvancedRoutes,
  // ...UiElementRoutes,
  // ...ExtensionsRoutes,
  // ...PageLayoutsRoutes,
  // ...FormRoutes,
  // ...TablesRoutes,
  // ...ChartMapsRoutes
]

export { DefaultRoute, TemplateTitle, Routes }
