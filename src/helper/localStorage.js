import Service from "../services/request";

if(!process.env.REACT_APP_PROJECT_NAME){
  console.log("No variable REACT_APP_PROJECT_NAME! file .env")
}

const PROJECT_NAME = process.env.REACT_APP_PROJECT_NAME || "TTDK_ADMIN";

const addKeyLocalStorage = (key) => {
  return PROJECT_NAME + "_" + key
}

export const APP_USER_DATA_KEY = addKeyLocalStorage("cachedUserData");

export const storeAllStationsDataToLocal =() =>{
    return  Service.send({
      method: 'POST', path: 'Stations/find', data: {
        filter: {},
        skip: 0,
        limit: 1000,
      },
       query: null
    }).then(res => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          localStorage.setItem("StorageDev_AllStations" , JSON.stringify(data.data))
        }
      } 
    })
}

export const readAllStationsDataFromLocal = () => {
  let _stationList = JSON.parse(localStorage.getItem("StorageDev_AllStations"));
  if (!_stationList) {
    _stationList = []
  }
  return _stationList;
}

export const storeAllArea = () =>{
 return Service.send({
    method: 'POST', path: 'Stations/getAllStationArea', data: {
      filter: {},
      skip: 0,
      limit: 100,
      order: {
        key: 'createdAt',
        value: 'desc'
      }
    },
     query: null
  }).then(res => {
    if (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        localStorage.setItem("StorageDev_AllArea" , JSON.stringify(data))
      }
    } 
  })
}

export const readAllArea = () =>{
  let _localAllArea = JSON.parse(localStorage.getItem("StorageDev_AllArea"))
  if (!_localAllArea) {
    _localAllArea = []
  }
  return _localAllArea
}

export const getAllArea = (optionAll) =>{
  const optionAllArea = optionAll ? [{ value: undefined, label: 'Tất cả khu vực' }] : []
  return [
    ...optionAllArea,
    ...(readAllArea() || []).map((item) => {
      return { value: item.value, label: item.value }
    })
  ]
}

export const ListUserActive = () => {
  return Service.send({
    method: "POST",
    path: "AppUsers/getListUser",
    data : {
      filter: {
        active: 1,
        appUserRoleId: 0,
        isVerifiedPhoneNumber : 1
    },
    skip: 0,
    limit: 1,
    order: {
      key: 'appUserId',
      value: 'desc'
    }},
    query: null,
  }).then((result) => {
    if (result) {
    const { statusCode, data } = result;
    if (statusCode === 200) {
      localStorage.setItem("StorageDev_TotalUserActive" , JSON.stringify(data.total))
    }}}
  )}

  export const readTotalUserActiveLocal = () => {
    return JSON.parse(localStorage.getItem("StorageDev_TotalUserActive"));
  }

export const listScheduleTotal = () =>{
   return Service.send({
    method: "POST",
    path: "CustomerSchedule/find",
    data : {
      filter: {
    },
    skip: 0,
    limit: 1,
    order: {
      key: 'customerScheduleId',
      value: 'desc'
    }},
    query: null,
  }).then((res) => {
    if (res) {
      const { statusCode, data } = res;
      if (statusCode === 200) {
        localStorage.setItem("StorageDev_TotalSchedule" , JSON.stringify(data.total))
      }
    }
  });
}

export const readTotalSchedule = () =>{
  return JSON.parse(localStorage.getItem("StorageDev_TotalSchedule"))
}

export const listVehicelTotal = () =>{
  return Service.send({
    method: "POST",
    path: "AppUserVehicle/find",
    data : {
      filter: {
    },
    skip: 0,
    limit: 1,
    order: {
      key: 'appUserVehicleId',
      value: 'desc'
    }},
    query: null,
  }).then((res) => {
    if (res) {
      const { statusCode, data } = res;
      if (statusCode === 200) {
        localStorage.setItem("StorageDev_TotalVehicle" , JSON.stringify(data.total))
      }
    }
  });
}

export const readTotalVehicle = () =>{
  return JSON.parse(localStorage.getItem("StorageDev_TotalVehicle"))
}

export const ListUser = () => {
  return Service.send({
    method: "POST",
    path: "AppUsers/getListUser",
    data : {
      filter: {
      active: 1,
      appUserRoleId: 0
    },
    skip: 0,
    limit: 1,
    order: {
      key: 'appUserId',
      value: 'desc'
    }},
    query: null,
  }).then((result) => {
    if (result) {
    const { statusCode, data } = result;
    if (statusCode === 200) {
      localStorage.setItem("StorageDev_TotalUser" , JSON.stringify(data.total))
    }}}
  )}

  export const readTotalUserLocal = () => {
    let _localTotalUser = JSON.parse(localStorage.getItem("StorageDev_TotalUser"));
    if (!_localTotalUser) {
      _localTotalUser = 0
    }
    return _localTotalUser
  }

  export const storeRoleListToLocal = () =>{
    return Service.send({
      method: "POST",
      path: "AppUserRole/find",
      data: {},
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          localStorage.setItem("StorageDev_Role" , JSON.stringify(data.data))
        }
      }
    });
  }

  export const readListRoleFromLocalstorage = () => {
    let _localRoleList = JSON.parse(localStorage.getItem("StorageDev_Role"));
    if (!_localRoleList) {
      _localRoleList = []
    }
    if (_localRoleList.length === 0) {
      storeRoleListToLocal();
    }
    return _localRoleList
  }

export default addKeyLocalStorage;