// Importar dependecias 
const express = require("express");

// Cargar Router
const router = express.Router();

// Importar middlewares
const check = require("../middlewares/auth");

// Importar controlador
const SongController = require("../controllers/song");

// Definir rutas
router.post("/save", check.auth, SongController.save);
router.get("/one/:id", check.auth, SongController.one);
router.get("/list/:albumId", check.auth, SongController.list);
router.put("/update/:songId", check.auth, SongController.update);
router.delete("/remove/:id", check.auth, SongController.remove);

// Exportar router
module.exports = router;