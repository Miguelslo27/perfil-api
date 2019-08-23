var express = require('express');
var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var server = express();
var port = process.env.PORT || 3000;
var cors = require('cors');
var mongoUrl = 'mongodb://localhost:27017/';
var dbname = 'proyecto-perfil';

function getCollection(collectionName) {
  return mongoClient
    .connect(mongoUrl)
    .then(function (client) {
      return client.db(dbname);
    })
    .then(function (database) {
      return database.collection(collectionName);
    });
}

server.use(cors());

server.get('/', function (req, res) {
  return res.status(200).send('ok');
});

server.get('/api/data', function (req, res) {
  getCollection('datos')
    .then(function (dataCollection) {
      return dataCollection.find({}).toArray();
    })
    .then(function (data) {
      return res.status(200).send(data[0] || {});
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).send(error);
    });
});

server.listen(port, function () {
  console.log('Mi servidor esta en linea en el puerto ' + port);
});
