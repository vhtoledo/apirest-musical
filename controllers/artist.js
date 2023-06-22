// Importaciones 
const Artist = require("../models/artist");

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

// exportar acciones
module.exports = {
    save,
    one
}