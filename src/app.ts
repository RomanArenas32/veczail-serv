require('dotenv').config();


const ServerModel = require('./models/server').default;

const server = new ServerModel();

server.listen();