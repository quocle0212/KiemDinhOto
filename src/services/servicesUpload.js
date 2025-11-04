import Request from "./request";

export default class servicesUpload {
  static async upload(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'Upload/uploadMediaFile',
        data: { ...data },
        query: null,
      }).then((result = {}) => {
        const { statusCode, data } = result
        if (statusCode === 200) {
          return resolve({ isSuccess : true , data})
        } else {
          return resolve({ isSuccess : false })
        }
      })
    })
  }
}   