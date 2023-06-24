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
          });
}

// Metodo para sacar una lista de albums
const list = (req, res) => {
    // Sacar el id del artista de la url
    const artistId = req.params.artistId;

    // Sacar todo los albums de la base de datos de un artista en concreto
    if(!artistId){
        return res.status(404).send({
            status: "error",
            message: "No se ha encontrado el artista"
        });
    }

    Album.find({artist: artistId}).populate("artist")
         .then((albums) => {
            if(!albums) {
                return res.status(500).send({
                    status: "error",
                    message: "No se ha encontrado albums",
                });
            }
            return res.status(200).send({
                status: "success",
                albums
            });
          });
}

// exportar acciones
module.exports = {
    save,
    one,
    list
}