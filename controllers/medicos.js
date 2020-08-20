const { response } = require('express');
const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    const medicos = await Medico.find()
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img');

    res.status(200).json({
        ok: true,
        medicos
    });
}

const crearMedico = async (req, res) => {

    const uid = req.uid;

    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try {

        const medicoDB = await medico.save();

        res.status(200).json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })
    }

}

const actualizarMedico = async (req, res) => {

    const id = req.params.id;
    const uid = req.uid;

    try {
        const medico = await Medico.findById(id);

        if (!medico) {
            return res.status(500).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, { new: true });

        res.status(200).json({
            ok: true,
            medico: medicoActualizado
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


const borrarMedico = async (req, res) => {

    const id = req.params.id;

    try {
        const medico = await Medico.findById(id);

        if (!medico) {
            return res.status(500).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        await Medico.findByIdAndDelete(id);

        res.status(200).json({
            ok: true,
            msg: 'Medico borrado'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}


module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}