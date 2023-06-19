// Importaciones 
const Artist = require("../models/artist");

// accion de prueba
const prueba = (req, res) => {

    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/artirts.js"
    });
}

// exportar acciones
module.exports = {
    prueba
}