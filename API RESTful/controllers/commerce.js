const { matchedData } = require("express-validator");
const { commerceModel, contentModel } = require("../models");
const { handleError } = require("../utils/handleError");
const { v4: uuidv4 } = require("uuid");
const { tokenSign2 } = require("../utils/handleJwt");
const { encrypt, compare } = require("../utils/handlePassword");

// CREACION/REGISTRAR comercio via POST
const createMerchant = async (req, res) => {
  req = matchedData(req);
  const password = await encrypt(req.password);
  const body = { ...req, password };
  try {
    // generar un nuevo ID único para la página web del comercio recien registrado
    const pageId = uuidv4();

    // hacer copia de body a commerceData agregando el ID de página al cuerpo de la petición
    const commerceData = { ...body, pageId };

    const dataMerchant = await commerceModel.create(commerceData);
    dataMerchant.set("password", undefined, { strict: false }); //para que no devuelva la contraseña en el json, ademas de select:false en el modelo

    const data = {
      token: await tokenSign2(dataMerchant),
      merchant: dataMerchant,
    };
    res.send({ data });
  } catch (error) {
    handleError(res, "ERROR_CREATE_MERCHANT");
  }
};

//   LOGIN merchant via POST
const loginMerchant = async (req, res) => {
  req = matchedData(req);
  const { email, password } = req;
  try {
    const merchant = await commerceModel
      .findOne({ email })
      .select("password email pageId"); //aplicar filtro para que si devuelva password que sino pusimos que no se devolviera

    if (!merchant) {
      return handleError(res, "LOGIN_FAILED_INVALID_CRED", 401);
    }

    const isMatch = await compare(password, merchant.password); //param (contrasenia sin hash, contrasenia hash)

    if (!isMatch) {
      return handleError(res, "LOGIN_FAILED_INVALID_CRED", 401);
    }

    merchant.set("password", undefined, { strict: false }); //elimina el campo password del objeto merchant antes de enviarlo como respuesta

    const data = {
      token: await tokenSign2(merchant),
      merchant,
    };

    res.send({ data });
  } catch (error) {
    console.log(error);
    handleError(res, "ERROR_LOGIN_MERCHANT");
  }
};

//   BUSCAR comercios via GET
const getMerchants = async (req, res) => {
  try {
    const merchants = await commerceModel.find({});
    res.send({ merchants });
  } catch (error) {
    handleError(res, "ERROR_GET_MERCHANTS");
  }
};

//   BUSCAR comercio via GET
const getMerchant = async (req, res) => {
  try {
    const { id } = req.params;
    const merchant = await commerceModel.findById(id);
    if (!merchant) {
      return handleError(res, "MERCHANT_NOT_FOUND", 404);
    }
    res.send({ merchant });
  } catch (error) {
    handleError(res, "ERROR_GET_MERCHANT");
  }
};

//   ACTUALIZAR comercio via PUT
const updateMerchant = async (req, res) => {
  try {
    //primero valido que el usuario que se esta solicitando actualizar es el mismo que ha hecho la solicitud gracias a la inyeccion de datos de usuario en el middleware session.js
    const { id } = req.params;
    //const updatedMerchant = matchedData(req.body);
    const updatedMerchant = req.body;
    if (updatedMerchant.password) {
      updatedMerchant.password = await encrypt(updatedMerchant.password);
    }
    const data = await commerceModel.findByIdAndUpdate(id, updatedMerchant, {
      new: true, //esto es para que el metodo devuelva el comercio actualizado
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    handleError(res, "ERROR_UPDATE_MERCHANT");
  }
};

//   BORRAR comercio via DELETE
const deleteMerchant = async (req, res) => {
  try {
    //primero valido que el usuario que se esta solicitando actualizar es el mismo que ha hecho la solicitud gracias a la inyeccion de datos de usuario en el middleware session.js
    const { id } = req.params;
    const commerce = await commerceModel.findByIdAndDelete(id);
    const pageId = commerce.pageId;
    await contentModel.findOneAndDelete({ pageId: pageId });
    res.send(commerce);
  } catch (err) {
    console.log(err);
    handleError(res, "ERROR_DELETE_MERCHANT");
  }
};

module.exports = {
  getMerchant,
  getMerchants,
  createMerchant,
  updateMerchant,
  deleteMerchant,
  loginMerchant,
};
