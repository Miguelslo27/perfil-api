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
    .then(client => client.db(dbname))
    .then(database => database.collection(collectionName));
}

async function handleCollectionResponse(collection) {
  return {
    collection,
    result: await collection.find({}).toArray()
  };
}

function handleCollectionUpdateInsert(response, req, res) {
  if (response.result.length) {
    response.collection.updateOne({
      _id: new ObjectID(response.result[0]._id)
    }, { $set: req.body }, error => {
      if (error) return res.status(500).send(error);
      return res.status(200).send('Se actualizaron los datos');
    });
  } else {
    response.collection.insertOne(req.body, error => {
      if (error) return res.status(500).send(error);
      return res.status(200).send('Se salvaron los datos');
    });
  }
}

function handleError(error, res) {
  console.error(error);
  return res.status(500).send(error);
}

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.use(cors());

server.get('/', (req, res) => res.status(200).send('ok'));

server.get('/api/data', (req, res) => {
  getCollection('data')
    .then(dataCollection => dataCollection.find({}).toArray())
    .then(data => res.status(200).send(data[0] || {}))
    .catch(error => handleError(error.MongoError, res));
});

server.post('/api/data', (req, res) => {
  getCollection('data')
    .then(handleCollectionResponse)
    .then(response => handleCollectionUpdateInsert(response, req, res))
    .catch(error => handleError(error.MongoError, res));
});

server.listen(port, () => {
  console.log('Mi servidor esta en linea en el puerto ' + port);
});
