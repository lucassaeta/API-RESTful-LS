const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

//    firmar/generar token
const tokenSign = (user) => {
  const sign = jwt.sign(
    {
      _id: user._id, //payload para verificar que usuario es quien dice ser
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: "2h",
    }
  );
  return sign;
};
//    firmar/generar token
const tokenSign2 = (merchant) => {
  const sign = jwt.sign(
    {
      _id: merchant._id, //payload para verificar que merchant es quien dice ser
      pageId: merchant.pageId,
    },
    JWT_SECRET,
    {
      expiresIn: "72h",
    }
  );
  return sign;
};
//    verificar token
const verifyToken = (tokenJwt) => {
  try {
    return jwt.verify(tokenJwt, JWT_SECRET);
  } catch (err) {
    handleError(res, "JWT_TOKEN_NOT_AUTHORIZED");
  }
};
module.exports = { tokenSign, tokenSign2, verifyToken };
