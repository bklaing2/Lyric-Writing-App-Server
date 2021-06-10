// Tutorial:
// https://zellwk.com/blog/crud-express-mongodb/

const express = require('express');
const cors = require('cors');
const bodyParser= require('body-parser');
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

  const db = client.db('lyric-writing-app');
  const songs = db.collection('songs');

  console.log('Connected');

  app.get('/song/*', (req, res) => {
    console.log('GET song');
    let id = req.originalUrl.replace('/song/', '');
    console.log(id)

    songs.findOne({ _id: new mongo.ObjectID(id) })
      .then(song => {console.log(song); res.send(song)} )
      .catch(error => console.error(error))
    // console.log(res);
  })


  app.get('/songs', (req, res) => {
    console.log('GET songs');

    songs.find({}, { projection: { title: true } } ).toArray()
      .then(songs => res.send(songs))
      .catch(error => console.error(error))
  });


  app.post('/createSong', (req, res) => {
    console.log('POST createSong');
    console.log(req.body);

    songs.insertOne(req.body)
      .then(result => res.send(result.insertedId))
      .catch(error => console.error(error))
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