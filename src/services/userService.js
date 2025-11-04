import Request from "./request";

export default class UserService {
  static async getUser(params = {}) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "AppUsers/find",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async getMetaData(params = {}) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "SystemConfigurations/getMetaData",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(result);
        } else {
          reject(result);
        }
      }).catch(error => {
        reject(error);
      });
    });
  }
  
  static async findDetailUserById(id) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "AppUsers/findById",
        data: {
          id: id,
        },
      }).then((result = {}) => {
        const { statusCode, data, message } = result;
        if (statusCode === 200) {
          return resolve(result);
        } else {
          return reject(message);
        }
      });
    });
  }

  static async updateUserById(data) {
    return new Promise((resolve) => {
      Request.send({
        method: "POST",
        path: "AppUsers/updateUserById",
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

  static async getListCount(data) {
    return new Promise((resolve) => {
      Request.send({
        method: "POST",
        path: "AppUsers/count",
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

  static async verifyInfoUser(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "/AppUsers/verifyInfoUser",
        data: params,
      }).then((result) => {
        const { statusCode, error } = result;
        if (statusCode === 200) {
          return resolve();
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async rejectInfoUser(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "AppUsers/rejectInfoUser",
        data: params,
      }).then((result) => {
        const { statusCode, error } = result;
        if (statusCode === 200) {
          return resolve();
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async uploadAvatar(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "AppUsers/uploadAvatar",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          return resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async exportExcel(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "AppUsers/exportExcel",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async adminChangePasswordUser(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "AppUsers/adminChangePasswordUser",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async adminChangeSecondaryPasswordUser(params) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "AppUsers/adminChangeSecondaryPasswordUser",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async findAllUsersFollowingReferId(params = {}) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "AppUsers/findAllUsersFollowingReferId",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  static async getListReferralByUserId(params = {}) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: "POST",
        path: "PaymentServicePackage/admin/getListReferralByUserId",
        data: params,
      }).then((result) => {
        const { statusCode, data, error } = result;
        if (statusCode === 200) {
          resolve(data);
        } else {
          reject(new Error(error));
        }
      }).catch(error => {
        reject(error);
      });
    });
  }
  static async getListUser(data, newToken) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'AppUsers/getListUser',
            data: data,
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
   static async getListUserReport(data, newToken) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'AppUsers/reportAppUser',
            data: data,
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
   static async getListRole() {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'AppUserRole/find',
            data: {},
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
   static async getDetailUserById(data) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'AppUsers/getDetailUserById',
            data: data,
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
   static async ResetPasswordUser(data) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'AppUsers/staffChangePasswordUser',
            data: data,
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
   static async handleWorkInfo(data) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'AppUserWorkInfo/findById',
            data: data,
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
   static async handleWorkInfoUpdate(data) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'AppUserWorkInfo/updateById',
            data: data,
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
   static async getListStationUser(data, newToken) {
    return new Promise(resolve => {
        Request.send({
            method: 'POST',
            path: 'AppUsers/getListStationUser',
            data: data,
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
}
