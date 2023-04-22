const { handleError } = require("../utils/handleError");
const { verifyToken } = require("../utils/handleJwt");
const { usersModel, commerceModel } = require("../models");

//para users o admin
const authMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      handleError(res, "NO_TOKEN", 401); // no hay token
      return;
    }
    // Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
    const token = req.headers.authorization.split(" ").pop();
    //Del token, miramos en Payload (revisar verifyToken de utils/handleJwt)
    const dataToken = await verifyToken(token);
    if (!dataToken._id) {
      handleError(res, "ERROR_ID_TOKEN", 401); //no hay id
      return;
    }

    const user = await usersModel.findById(dataToken._id);
    req.user = user; //inyecto a la peticion el user para hacerle el next con esta info extra

    next(); //dejarle pasar
  } catch (err) {
    handleError(res, "NOT_SESSION", 401);
  }
};

//para merchants
const authMiddleware2 = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      handleError(res, "NO_TOKEN", 401); // no hay token
      return;
    }
    // Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
    const token = req.headers.authorization.split(" ").pop();
    //Del token, miramos en Payload (revisar verifyToken de utils/handleJwt)
    const dataToken = await verifyToken(token);
    if (!dataToken._id) {
      handleError(res, "ERROR_ID_TOKEN", 401); //no hay id
      return;
    }

    const merchant = await commerceModel.findById(dataToken._id);
    req.merchant = merchant; //inyecto a la peticion el merchant para hacerle el next con esta info extra

    next(); //dejarle pasar
  } catch (err) {
    handleError(res, "NOT_SESSION", 401);
  }
};

module.exports = { authMiddleware, authMiddleware2 };
