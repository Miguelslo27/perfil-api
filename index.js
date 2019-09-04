const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const helper = require('./database/helpers.js');
const baseApi = '/api';

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.get('/', (req, res) => res.status(200).send('ok'));

server.get(`${baseApi}/data`, (req, res) => {
  helper.getCollection('data')
    .then(dataCollection => dataCollection.find({}).toArray())
    .then(data => res.status(200).send(data[0] || {}))
    .catch(error => helper.handleError(error.MongoError, res));
});

server.post(`${baseApi}/data`, (req, res) => {
  helper.getCollection('data')
    .then(helper.handleCollectionResponse)
    .then(response => helper.handleCollectionUpdateInsert(response, req, res))
    .catch(error => helper.handleError(error.MongoError, res));
});

server.post(`${baseApi}/skills`, (req, res) => {
  helper.getCollection('skills')
    .then((collection) => {
      collection.insert(req.body, error => {
        if (error) return res.status(500).send(error);
        return res.status(200).send('Se salvaron los datos');
      });
    })
    .catch(error => helper.handleError(error.MongoError, res));
});

server.get(`${baseApi}/skills`, (req, res) => {
  // @TODO
});

server.get(`${baseApi}/skills/:skillName`, (req, res) => {
  // skillName = 'HTML'
  // @TODO 
});

server.listen(port, () => {
  console.log('Mi servidor esta en linea en el puerto ' + port);
});
