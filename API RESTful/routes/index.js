const express = require("express");
const fs = require("fs");
const router = express.Router();

const removeExtension = (fileName) => {
  //split separa users.js -> [users, js] y para quedarme con el primero utilizo shift
  return fileName.split(".").shift();
};

//devuelve array con los archivos que se encuentran en el directorio local
fs.readdirSync(__dirname).filter((file) => {
  const name = removeExtension(file);

  //no me interesa el archivo index
  if (name !== "index") {
    router.use("/" + name, require("./" + name)); // http://localhost:3000/api/users por ej
  }
});

module.exports = router;
