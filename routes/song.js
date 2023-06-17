// Importar dependecias 
const express = require("express");

// Cargar Router
const router = express.Router();

// Importar controlador
const SongController = require("../controllers/song");

// Definir rutas
router.get("/prueba-song", SongController.prueba)

// Exportar router
module.exports = router;