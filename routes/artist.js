// Importar dependecias 
const express = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = express.Router();

// Importar controlador
const ArtistController = require("../controllers/artist");

// Definir rutas
router.post("/save", check.auth, ArtistController.save);

// Exportar router
module.exports = router;