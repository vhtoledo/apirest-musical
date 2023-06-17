// Importar dependecias 
const express = require("express");

// Cargar Router
const router = express.Router();

// Importar controlador
const AlbumController = require("../controllers/album");

// Definir rutas
router.get("/prueba-album", AlbumController.prueba)

// Exportar router
module.exports = router;