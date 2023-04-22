const { matchedData } = require("express-validator");
const { contentModel } = require("../models");
const { handleError } = require("../utils/handleError");
const PUBLIC_URL = process.env.PUBLIC_URL;

//   SUBIR contenido via POST
const uploadContent = async (req, res) => {
  const { id } = req.params;
  //para no tener que poner el webpage id en la solicitud json
  //sabemos que el id es correcto y es el del merchant que lo esta solicitando
  // porque ha pasado los checks
  const body = { webpageId: id, ...matchedData(req) };

  try {
    const existingContent = await contentModel.findOne({ webpageId: id });
    if (existingContent) {
      return handleError(res, "WEBPAGE_ALREADY_EXISTS", 409);
    }
    const webpage = await contentModel.create(body);
    if (!webpage) {
      return handleError(res, "WEBPAGE_NOT_FOUND", 404);
    }
    res.send({ webpage });
  } catch (error) {
    handleError(res, "ERROR_UPLOAD_CONTENT");
  }
};

//   BUSCAR pagina web via GET
const getWebPage = async (req, res) => {
  try {
    const { id } = req.params;
    const webpage = await contentModel.findOne({ webpageId: id }); //busca por webpageId
    if (!webpage) {
      return handleError(res, "WEBPAGE_NOT_FOUND", 404);
    }
    res.send({ webpage });
  } catch (error) {
    handleError(res, "ERROR_GET_WEBPAGE");
  }
};

//   BUSCAR paginas web via GET
const getWebPages = async (req, res) => {
  try {
    const contents = await contentModel.find({});
    res.send({ contents });
  } catch (error) {
    handleError(res, "ERROR_GET_WEBPAGES");
  }
};

//   BUSCAR paginas web por ciudad via GET
//Array.reduce() es un método de JavaScript que se utiliza para reducir un array a un solo valor sumando cada elemento a un acumulador.
///* reducer method that takes in the accumulator and next item */
// const reducer = (accumulator, item) => {
//   return accumulator + item;
// };
/* we give the reduce method our reducer function
  and our initial value */
// const total = numbers.reduce(reducer, initialValue)
const getWebPagesByCity = async (req, res) => {
  const { city, sort } = req.params; //parametros URL
  try {
    let webpages = await contentModel.find({ city });
    if (sort) {
      webpages.sort((a, b) => {
        // Primero, comparamos si ambas páginas tienen puntajes de calificación
        if (
          a.nonEditable.scoring.length > 0 &&
          b.nonEditable.scoring.length > 0
        ) {
          // Si ambas páginas tienen puntajes, las ordenamos por el promedio de puntajes de forma descendente
          return (
            b.nonEditable.scoring.reduce((acc, score) => acc + score, 0) / //reduce hace la suma de todos los elementos
              b.nonEditable.scoring.length - //y luego se divide por el length para hacer la media
            a.nonEditable.scoring.reduce((acc, score) => acc + score, 0) /
              a.nonEditable.scoring.length
          );
        } else if (
          a.nonEditable.scoring.length === 0 &&
          b.nonEditable.scoring.length === 0
        ) {
          // Si ambas páginas no tienen puntajes, las ordenamos alfabéticamente por título de forma ascendente
          return a.title.localeCompare(b.title);
        } else {
          // Si solo una página tiene puntajes, esa se ordena primero
          //Si la longitud del array de puntajes de la página b es mayor que la longitud del array de puntajes de la página a, entonces la página b tiene puntajes y la página a no los tiene. Por lo tanto, la página b se coloca primero.
          return b.nonEditable.scoring.length - a.nonEditable.scoring.length;
        }
      });
    }
    res.send({ webpages });
  } catch (error) {
    handleError(res, "ERROR_GET_WEBPAGES_CITY");
  }
};

//   BUSCAR paginas web por actividad via GET
const getWebPagesByActivity = async (req, res) => {
  const { activity, sort } = req.params; //parametros URL
  try {
    let webpages = await contentModel.find({ activity });
    if (sort) {
      webpages = webpages.sort((a, b) => {
        return b.nonEditable.scoring - a.nonEditable.scoring;
      });
    }
    res.send({ webpages });
  } catch (error) {
    handleError(res, "ERROR_GET_WEBPAGES_ACTIVITY");
  }
};

