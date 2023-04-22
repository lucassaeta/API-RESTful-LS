//Para creacion de Users y Admin

const mongoose = require("mongoose");
const UserScheme = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    age: {
      type: Number,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    city: {
      type: String,
    },
    interests: {
      type: String,
    },
    allowOffers: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: ["user", "admin"], // es como el enum de SQL
      default: "user",
    },
  },
  {
    timestamp: true, // createdAt, updatedAt
    versionKey: false,
  }
);
module.exports = mongoose.model("users", UserScheme); //exporta modelo de mongoose, la tabla de "users"
