const { verifyToken } = require("../utils/handleJwt");
const { handleError } = require("../utils/handleError");
const { usersModel } = require("../models");

//dos parametros, primero es array con roles permitidos
const checkRole = (roles) => async (req, res, next) => {
  try {
    const { user } = req; //pillo lo que inyecte en el authmiddleware (el objeto con la info del usuario)
    const rolesByUser = user.role; // roles de usuario ej: ["admin", "merchant"]

    //para asegurarse de que algun rol que se ha incluido en el parametro esta en el array de roles del usuario devuelve true o false
    const checkValueRole = roles.some((rolSingle) =>
      rolesByUser.includes(rolSingle)
    );

    if (!checkValueRole) {
      handleError(res, "ERROR_NOT_PERMISSION_REQUIRED");
      return;
    }

    next();
  } catch (error) {
    handleError(res, "ERROR_ROLE_PERMISSIONS");
  }
};
const checkMerchantId = async (req, res, next) => {
  try {
    const { merchant } = req; // Obtengo el objeto con la información del usuario inyectado por el middleware "authMiddleware"
    const merchantWebPage = merchant.pageId; // Obtengo el valor de "merchant.pageId"

    const pageId = req.params.id; // Obtengo el ID que se pasó en la ruta

    // Comparo el valor de "merchant.pageId" con el ID de la ruta
    if (merchantWebPage !== pageId) {
      handleError(res, "ERROR_PERMISSION_NOT_REQUIRED");
      return;
    }

    next();
  } catch (error) {
    handleError(res, "ERROR_ROLE_PERMISSIONS");
  }
};

module.exports = { checkRole, checkMerchantId };
