// Importaciones
const Album = require("../models/album");

// accion de prueba
const save = (req, res) => {

    // Recoger datos del body
    let params = req.body;

    // Crear objeto
    let album = new Album(params);

    // Guardar el obejto
    album.save()
         .then((albumStored) => {
            if(!albumStored){
                return restart.status(500).send({
                    status: "error",
                    message: "Error al guardar album",
                })
            }
            return res.status(200).send({
                status: "success",
                message: "Album guardado",
                album : albumStored
            });
         });
}

// Metodo obtener un album
const one = (req, res) => {
    // Sacar el id del album
    const albumId = req.params.id;

    // Find 
    Album.findById(albumId).populate({path: "artist"})
          .then((album) => {
            if(!album) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el album",
                });
            }
            return res.status(200).send({
                status: "success",
                album
            });
          })

}

// exportar acciones
module.exports = {
    save,
    one
}