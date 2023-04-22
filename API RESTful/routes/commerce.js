const express = require("express");
const {
  getMerchant,
  getMerchants,
  createMerchant,
  updateMerchant,
  deleteMerchant,
  loginMerchant,
} = require("../controllers/commerce");
const {
  validatorCreateMerchant,
  validatorLoginMerchant,
} = require("../validators/commerce");
const { validatorNeedId } = require("../validators/users");
const { authMiddleware } = require("../middleware/session");

const { checkRole } = require("../middleware/role");

const router = express.Router();

//  http://localhost:3000/api/commerce

/**
 * @openapi
 * /api/commerce:
 *  get:
 *      tags:
 *      - Commerces
 *      summary: Obtener todos los comerciantes
 *      description: Retorna una lista con todos los comerciantes registrados.
 *      security:
 *        - bearerAuth: []
 *      responses:
 *        '200':
 *            description: Lista de comerciantes
 *        '401':
 *            description: No autorizado
 *        '500':
 *            description: Error del servidor
 */
router.get("/", authMiddleware, checkRole(["admin"]), getMerchants); //ADMIN
/**
 * @openapi
 * /api/commerce/:id:
 *   get:
 *     tags:
 *     - Commerces
 *     summary: Obtener un comerciante por ID
 *     description: Retorna los detalles de un comerciante específico.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID del comerciante a obtener
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Detalles del comerciante
 *       '401':
 *         description: No autorizado
 *       '404':
 *         description: Comerciante no encontrado
 *       '500':
 *         description: Error del servidor
 */

router.get("/:id", authMiddleware, checkRole(["admin"]), getMerchant); //ADMIN
/**
 * @openapi
 * /api/commerce/register:
 *   post:
 *     tags:
 *     - Commerces
 *     summary: Registrar un nuevo comerciante
 *     description: Crea un nuevo comerciante en la base de datos.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/registerMerchant'
 *     responses:
 *       '201':
 *         description: Comerciante creado correctamente
 *       '400':
 *         description: Solicitud inválida
 *       '401':
 *         description: No autorizado
 *       '500':
 *         description: Error del servidor
 */

router.post(
  "/register",
  authMiddleware,
  checkRole(["admin"]),
  validatorCreateMerchant,
  createMerchant
); //ADMIN
/**
 * @openapi
 * /api/commerce/login:
 *   post:
 *     tags:
 *     - Commerces
 *     summary: Login un comerciante para subir contenido
 *     description: Login de un comerciante.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginMerchant'
 *     responses:
 *       '201':
 *         description: Comerciante iniciado sesion correctamente
 *       '400':
 *         description: Solicitud inválida
 *       '401':
 *         description: No autorizado
 *       '500':
 *         description: Error del servidor
 */
router.post("/login", validatorLoginMerchant, loginMerchant); //MERCHANT

/**
 * @openapi
 * /api/commerce/:id:
 *   put:
 *     summary: Actualizar un comerciante
 *     tags:
 *     - Commerces
 *     description: Endpoint para actualizar un comercio por su id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del comercio a actualizar
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Datos actualizados del comercio
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Commerce'
 *     responses:
 *       200:
 *         description: Comercio actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Comercio no encontrado
 *       500:
 *         description: Error del servidor
 *     security:
 *       - bearerAuth: []
 */

router.put(
  "/:id",
  authMiddleware,
  checkRole(["admin"]),
  validatorNeedId,
  updateMerchant
); //ADMIN
/**
 * @openapi
 * /api/commerce/:id:
 *  delete:
 *      tags:
 *      - Commerces
 *      summary: Eliminar comercio registrado
 *      description: Eliminar comercio registrado
 *      parameters:
 *      - name: id
 *        in: path
 *        description: ID del comercio a borrar.
 *        required: true
 *      responses:
 *          '200':
 *              description: Comercio eliminado con éxito.
 *          '401':
 *              description: No autorizado.
 *          '500':
 *              description: Error del servidor.
 *      security:
 *          - bearerAuth: []
 */

router.delete(
  "/:id",
  authMiddleware,
  checkRole(["admin"]),
  validatorNeedId,
  deleteMerchant
); //ADMIN

module.exports = router;
