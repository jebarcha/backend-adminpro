require('dotenv').config();

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('./database/config');

// mean_user
// adgicUfHdnR6Qji5

// Crear el servidor de express
const app = express();

// Configurar CORS
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Base de datos
dbConnection();
//console.log(process.env.PORT);

// Rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));



const puerto = process.env.PORT || 3000;
app.listen(puerto, () => {
    console.log(`Servidor corriendo en puerto ${puerto}`);
});

