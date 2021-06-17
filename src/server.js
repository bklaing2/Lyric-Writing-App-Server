// Tutorial:
// https://zellwk.com/blog/crud-express-mongodb/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
// const mongoose = require('mongoose');



// Express Set Up
const app = express();
app.listen(8080, () => console.log('listening on 8080'));
app.set('view engine', 'ejs');
app.use(cors());
app.use(bodyParser.json())



// Mongo client
MongoClient.connect('mongodb://127.0.0.1:27017', (err, client) => {
  if (err) return console.log(err)

  // Connect to database
  const db = client.db('lyric-writing-app');
  const songs = db.collection('songs');



  // Song functions
  app.post('/createSong', (req, res) => {
    songs.insertOne(req.body)
      .then(result => res.send(result.insertedId))
      .catch(error => console.error(error))
  });

  app.delete('/deleteSong/:id', (req, res) => {
    let id = req.params.id;
    
    songs.deleteOne({ _id: new mongo.ObjectID(id) })
      .then(result => res.send(id))
      .catch(error => console.error(error))
  });

  app.get('/song/:id', (req, res) => {
    let id = req.params.id;

    songs.findOne({ _id: new mongo.ObjectID(id) })
      .then(song => {console.log(song); res.send(song)} )
      .catch(error => console.error(error))
  });


  app.get('/songs', (req, res) => {
    songs.find({}, { projection: { title: true } } ).toArray()
      .then(songs => res.send(songs))
      .catch(error => console.error(error))
  });



  // Edit song functions
  app.patch('/song/:id/update/:type', (req, res) => {
    let type = req.params.type;
    let id = req.params.id;
    let patch = req.body.data;

    songs.updateOne(
      { _id: new mongo.ObjectID(id) },
      { $set: {[type]: patch} }
    )
      .then(result => res.send({id: id, type: type, data: patch}))
      .catch(error => console.error(error));
  });


  app.patch('/song/:id/update/section/add', (req, res) => {
    let id = req.params.id;
    let patch = req.body.data;

    songs.updateOne(
      { _id: new mongo.ObjectID(id) },
      { $push: {sections: patch} }
    )
      .then(result => res.send({id: id, data: patch}))
      .catch(error => console.error(error));
  });

  app.patch('/song/:id/update/section/delete/:i', (req, res) => {
    let id = req.params.id;
    let i = req.body.i;
    let section = `sections.${i}`;

    songs.updateMany(
      { _id: new mongo.ObjectID(id) },
      { $unset: { [section]: 1 } }
    ) .then(() =>
    
    songs.updateMany(
      { _id: new mongo.ObjectID(id) },
      { $pull: {sections: null} }
    )
      .then(result => res.send({id: id, data: i}))
      .catch(error => console.error(error)))
  });

  app.patch('/song/:id/update/section/:i/:type', (req, res) => {
    let type = req.params.type;
    let i = req.params.i;
    let id = req.params.id;
    let patch = req.body.data;
    let section = `sections.${i}.${type}`;

    songs.updateOne(
      { _id: new mongo.ObjectID(id) },
      { $set: {[section]: patch} }
    )
      .then(result => res.send({id: id, i: i, type: type, data: patch}))
      .catch(error => console.error(error));
  });
  










  app.get('/tutorials', (req, res) => {
    // res.sendFile(__dirname + '/index.html')
  
    // res.send( { test: 'testing' })
    songs.find().toArray()
      .then(results => res.send(results[0]))
      .catch(error => console.error(error))
  });


  // app.post('/quotes', (req, res) => {
  //   exampleCollection.insertOne(req.body)
  //     .then(result => res.redirect('/'))
  //     .catch(error => console.error(error))
  // })
})



// Mongoose
// const mongooseUrl = 'mongodb://127.0.0.1:27017/test';
// mongoose.connect(mongooseUrl, { useNewUrlParser: true });

// const db = mongoose.connection
// db.on('error', err => { console.error('connection error:', err) })

// db.once('open', _ => {
//   console.log('Database connected:', mongooseUrl);

//   const exampleSchema = new mongoose.Schema({
//     name: String
//   });

//   const example = mongoose.model('Example', exampleSchema);
// })