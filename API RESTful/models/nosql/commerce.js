//Para la creacion de comercios (== merchants)

const mongoose = require("mongoose");

// TODO  hay que darle un ID para su pagina una vez registrado el comercio
const CommerceScheme = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    cif: {
      type: Number,
      unique: true,
    },
    address: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    contact: {
      type: Number,
    },
    pageId: {
      type: String,
    },
  },
  {
    timestamp: true,
    versionKey: false,
  }
);
module.exports = mongoose.model("commerces", CommerceScheme);
