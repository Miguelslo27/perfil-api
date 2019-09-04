var express = require('express');
var bodyParser = require('body-parser');
var server = express();
var port = process.env.PORT || 3000;
var cors = require('cors');
var helper = require('./database/helpers.js');

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.get('/', (req, res) => res.status(200).send('ok'));

server.get('/api/data', (req, res) => {
  helper.getCollection('data')
    .then(dataCollection => dataCollection.find({}).toArray())
    .then(data => res.status(200).send(data[0] || {}))
    .catch(error => helper.handleError(error.MongoError, res));
});

server.post('/api/data', (req, res) => {
  helper.getCollection('data')
    .then(helper.handleCollectionResponse)
    .then(response => helper.handleCollectionUpdateInsert(response, req, res))
    .catch(error => helper.handleError(error.MongoError, res));
});

server.listen(port, () => {
  console.log('Mi servidor esta en linea en el puerto ' + port);
});
