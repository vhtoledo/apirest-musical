// Importaciones
const bcrypt = require("bcrypt");
const validate = require("../herpers/validate");
const User = require("../models/user");
const jwt = require("../herpers/jwt");


// Metodo Registro
const register = async (req, res) => {

    // Recoger datos de la peticion
    let params = req.body;

    // Comprobar que me llegan bien los datos y validar
    if (!params.name || !params.email || !params.password || !params.nick) {
        return res.status(400).json({
            status: "error",
            message: "Faltan datos por enviar"
        });
    }

    // Validaciones
    try {
        validate(params);
    } catch (error) {
        return res.status(400).json({
            status: "error",
            message: "Validación no superada"
        });
    }

    // Control usuarios duplicados
    try {
        const existingUsers = await User.find({
            $or: [
                { email: params.email.toLowerCase() },
                { nick: params.nick.toLowerCase() }
            ]
        }).exec();
 
        if (existingUsers && existingUsers.length >= 1) {
            return res.status(200).send({
                status: "success",
                messague: "El usuario ya existe"
            });
        }

        // Cifrar la contraseña
        let pwd = await bcrypt.hash(params.password, 10); 
        params.password = pwd;

        // crear objeto de usuario
        let usersave = new User(params);
 
        // Guardar usuario en la base de datos
        usersave
        .save()
        .then((userStored) => {

          // Limpiar el objeto a devolver
          let userCreated = userStored.toObject();
          delete userCreated.password;
          delete userCreated.role;

          return res.status(200).json({
            status: "success",
            user: userCreated,
            mensaje: "Usuario creado con exito",
          });
        })
        .catch((error) => {
            return res.status(400).json({
              status: "error",
              mensaje: "No se ha guardado el usuario: " + error.message,
            });
        });
 
    } catch (error) {
        return res.status(500).json({
            status: "Error",
            messague: "Error en la consulta de usuarios"
        });
    }
}

// Metodo login
const login = (req, res) => {

    // Recoger parametros body
    let params = req.body

    if (!params.email || !params.password){
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
        })
    }

    // Buscar el base de datos si existe
    User.findOne({email: params.email})
        .select("+password +role")
        .then((user) => {
            // si no existe el usuario
            if(!user){
                return res.status(404).send({
                    status: "error",
                    message: "No se ha encontrado el usuario",
                });
            }

            // Comprobar contraseña
            const pwd = bcrypt.compareSync(params.password, user.password);

            if(!pwd){
                return res.status(400).send({
                    status: "error",
                    message: "No te has identificado correctamente"
                });
            }

            // Limpiar objetos
            let identityUser = user.toObject();
            delete identityUser.password;
            delete identityUser.role;

            // Conseguir Token
            const token = jwt.createToken(user);

            // Devolver Datos del Usuario
            return res.status(200).json({
                status: "success",
                mensaje: "Identificado correctamente",
                user: {
                    id: user._id,
                    name: user.name,
                    nick: user.nick
                },
                token
              });
        });
}

const profile = (req, res) => {
    // Recibir el paramtro del id de usuario por la url
    const id = req.params.id;

    // Consulta para sacar los datos del usuario
    User.findById(id)
        .select({password: 0, role: 0})
        .then(async(userProfile) => {
            if(!userProfile){
                return res.status(404).send({
                    status: "error",
                    message: "El usuario no existe o hay un error"
                })
            }

            // Devolver el restulado 
            return res.status(200).json({
                status: "success",
                user: userProfile,
            });
        });
}


// exportar acciones
module.exports = {
    register,
    login,
    profile
}