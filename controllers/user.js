// Importaciones
const validate = require("../herpers/validate");

// accion de prueba
const prueba = (req, res) => {

    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: controllers/user.js"
    });
}

// Registro
const register = (req, res) => {

    // Recoger datos de la peticion
    let params = req.body;

    // Comprobar que me llegan bien
    if(!params.name || !params.nick || !params.email || !params.password){
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Validar los datos
    try {
        validate(params);
    } catch (error) {
        return res.status(400).send({
            status: "error",
            message: "Validación no superada"
        });
    }

    return res.status(200).send({
        status: "success",
        message: "Mensaje metodo registro"
    });
}

// exportar acciones
module.exports = {
    prueba,
    register
}