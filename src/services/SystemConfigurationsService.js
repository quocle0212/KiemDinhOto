import Request from "./request";

export default class SystemConfigurationsService {
  static async getPublicSystemConfigurations(data, newToken) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'SystemConfigurations/user/getPublicSystemConfigurations',
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
          return resolve(result)
        }
      })
    })
  }
  static async updateById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: "POST",
        path: "SystemConfigurations/updateById",
        data: data,
        query: null,
      }).then((result = {}) => {
        let { statusCode } = result;
        if (statusCode === 200) {
          return resolve(result)
        } else {
          return resolve(result)
        }
      })
    });
  }
  static async handleUpload(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'Upload/uploadMediaFile',
        data: { ...data },
        query: null
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
  static async AddAdvertisingBanner(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'SystemPromoBanners/insert',
        data: { ...data },
        query: null,
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
  static async getAdvertisingBannerDetail(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'SystemPromoBanners/findById',
        data: { ...data },
        query: null,
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
  static async getAdvertisingBanner(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'SystemPromoBanners/find',
        data: { ...data },
        query: null,
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
  static async handleUpdateBanner(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'SystemPromoBanners/updateById',
        data: { ...data },
        query: null,
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
  static async handleDeleteBanner(data) {
    return new Promise((resolve) => {
      Request.send({
        method: 'POST',
        path: 'SystemPromoBanners/deleteById',
        data: { ...data },
        query: null,
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
  static async getSystemSetting(data, newToken) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'SystemSetting/find',
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
  static async handleUpdateSystemSetting(data) {
    return new Promise(resolve => {
      Request.send({
        method: 'POST',
        path: 'SystemSetting/updateById',
        data: { ...data },
        query: null,
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
}