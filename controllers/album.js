// Importaciones
const Album = require("../models/album");
const fs = require("fs");
const path = require("path");

// Metodo guardar
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

// Actualizar un album
const update = (req, res) => {

    // Recoger param url
    const albumId = req.params.albumId;

    // Recoger el body
    const data = req.body;

    // Find y un update
    Album.findByIdAndUpdate(albumId, data, {new:true})
         .then((albumUpdate) => {
            if(!albumUpdate){
                return res.status(500).send({
                    status: "error",
                    message: "No se ha actualizado el album",
                });
            }
            return res.status(200).send({
                status: "success",
                album: albumUpdate
            });
         })
}

// metodo subir imagen
const upload = (req, res) => {

    // Recoger artist id
    let albumId = req.params.id;

    // Recoger el fichero de imagen y comprobar que existe
    if(!req.file){
        return res.status(404).send({
            status: "error",
            message: "Petición no incluye la imagen"
        });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar la extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];
    
    // Comprobar extension
    if(extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif"){

        // Borrar archivo subido
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);
        // Devolver respuesta negativa
        return res.status(400).send({
            status: "error",
            message: "Extensión del fichero inválida"
        });
    }

    // Si es correcta, guardar imagen en base de datos
    Album.findOneAndUpdate({_id: albumId}, {image: req.file.filename}, {new:true})
        .then((albumUpdate) => {
            if(!albumUpdate) {
                return res.status(500).send({
                    status: "error",
                    message: "Error en la subida de la imagen"
                });
            }

            return res.status(200).send({
                status:"success",
                album: albumUpdate,
                file: req.file,
            });
        });
}

// Metodo mostrar avatar
const image = (req, res) => {

    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/albums/"+file;

    // Comprobar que existe
    fs.stat(filePath, (error, exists) => {

        if(!exists){
            return res.status(404).send({
                status: "error", 
                message: "No existe la imagen"
            });
        } 
        
        // Devolver un file
        return res.sendFile(path.resolve(filePath));
    });
}

// exportar acciones
module.exports = {
    save,
    one,
    list,
    update,
    upload,
    image
}