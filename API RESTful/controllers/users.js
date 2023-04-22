const { matchedData } = require("express-validator");
const { usersModel } = require("../models");
const { handleError } = require("../utils/handleError");
const { encrypt, compare } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJwt");
// TODO(?) get User individualmente by Id

//   CREACION/REGISTRAR usuario via POST
const createUser = async (req, res) => {
  //const body = req.body; // { body } = req --> es lo mismo
  req = matchedData(req); //coge los datos que se quieren y no tiene en cuenta el resto de cosas
  const password = await encrypt(req.password);
  const body = { ...req, password };
  try {
    const dataUser = await usersModel.create(body);
    dataUser.set("password", undefined, { strict: false }); //para que no devuelva la contraseña en el json, ademas de select:false en el modelo

    const data = {
      token: await tokenSign(dataUser),
      user: dataUser,
    };

    res.send({ data });
  } catch (error) {
    handleError(res, "ERROR_CREATE_USER");
  }
};

//   LOGIN usuario via POST
const loginUser = async (req, res) => {
  req = matchedData(req);
  const { email, password } = req;
  try {
    const user = await usersModel
      .findOne({ email })
      .select("password name role email"); //aplicar filtro para que si devuelva password que sino pusimos que no se devolviera

    if (!user) {
      return handleError(res, "LOGIN_FAILED_INVALID_CRED", 401);
    }

    const isMatch = await compare(password, user.password); //param (contrasenia sin hash, contrasenia hash)

    if (!isMatch) {
      return handleError(res, "LOGIN_FAILED_INVALID_CRED", 401);
    }

    user.set("password", undefined, { strict: false }); //elimina el campo password del objeto user antes de enviarlo como respuesta

    const data = {
      token: await tokenSign(user),
      user,
    };

    res.send({ data });
  } catch (error) {
    console.log(error);
    handleError(res, "ERROR_LOGIN_USER");
  }
};

//   BUSCAR usuarios por ciudad via GET
const getUsersByCity = async (req, res) => {
  const { city } = req.params; //parametros URL
  try {
    const users = await usersModel.find({ city, allowOffers: true });
    res.send({ users });
  } catch (error) {
    handleError(res, "ERROR_GET_USERS_CITY");
  }
};

//   ACTUALIZAR usuario via PUT // TODO que solo el propio user pueda actualizar su user y no el de cualquier otro
const updateUser = async (req, res) => {
  try {
    //primero valido que el usuario que se esta solicitando actualizar es el mismo que ha hecho la solicitud gracias a la inyeccion de datos de usuario en el middleware session.js
    const { id } = req.params;
    const { user } = req;
    if (id.toString() !== user._id.toString()) {
      handleError(res, "ERROR_NOT_YOUR_USER");
      return;
    }
    //console.log(req.body);
    updatedUser = req.body;
    //const updatedUser = matchedData(req.body);
    //console.log(updatedUser);

    if (updatedUser.password) {
      updatedUser.password = await encrypt(updatedUser.password);
    }
    const data = await usersModel.findByIdAndUpdate(id, updatedUser, {
      new: true, //esto es para que el metodo devuelva el usuario actualizado
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    handleError(res, "ERROR_UPDATE_USER");
  }
};

//   BORRAR usuario via DELETE // TODO que solo el propio user pueda borrar su user y no el de cualquier otro
const deleteUser = async (req, res) => {
  try {
    //primero valido que el usuario que se esta solicitando actualizar es el mismo que ha hecho la solicitud gracias a la inyeccion de datos de usuario en el middleware session.js
    const { id } = req.params;
    const { user } = req;
    if (id.toString() !== user._id.toString()) {
      handleError(res, "ERROR_NOT_YOUR_USER");
      return;
    }
    const data = await usersModel.findByIdAndDelete(id);
    res.send(data);
  } catch (err) {
    handleError(res, "ERROR_DELETE_USER");
  }
};

module.exports = {
  //getUser,
  getUsersByCity,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
