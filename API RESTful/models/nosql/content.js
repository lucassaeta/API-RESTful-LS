//Para la creacion/subir contenido

const mongoose = require("mongoose");

// TODO(?) campo para guardar ID de la pagina donde esta
// TODO(?) fotos y texto guarda URL y nombrefichero ya que son archivos extra (como en el storage schema)
// TODO(?) campos no editables se guarda en uno que almacena los 3?
const ContentScheme = new mongoose.Schema(
  {
    webpageId: {
      //ID identificador paginaweb en la que esta subido
      type: String,
      unique: true,
    },
    city: {
      type: String,
    },
    activity: {
      type: String,
    },
    title: {
      type: String,
    },
    summary: {
      type: String,
    },
    texts: [
      {
        type: String,
      },
    ],
    photos: {
      //ARRAY FOTOS (solo link a ellas ) PARA HACER PUSH
      url: {
        type: String, //link a la foto http://localhost:3000/storage/foto-dfjheiobl
      },
      filename: {
        type: String, //foto-y3t47t73g
      },
    },
    nonEditable: {
      scoring: [
        {
          type: Number,
        },
      ],
      numScores: {
        type: Number,
      },
      reviews: [
        {
          type: String,
        },
      ],
    },
  },
  {
    timestamp: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("contents", ContentScheme);
