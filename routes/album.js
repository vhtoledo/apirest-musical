// Importar dependecias 
const express = require("express");

// Cargar Router
const router = express.Router();

const check = require("../middlewares/auth");

// Importar controlador
const AlbumController = require("../controllers/album");

// Definir rutas
router.post("/save", check.auth, AlbumController.save);
router.get("/one/:id", check.auth, AlbumController.one);

// Exportar router
module.exports = router;