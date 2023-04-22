const { check, param } = require("express-validator");
const validateResults = require("../utils/handleValidator");

const validatorCreateMerchant = [
  check("name").exists().notEmpty(),
  check("cif").exists().notEmpty().isInt(),
  check("address").exists().notEmpty(),
  check("email").exists().notEmpty().isEmail(),
  check("password").exists().notEmpty().isLength({ min: 8 }),
  check("contact").exists().notEmpty().isInt(),
  (req, res, next) => {
    validateResults(req, res, next);
  },
];

const validatorLoginMerchant = [
  check("email").exists().notEmpty().isEmail(),
  check("password").exists().notEmpty().isLength({ min: 8 }),

  (req, res, next) => {
    validateResults(req, res, next);
  },
];

module.exports = {
  validatorCreateMerchant,
  validatorLoginMerchant,
};
