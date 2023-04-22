const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Practica Lucas Saeta - Express API with Swagger (OpenAPI 3.0)",
      version: "0.1.0",
      description:
        "This is a CRUD API application made with Express and documented with Swagger",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "u-tad",
        url: "https://u-tad.com",
        email: "lucas.saeta@live.u-tad.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
      schemas: {
        registerUser: {
          type: "object",
          required: [
            "name",
            "age",
            "email",
            "password",
            "city",
            "interests",
            "allowOffers",
          ],
          properties: {
            name: {
              type: "string",
              example: "Menganito",
            },
            age: {
              type: "integer",
              example: 20,
            },
            email: {
              type: "string",
              example: "miemail@google.com",
            },
            password: {
              type: "string",
            },
            city: {
              type: "string",
              example: "madrid",
            },
            interests: {
              type: "string",
              example: "futbol",
            },
            allowOffers: {
              type: "boolean",
              example: "true",
            },
          },
        },
        loginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "miemail@google.com",
            },
            password: {
              type: "string",
            },
          },
        },
        updateUser: {
          type: "object",
          required: [
            "name",
            "age",
            "email",
            "password",
            "city",
            "interests",
            "allowOffers",
          ],
          properties: {
            name: {
              type: "string",
              example: "Menganito",
            },
            age: {
              type: "integer",
              example: 20,
            },
            email: {
              type: "string",
              example: "miemail@google.com",
            },
            password: {
              type: "string",
            },
            city: {
              type: "string",
              example: "madrid",
            },
            interests: {
              type: "string",
              example: "futbol",
            },
            allowOffers: {
              type: "boolean",
              example: "true",
            },
          },
        },
        registerMerchant: {
          type: "object",
          required: ["name", "cif", "address", "email", "contact", "pageId"],
          properties: {
            name: {
              type: "string",
              example: "Menganito",
            },
            cif: {
              type: "integer",
              example: 20,
            },
            address: {
              type: "string",
              example: "calle tu vieja 12",
            },
            email: {
              type: "string",
              example: "hola@gmail.com",
            },
            contact: {
              type: "integer",
              example: "625547741",
            },
            pageId: {
              type: "string",
            },
          },
        },
        loginMerchant: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "miemail@google.com",
            },
            password: {
              type: "string",
            },
          },
        },
        updateMerchant: {
          type: "object",
          required: ["name", "cif", "address", "email", "contact", "pageId"],
          properties: {
            name: {
              type: "string",
              example: "Menganito",
            },
            cif: {
              type: "integer",
              example: 20,
            },
            address: {
              type: "string",
              example: "calle tu vieja 12",
            },
            email: {
              type: "string",
              example: "hola@gmail.com",
            },
            contact: {
              type: "integer",
              example: "625547741",
            },
            pageId: {
              type: "string",
            },
          },
        },
        uploadContent: {
          type: "object",
          required: ["webpageId", "city", "activity", "title", "summary"],
          properties: {
            webpageId: {
              type: "string",
            },
            city: {
              type: "string",
              example: "madrid",
            },
            activity: {
              type: "string",
              example: "futbol",
            },
            title: {
              type: "string",
              example: "partido de futbol",
            },
            summary: {
              type: "string",
              example: "partido de futbol con tu padre",
            },
          },
        },
        uploadPhoto: {
          type: "object",
          required: ["url", "filename"],
          properties: {
            url: {
              type: "string",
              example: "http://localhost:3000/storage/foto-12344332",
            },
          },
        },
        uploadText: {
          type: "object",
          required: ["texts"],
          properties: {
            texts: {
              type: "string",
              example: "textoasubir",
            },
          },
        },
        updateWebPage: {
          type: "object",
          required: ["webpageId", "city", "activity", "title", "summary"],
          properties: {
            webpageId: {
              type: "string",
            },
            city: {
              type: "string",
              example: "madrid",
            },
            activity: {
              type: "string",
              example: "futbol",
            },
            title: {
              type: "string",
              example: "partido de futbol",
            },
            summary: {
              type: "string",
              example: "partido de futbol con tu padre",
            },
          },
        },
        updateScoring: {
          type: "object",
          required: ["scoring", "numScores", "reviews"],
          properties: {
            scoring: {
              type: "integer",
              example: "9",
            },
            numScores: {
              type: "integer",
              example: "2",
            },
            reviews: {
              type: "string",
              example: "buen partido de futbol y comercio",
            },
          },
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
