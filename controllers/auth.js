const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'email no encontrado'
            });
        }

        // Verificar password
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'password no valido'
            });
        }

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuarioDB.id);

        res.status(200).json({
            ok: true,
            token
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }
}

const googleSignIn = async (req, res = response) => {

    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);
        let usuario;

        // Verificar si ya existe el email
        const usuarioDB = await Usuario.findOne({ email });
        if (!usuarioDB) {
            usuario = new Usuario({
                nombre: name,
                email,
                password: ':-)',
                img: picture,
                google: true
            });
        } else {
            // existe el usuario
            usuario = usuarioDB;
            usuario.google = true;
            //usuario.password = ':-)'
        }

        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT(usuario.id);

        res.json({
            ok: true,
            token
        })
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: 'Token incorrecto'
        })
    }

}


module.exports = {
    login,
    googleSignIn
}
