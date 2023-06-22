// Importar dependecias 
const express = require("express");
const check = require("../middlewares/auth");

// Cargar Router
const router = express.Router();

// Importar controlador
const ArtistController = require("../controllers/artist");

// Definir rutas
router.post("/save", check.auth, ArtistController.save);
router.get("/one/:id", check.auth, ArtistController.one);
router.get("/list/:page?", check.auth, ArtistController.list);
router.put("/update/:id", check.auth, ArtistController.update);
router.delete("/remove/:id", check.auth, ArtistController.remove);

// Exportar router
module.exports = router;