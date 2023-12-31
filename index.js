// importar conexion a base de datos
const connection = require("./database/connection");

// Importar dependencias
const express = require("express");
const cors = require("cors"); 

// Mensaje de bienvenida 
console.log("Bievenidos a music!!!");

// Ejecutar conexion a la bd
connection();

// Crear servidor de node
const app = express();
const port = 3911;

// Configurar cors
app.use(cors());

// Convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Cargar configuraciones de rutas
const UserRoutes = require("./routes/user");
const ArtistRoutes = require("./routes/artist");
const AlbumRoutes = require("./routes/album");
const SongRoutes = require("./routes/song")

app.use("/api/user", UserRoutes);
app.use("/api/artist", ArtistRoutes);
app.use("/api/album", AlbumRoutes);
app.use("/api/song", SongRoutes);

// Poner el servidor a escuchar peticiones http
app.listen(port, () => {
    console.log("Servidor escuchando en el puerto: ", port);
})