const express = require("express");
const {
  getUsersByCity,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/users");

const {
  validatorCreateUser,
  validatorUpdateUser,
  validatorDeleteUser,
  validatorLoginUser,
  validatorNeedId,
} = require("../validators/users");

const { authMiddleware, authMiddleware2 } = require("../middleware/session");

const { checkRole } = require("../middleware/role");

const router = express.Router();

//  http://localhost:3000/api/users

/**
 * @openapi
 * /api/users/:city:
 *  get:
 *      tags:
 *        - Users
 *      summary: Obtener usuarios por ciudad
 *      description: Obtiene los usuarios registrados en la ciudad especificada.
 *      parameters:
 *        - name: city
 *          in: path
 *          description: Nombre de la ciudad para filtrar los usuarios.
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *          '200':
 *              description: Retorna los usuarios de la ciudad especificada.
 *          '401':
 *              description: No autorizado.
 *          '500':
 *              description: Error del servidor.
 *      security:
 *        - bearerAuth: []
 */
router.get("/:city", authMiddleware2, getUsersByCity); //MERCHANT

/**
 * @openapi
 * /api/users/register:
 *  post:
 *      tags:
 *        - Users
 *      summary: Registrar un usuario público
 *      description: Registra un nuevo usuario público.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/registerUser'
 *      responses:
 *          '201':
 *              description: Usuario registrado con éxito.
 *          '400':
 *              description: Petición incorrecta.
 *          '409':
 *              description: El usuario ya existe.
 *          '500':
 *              description: Error del servidor.
 */
router.post("/register", validatorCreateUser, createUser); //PUBLIC USER

/**
 * @openapi
 * /api/users/login:
 *  post:
 *      tags:
 *        - Users
 *      summary: Iniciar sesión como usuario público
 *      description: Inicia sesión como usuario público.
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/loginUser'
 *      responses:
 *          '200':
 *              description: Sesión iniciada con éxito.
 *          '401':
 *              description: Credenciales incorrectas.
 *          '500':
 *              description: Error del servidor.
 */
router.post("/login", validatorLoginUser, loginUser); //PUBLIC USER

/**
 * @openapi
 * /api/users/:id:
 *  put:
 *      tags:
 *        - Users
 *      summary: Actualizar información de usuario registrado
 *      description: Actualiza la información del usuario registrado.
 *      parameters:
 *        - name: id
 *          in: path
 *          description: ID del usuario a actualizar.
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/updateUser'
 *      responses:
 *          '200':
 *              description: Información de usuario actualizada con éxito.
 *          '401':
 *              description: No autorizado.
 *          '500':
 *              description: Error del servidor.
 *      security:
 *        - bearerAuth: []
 */
router.put(
  "/:id",
  authMiddleware,
  checkRole(["user", "admin"]),
  validatorNeedId,
  updateUser
); //REGISTERED USER

/**
 * @openapi
 * /api/users/:id:
 *  delete:
 *      tags:
 *      - Users
 *      summary: Eliminar usuario registrado
 *      description: Eliminar usuario registrado
 *      parameters:
 *      - name: id
 *        in: path
 *        description: ID del usuario a borrar.
 *        required: true
 *      responses:
 *          '200':
 *              description: Usuario eliminado con éxito.
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
  checkRole(["user", "admin"]),
  validatorNeedId,
  deleteUser
); //REGISTERED USER

module.exports = router;
