// Importar dependecias 
const express = require("express");

// Cargar Router
const router = express.Router();

// Importar controlador
const UserController = require("../controllers/user");

// Definir rutas
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.get("/profile/:id", UserController.profile);

// Exportar router
module.exports = router;