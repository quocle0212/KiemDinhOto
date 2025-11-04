import Request from "./request";

export default class CenterService {
    static async getList(data, newToken) {
        return new Promise(resolve => {
            Request.send({
                method: 'POST',
                path: 'AppUsers/getListStationUser',
                data: { ...data },
                query: null,
                headers: {
                    Authorization: `Bearer ` + newToken,
                },
            }).then((result = {}) => {
                const { statusCode, data } = result
                if (statusCode === 200) {
                    return resolve(result)
                } else {
                    return resolve(null)
                }
            })
        })
    }
    static async getListStaff(data) {
        return new Promise(resolve=>{
          Request.send({
            method: 'POST',
            path: 'AppUsers/getListStationStaff',
            data
          }).then((result = {})=>{
            const { statusCode } = result
            if(statusCode === 200) {
              return resolve(result)
            }else{
              return resolve(null)
            }
          })
        })
      }
}