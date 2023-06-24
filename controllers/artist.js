// Importaciones 
const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");
const mongoosePagitacion = require("mongoose-pagination");
const fs = require("fs");
const path = require("path");

// Metodo Guardar
const save = (req, res) => {
    // Recoger datos del body
    let params = req.body;

    // Crear el objeto a guardar
    let artist = new Artist(params);

    // Guardar
    artist.save()
          .then((artistStored) => {
            if(!artistStored) {
                return res.status(404).send({
                    status: "error",
                    message: "No se ha guardado el artista",
                });
            }
            return res.status(200).send({
                status: "success",
                message: "Artista Guardado",
                artist: artistStored
            });
          })
}

// Metodo obtener un artista 
const one = (req, res) => {
    // Sacar un parametro por url
    const artistId = req.params.id;

    // Find 
    Artist.findById(artistId)
          .then((artist) => {
            if(!artist) {
                return res.status(404).send({
                    status: "error",
                    message: "No existe el artista",
                });
            }
            return res.status(200).send({
                status: "success",
                artist
            });
          })

}

// Metodo para sacar una lista de artistas 
const list = (req, res) => {
    // Sacar la posible pagina
    let page = 1;

    if(req.params.page){
        page = req.params.page
    }

    // Definir numero de elementos por page
    const itemsPerPage = 5;

    Artist.find()
          .sort("name")
          .paginate(page, itemsPerPage)
          .then((artist, total) => {
            if(!artist && !total){
                return res.status(404).send({
                    status: "error",
                    message: "No hay artistas",
                });
            }
            return res.status(200).send({
                status: "success",
                page,
                itemsPerPage,
                total,
                artist
            });
          });
}

// Metodo actualizar artista
const update = (req, res) => {

    // Recoger id artista url
    const id = req.params.id;

    // Recoger datos body
    const data = req.body;

    // Buscar y actualizar artista
    Artist.findByIdAndUpdate(id, data, {new:true})
          .then((artistUpdate) => {
            if(!artistUpdate){
                return res.status(500).send({
                    status: "error",
                    message: "No se ha actualizado el artista",
                });
            }
            return res.status(200).send({
                status: "error",
                artist: artistUpdate
            });
          });
}

// Metodo borrar artista 
const remove = async(req, res) => {

    // Sacar el id del artista de la url
    const artistId = req.params.id;

    // Hacer consulta para buscar y eliminar el artista con un await 
    try {
        const artistRemoved = await Artist.findByIdAndDelete(artistId);
        // Remove de albums
        const albumRemoved = await Album.find({artist: artistId}).remove();
        // Remove de songs
        const songRemoved = await Song.find({album: albumRemoved._id}).remove();

        // devolver resultado
        return res.status(200).send({
            status: "error",
            artistRemoved,
            albumRemoved,
            songRemoved
        });
        
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar el artista",
            error
        });
    }
}

// metodo subir imagen
const upload = (req, res) => {

    // Recoger artist id
    let artistId = req.params.id;

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
    Artist.findByIdAndUpdate({_id: artistId}, {image: req.file.filename}, {new:true})
        .then((artistUpdate) => {
            if(!artistUpdate) {
                return res.status(500).send({
                    status: "error",
                    message: "Error en la subida de la imagen"
                });
            }


            return res.status(200).send({
                status:"success",
                user: artistUpdate,
                file: req.file,
            });
        });
}

// Metodo mostrar avatar
const image = (req, res) => {

    // Sacar el parametro de la url
    const file = req.params.file;

    // Montar el path real de la imagen
    const filePath = "./uploads/artists/"+file;

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
    remove,
    upload,
    image
}