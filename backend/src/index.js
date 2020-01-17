const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');

const routes = require('./routes');
const { setupWebsocket } = require('./websocket')

const app = express();
const server = http.Server(app);

mongoose.set('useCreateIndex', true);

setupWebsocket(server);

mongoose.connect('mongodb+srv://omnistack:asatruvanatru321@@cluster0-ao3gl.mongodb.net/week10?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

app.use(cors())
app.use(express.json());
app.use(routes);

server.listen(3333);
