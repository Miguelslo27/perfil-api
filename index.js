var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var mongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
var server = express();
var port = process.env.PORT || 3000;
var cors = require('cors');
var mongoUrl = 'mongodb://localhost:27017/';
var dbname = 'profile';

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

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.get('/', function (req, res) {
  return res.status(200).send('ok');
});

server.get('/api/data', function (req, res) {
  getCollection('data')
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

server.post('/api/data', function (req, res) {
  console.log('BODY', req.body);
  
  getCollection('data')
    .then(async function (collection) {
      return {
        collection: collection,
        result: await collection.find({}).toArray()
      }
    })
    .then(function (response) {
      console.log('In response from result');
      console.log(response.result.length);
      
      if (response.result.length) { // result.length = 0 == false | result.length > 0 == true
        response.collection.updateOne({
          _id: new ObjectID(response.result[0]._id)
        }, { $set: req.body }, function (error, result) {
          console.log('error', error);
          console.log('result', result);
          
          if (error) return res.status(500).send(error);

          return res.status(200).send('Se actualizaron los datos');
        });
      } else {
        response.collection.insertOne(req.body, function (error, result) {
          if (error) return res.status(500).send(error);

          return res.status(200).send('Se salvaron los datos');
        });
      }
    })
    .catch(function (error) {
      console.error(error);
      return res.status(500).send(error);
    });
});

server.listen(port, function () {
  console.log('Mi servidor esta en linea en el puerto ' + port);
});
