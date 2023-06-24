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


// exportar acciones
module.exports = {
    save
}