require('dotenv/config');
const Client = require('./src/class/client');
const client = new Client(require('path').join(__dirname, 'sitios'));

client.iniciar()
    .then(() => {
        console.log('Cliente iniciado correctamente');
    })
    .catch(console.error);