// Importar dependecias 
const express = require("express");

// Cargar Router
const router = express.Router();

// Importar controlador
const ArtistController = require("../controllers/artist");

// Definir rutas
router.get("/prueba-artist", ArtistController.prueba)

// Exportar router
module.exports = router;