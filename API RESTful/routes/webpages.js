const express = require("express");
const {
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
} = require("../controllers/webpages");
const { uploadMiddleware } = require("../utils/handleStorage");
const {
  validatorUploadContent,
  validatorUpdateScoring,
} = require("../validators/webpages");
const { validatorNeedId } = require("../validators/users");

const { authMiddleware, authMiddleware2 } = require("../middleware/session");

const { checkRole, checkMerchantId } = require("../middleware/role");

const router = express.Router();

//  http://localhost:3000/api/webpages

/**
 * @openapi
 * /api/webpages:
 *   get:
 *     tags:
 *       - WebPages
 *     summary: Obtener todas las páginas web
 *     description: Obtiene todas las páginas web existentes.
 *     responses:
 *       '200':
 *         description: Retorna todas las páginas web.
 *       '500':
 *         description: Error del servidor.
 */
router.get("/", getWebPages); //PUBLIC AND REGISTERED USER
/**
 * @openapi
 * /api/webpages/:id:
 *   get:
 *     tags:
 *       - WebPages
 *     summary: Obtener una página web por su ID
 *     description: Obtiene una página web por su ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID de la página web a buscar.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Retorna la página web solicitada.
 *       '404':
 *         description: No se encuentra la página web solicitada.
 *       '500':
 *         description: Error del servidor.
 */
router.get("/:id", getWebPage); //PUBLIC AND REGISTERED USER
/**
 * @openapi
 * /api/webpages/search/:city:
 *   get:
 *     tags:
 *       - WebPages
 *     summary: Buscar páginas web por ciudad
 *     description: Busca páginas web en la ciudad especificada.
 *     parameters:
 *       - name: city
 *         in: path
 *         description: Nombre de la ciudad para filtrar las páginas web.
 *         required: true
 *         schema:
 *           type: string
 *       - name: sort
 *         in: path
 *         description: Elegir ordenar las actividades por numero de scoring o no
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Retorna las páginas web de la ciudad especificada.
 *       '500':
 *         description: Error del servidor.
 */
router.get("/search/:city/:sort?", getWebPagesByCity); //PUBLIC AND REGISTERED USER // parámetro opcional :sort?
/**
 * @openapi
 * /api/webpages/search/:activity:
 *   get:
 *     tags:
 *       - WebPages
 *     summary: Buscar páginas web por actividad
 *     description: Busca páginas web por la actividad especificada.
 *     parameters:
 *       - name: activity
 *         in: path
 *         description: Nombre de la actividad para filtrar las páginas web.
 *         required: true
 *         schema:
 *           type: string
 *       - name: sort
 *         in: path
 *         description: Elegir ordenar las actividades por numero de scoring o no
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Retorna las páginas web de la actividad especificada.
 *       '500':
 *         description: Error del servidor.
 */
router.get("/search/:activity/:sort?", getWebPagesByActivity); //PUBLIC AND REGISTERED USER // parámetro opcional :sort?
/**
 * @openapi
 * /api/webpages/search/:city/:activity:
 *  get:
 *      tags:
 *        - WebPages
 *      summary: Buscar páginas web por ciudad y actividad
 *      description: Busca páginas web en la ciudad y actividad especificadas.
 *      parameters:
 *        - name: city
 *          in: path
 *          description: Nombre de la ciudad para filtrar las páginas web.
 *          required: true
 *          schema:
 *            type: string
 *        - name: activity
 *          in: path
 *          description: Nombre de la actividad para filtrar las páginas web.
 *          required: true
 *          schema:
 *            type: string
 *        - name: sort
 *          in: path
 *          description: Elegir ordenar las actividades por numero de scoring o no
 *          required: false
 *          schema:
 *            type: string
 *      responses:
 *          '200':
 *              description: Retorna las páginas web de la ciudad y actividad especificadas.
 *          '500':
 *              description: Error del servidor.
 */
router.get("/search/:city/:activity/:sort?", getWebPagesByCityAndActivity); // parámetro opcional :sort?
/**
 * @openapi
 * /api/webpages/:id:
 *  patch:
 *      tags:
 *        - WebPages
 *      summary: Actualiza el puntaje de la página web.
 *      description: Actualiza el puntaje de la página web especificada por ID.
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID de la página web a actualizar el puntaje.
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/updateScoring'
 *      responses:
 *          '200':
 *              description: Puntaje actualizado exitosamente.
 *          '401':
 *              description: No autorizado.
 *          '500':
 *              description: Error del servidor.
 *      security:
 *          - bearerAuth: []
 */
