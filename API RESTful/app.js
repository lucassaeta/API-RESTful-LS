require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morganBody = require("morgan-body");
const swaggerUi = require("swagger-ui-express");

const loggerStream = require("./utils/handleLogger");
const dbConnect = require("./config/mongo");
const swaggerSpecs = require("./docs/swagger");

const app = express();

morganBody(app, {
  noColors: true, //limpiamos el String de datos lo máximo posible antes de mandarlo a Slack
  skip: function (req, res) {
    //Solo enviamos errores (4XX de cliente y 5XX de servidor)
    return res.statusCode < 400;
  },
  stream: loggerStream,
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
app.use(cors());
app.use(express.json());
app.use(express.static("storage"));

const PORT = process.env.PORT || 3000;

//Invocaciones rutas
// localhost:3000/api/......
app.use("/api", require("./routes/")); //invocamos index directamente donde se cargaran todas dinamicamente

app.listen(PORT, () => {
  console.log("Server corriendo en el puerto " + PORT + "...");
});

dbConnect();

module.exports = app;
