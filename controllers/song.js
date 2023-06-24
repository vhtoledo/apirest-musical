// Importaciones
const Song = require("../models/song");

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

// exportar acciones
module.exports = {
    save,
    one,
    list
}