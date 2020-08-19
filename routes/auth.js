/*
    Path: '/api/login'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login);

router.post('/google', [
    check('token', 'El token es obligatorio').not().isEmpty(),
    validarCampos
], googleSignIn);


module.exports = router;
