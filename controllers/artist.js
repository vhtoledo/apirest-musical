// Importaciones 
const Artist = require("../models/artist");
const mongoosePagitacion = require("mongoose-pagination");

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

// exportar acciones
module.exports = {
    save,
    one,
    list
}