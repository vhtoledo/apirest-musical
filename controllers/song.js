// Importaciones
const Song = require("../models/song");
const fs = require("fs");
const path = require("path");

// Metodo guardar
const save = (req, res) => {

    // Recoger datos del body
    let params = req.body;

    // Crear objeto
    let song = new Song(params);

    // Guardar el obejto
    song.save()
         .then((songStored) => {
            if(!songStored){
                return res.status(500).send({
                    status: "error",
                    message: "Error al guardar la canción",
                })
            }
            return res.status(200).send({
                status: "success",
                song : songStored
            });
         });
}

// Metodo mostrar una cancion
const one = (req, res) => {
    // Sacar el id del album
    const songId = req.params.id;

    // Find 
    Song.findById(songId).populate({path: "album"})
          .then((song) => {
            if(!song) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el album",
                });
            }
            return res.status(200).send({
                status: "success",
                song
            });
          });
}

// Metodo para sacar una lista de canciones
const list = (req, res) => {
    // Sacar el id del artista de la url
    const albumId = req.params.albumId;

    // Hacer consulta
    Song.find({album: albumId})
        .populate({
            path: "album",
            populate: {
                path: "artist",
                model: "Artist"
            }
        })
        .sort("track")
        .then((songs) => {
            if(!songs) {
                return res.status(404).send({
                    status: "error",
                    message: "No hay canciones",
                });
            }
            return res.status(200).send({
                status: "success",
                songs
            });
          });
}

// Metodo para actualizar una cancion
const update = (req, res) => {

    // Recoger param url
    const songId = req.params.songId;

    // Recoger el body
    const data = req.body;

    // Find y un update
    Song.findByIdAndUpdate(songId, data, {new:true})
        .then((songUpdated) => {
            if(!songUpdated){
                return res.status(500).send({
                    status: "error",
                    message: "No se ha actualizado la cancion",
                });
            }
            return res.status(200).send({
                status: "success",
                song: songUpdated
            });
         });
}

// Metodo para eliminar cancion
const remove = (req, res) => {
    
    // Recoger param url
    const songId = req.params.id;

    // Remover
    Song.findByIdAndRemove(songId)
        .then((songRemove) => {
            if(!songRemove){
                return res.status(500).send({
                    status: "error",
                    message: "No se ha podido eliminar la cancion",
                });
            }
            return res.status(200).send({
                status: "success",
                song: songRemove
            });
        })
}

// metodo subir imagen
const upload = (req, res) => {

    // Recoger artist id
    let songId = req.params.id;

    // Recoger el fichero de imagen y comprobar que existe
    if(!req.file){
        return res.status(404).send({
            status: "error",
            message: "Petición no incluye la cancion"
        });
    }

    // Conseguir el nombre del archivo
    let image = req.file.originalname;

    // Sacar la extension del archivo
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];
    
    // Comprobar extension
    if(extension != "mp3" && extension != "ogg"){

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
    Song.findOneAndUpdate({_id: songId}, {file: req.file.filename}, {new:true})
        .then((songUpdated) => {
            if(!songUpdated) {
                return res.status(500).send({
                    status: "error",
                    message: "Error en la subida de la cancion"
                });
            }

            return res.status(200).send({
                status:"success",
                song: songUpdated,
                file: req.file,
            });
        });
}

// Metodo mostrar audio
const audio = (req, res) => {

    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/songs/"+file;

    // Comprobar que existe
    fs.stat(filePath, (error, exists) => {

        if(!exists){
            return res.status(404).send({
                status: "error", 
                message: "No existe la cancion"
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
    remove,
    upload,
    audio
}