//   BUSCAR paginas web por ciudad y actividad via GET
const getWebPagesByCityAndActivity = async (req, res) => {
  const { city, activity, sort } = req.params;
  try {
    let webpages = await contentModel.find({ city, activity });

    if (sort) {
      webpages = webpages.sort((a, b) => {
        return b.nonEditable.scoring - a.nonEditable.scoring;
      });
    }

    res.send({ webpages });
  } catch (error) {
    handleError(res, "ERROR_GET_WEBPAGES_CITY_ACTIVITY");
  }
};

//   ACTUALIZAR pagina web via PUT (normalmente para añadir url/localizacion imagen y su file name o texto)
const updateWebPage = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedWebPage = req.body;
    //para no tener que poner el webpage id en la solicitud json
    //sabemos que el id es correcto y es el del merchant que lo esta solicitando
    // porque ha pasado los checks
    const body = { webpageId: id, ...updatedWebPage };
    const data = await contentModel.findOneAndUpdate({ webpageId: id }, body, {
      new: true,
    });
    res.send(data);
  } catch (err) {
    console.log(err);
    handleError(res, "ERROR_UPDATE_WEBPAGE");
  }
};

//    ACTUALIZAR noneditable scoring via PATCH
const updateScoring = async (req, res) => {
  const { id } = req.params;
  // const { scoring, reviews } = matchedData(req.body);
  const { scoring, reviews } = req.body.nonEditable;
  try {
    const content = await contentModel.findOneAndUpdate(
      { webpageId: id },
      {
        $push: {
          //para añadir a lo ya existente
          "nonEditable.scoring": scoring,
          "nonEditable.reviews": reviews,
        },
        $inc: {
          //para cambiar el numscore
          "nonEditable.numScores": 1,
        },
      },
      { new: true }
    );
    res.send(content);
  } catch (error) {
    handleError(res, "ERROR_UPDATE_CONTENT");
  }
};

//    SUBIR y ACTUALIZAR cuando se sube foto via POST
const uploadPhoto = async (req, res) => {
  try {
    const { file } = req; //info del file subido
    const { id } = req.params; // Obtener el ID de la página de la solicitud HTTP
    const webpageId = id;
    // Crear un objeto que contiene los datos de la foto que se va a agregar
    const newPhoto = {
      url: `${PUBLIC_URL}/${file.filename}`,
      filename: file.filename,
    };

    // Buscar la página que se desea actualizar y actualizar el campo "photos"
    const response = await contentModel.findOneAndUpdate(
      { webpageId },
      { $push: { photos: newPhoto } },
      { new: true }
    );

    res.send({ response });
  } catch (error) {
    handleError(res, "ERROR_UPDATE_PHOTO_INFO");
  }

  //console.log("foto subida");
};

const uploadText = async (req, res) => {
  try {
    const texts = req.body.texts;
    const { id } = req.params;

    const response = await contentModel.findOneAndUpdate(
      { webpageId: id },
      { $push: { texts: texts } },
      { new: true }
    );

    if (!response) {
      return handleError(res, "WEBPAGE_NOT_FOUND", 404);
    }

    res.send({ response });
  } catch (error) {
    console.error(error);
    handleError(res, "ERROR_UPDATE_TEXT");
  }
};

//   BORRAR pagina web via DELETE
const deleteWebPage = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await contentModel.findOneAndDelete({ webpageId: id });
    res.send(data);
  } catch (err) {
    console.log(err);
    handleError(res, "ERROR_DELETE_WEBPAGE");
  }
};

module.exports = {
  uploadContent,
  getWebPage,
  getWebPages,
  getWebPagesByCity,
  getWebPagesByActivity,
  getWebPagesByCityAndActivity,
  deleteWebPage,
  updateWebPage,
  updateScoring,
  uploadPhoto,
  uploadText,
};
