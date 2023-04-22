//Archivo configuracion mongoDB (mongoose)

const mongoose = require("mongoose");
const dbConnect = () => {
  const db_uri = process.env.DB_URI;
  mongoose.set("strictQuery", false);
  mongoose.connect(
    db_uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err, res) => {
      if (!err) {
        console.log("** Conexion establecida con la base de datos MONGODB **");
      } else {
        console.err(
          "** No se ha podido establecer la conexión a la base de datos MONGODB **"
        );
      }
    }
  );
};
module.exports = dbConnect;