router.patch(
  "/:id",
  authMiddleware,
  checkRole(["user", "admin"]),
  validatorUpdateScoring,
  updateScoring
); //REGISTERED USER

/**
 * @openapi
 * /api/webpages/:id:
 *  post:
 *      tags:
 *        - WebPages
 *      summary: Crea contenido en una página web
 *      description: Crea un nuevo contenido en una página web identificada por su ID.
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID de la página web
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/uploadContent'
 *      responses:
 *          '201':
 *              description: Contenido creado exitosamente.
 *          '401':
 *              description: No autorizado.
 *          '500':
 *              description: Error del servidor.
 *      security:
 *          - bearerAuth: []
 */
router.post(
  "/:id",
  authMiddleware2,
  checkMerchantId,
  validatorUploadContent,
  uploadContent
); //MERCHANT
/**
 * @openapi
 * /api/webpages/:id/photos:
 *  post:
 *      tags:
 *      - WebPages
 *      summary: Sube una foto a una página web
 *      description: Sube una nueva foto a una página web identificada por su ID.
 *      parameters:
 *      - name: id
 *        in: path
 *        description: ID de la página web
 *        required: true
 *        schema:
 *          type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/uploadPhoto'
 *      responses:
 *          '201':
 *              description: Foto subida exitosamente.
 *          '401':
 *              description: No autorizado.
 *          '500':
 *              description: Error del servidor.
 *      security:
 *          - bearerAuth: []
 */
router.post(
  "/:id/photos",
  authMiddleware2,
  checkMerchantId,
  uploadMiddleware.single("image"),
  uploadPhoto
); //MERCHANT
/**
 * @openapi
 * /api/webpages/:id/texts:
 *  post:
 *      tags:
 *      - WebPages
 *      summary: Sube un texto a una página web
 *      description: Sube un nuevo texto a una página web identificada por su ID.
 *      parameters:
 *      - name: id
 *        in: path
 *        description: ID de la página web
 *        required: true
 *        schema:
 *          type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *      responses:
 *          '201':
 *              description: Texto subido exitosamente.
 *          '401':
 *              description: No autorizado.
 *          '500':
 *              description: Error del servidor.
 *      security:
 *          - bearerAuth: []
 */
router.post("/:id/texts", authMiddleware2, checkMerchantId, uploadText); //MERCHANT
/**
 * @openapi
 * /api/users/:id:
 *  put:
 *      tags:
 *      - WebPages
 *      summary: Actualizar información de pagina web
 *      description: Actualiza información de pagina web.
 *      parameters:
 *      - name: id
 *        in: path
 *        description: ID del pagina web a actualizar.
 *        required: true
 *        schema:
 *          type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/updateWebPage'
 *      responses:
 *          '200':
 *              description: Información de usuario actualizada con éxito.
 *          '401':
 *              description: No autorizado.
 *          '500':
 *              description: Error del servidor.
 *      security:
 *          - bearerAuth: []
 */
router.put(
  "/:id",
  authMiddleware2,
  checkMerchantId,
  validatorNeedId,
  updateWebPage
); //MERCHANT (+ ACTUALIZAR INFO CUANDO SUBE FOTO/TEXTO)
/**
 * @openapi
 * /api/webPages/:id:
 *  delete:
 *      tags:
 *      - WebPages
 *      summary: Elimina una página web.
 *      description: Elimina una página web especificada por ID.
 *      parameters:
 *      - name: id
 *        in: path
 *        description: ID de la página web a eliminar.
 *        required: true
 *        schema:
 *          type: string
 *      responses:
 *          '204':
 *              description: Página web eliminada exitosamente.
 *          '401':
 *              description: No autorizado.
 *          '500':
 *              description: Error del servidor.
 *      security:
 *          - bearerAuth: []
 */
router.delete(
  "/:id",
  authMiddleware2,
  checkMerchantId,
  validatorNeedId,
  deleteWebPage
); //MERCHANT

module.exports = router;
