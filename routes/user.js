// Importar dependecias 
const express = require("express");

// Cargar Router
const router = express.Router();

// Importar controlador
const UserController = require("../controllers/user");

// Definir rutas
router.get("/prueba-user", UserController.prueba)

// Exportar router
module.exports = router;