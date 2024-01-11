const bcrypt = require("bcrypt");
module.exports = class AppUtils {
  static generateFieldError(fieldName) {
    return {
      error: "Field Missing",
      message: `${fieldName} is missing`,
    };
  }

  static generateSuccess(type, message) {
    return {
      status: type,
      message: message,
    };
  }

  static generateError(type, message) {
    return {
      status: type,
      message: message,
    };
  }

  static checkError(obj, objClass) {
    if (!obj) {
      return AppUtils.generateMissingFieldError("Request Body");
    }

    console.log(obj);
    for (let keyName of Object.keys(objClass)) {
      if (!obj[objClass[keyName]]) {
        return AppUtils.generateMissingFieldError(objClass[keyName].toString());
      }
    }
    return null;
  }

  static async encryptPassword(user_password) {
    const saltround = 10;
    let result;
    await bcrypt
      .hash(user_password, saltround)
      .then((hash) => {
        result = hash;
      })
      .catch((err) => console.log(err));
    return result;
  }
};