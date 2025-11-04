/* eslint-disable import/no-anonymous-default-export */
// ** Navigation sections imports
import addKeyLocalStorage, { APP_USER_DATA_KEY } from '../../helper/localStorage'
import pages from './pages'

const user = JSON.parse(localStorage.getItem(APP_USER_DATA_KEY)) || {}
const allRouter = [...pages]
const userPermissions = user?.permissions?.split?.(',')
// const userPermissions = ['MANAGE_SERVICE_SCHEDULE']

const checkPermissions = (routes) => {
  const newRoutes = []
  routes.forEach((element) => {
    const { permissions } = element || {}
    if (element?.children?.length > 0) {
      element.children = checkPermissions(element.children)
      if (element.children.length > 0) {
        newRoutes.push(element)
      }
    } else {
      const canAccess = permissions?.find((i) => userPermissions.includes(i))
      if (!canAccess) return
      newRoutes.push(element)
    }
  })
  return newRoutes
}

const newRouter = Object.keys(user).length ? checkPermissions(allRouter) : []
// ** Merge & Export
export default newRouter
// export default allRouter
