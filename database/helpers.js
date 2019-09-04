var mongodb = require('mongodb');
var mongoClient = mongodb.MongoClient;
var ObjectID = mongodb.ObjectID;
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

module.exports = {
  getCollection,
  handleCollectionResponse,
  handleCollectionUpdateInsert,
  handleError
};
