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

// exportar acciones
module.exports = {
    save
}