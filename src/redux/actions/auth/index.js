import { getAllPermissionFormatString } from "../../../constants/permission"
import addKeyLocalStorage, { APP_USER_DATA_KEY, readListRoleFromLocalstorage, storeAllArea, storeAllStationsDataToLocal } from "../../../helper/localStorage"
// ** UseJWT import to get config
// import useJwt from '@src/auth/jwt/useJwt'

// const config = useJwt.jwtConfig

// ** Handle User Login
export const handleLogin = data => {
  return dispatch => {
    dispatch({
      type: 'LOGIN',
      data,
      config: {},
      accessToken: data.accessToken,
      refreshToken: data.refreshToken
    })
    if (data?.roleId === 1) { // 1 là ADMIN
      data.permissions = getAllPermissionFormatString()
    }
    // ** Add to user, accessToken & refreshToken to localStorage
    localStorage.setItem(APP_USER_DATA_KEY, JSON.stringify(data))
    localStorage.setItem(addKeyLocalStorage('accessToken'), JSON.stringify(data.accessToken))
    localStorage.setItem(addKeyLocalStorage('refreshToken'), JSON.stringify(data.refreshToken))
    storeAllStationsDataToLocal()
    storeAllArea()
    readListRoleFromLocalstorage()
  }
}

// ** Handle User Logout
export const handleLogout = () => {
  return dispatch => {
    dispatch({ type: 'LOGOUT', 'accessToken': null, 'refreshToken': null })

    // ** Remove user, accessToken & refreshToken from localStorage
    localStorage.removeItem(APP_USER_DATA_KEY)
    localStorage.removeItem(addKeyLocalStorage('accessToken'))
    localStorage.removeItem(addKeyLocalStorage('refreshToken'))
  }
}
