// app.get('/api/v2/unicorns')           // - get all the unicorns
// app.post('/api/v2/unicorn')          // - create a new unicorn
// app.get('/api/v2/unicorn/:id')       // - get a unicorn
// app.patch('/api/v2/unicorn/:id')     // - update a unicorn
// app.delete('/api/v2/unicorn/:id')       // - delete unicorns

const express = require('express');
const mongoose = require('mongoose');

const app = express();
const port = 8082;

app.listen(port, async() => {
  try {
    await mongoose.connect('mongodb://localhost:27017/test');
  } catch (err) {
    console.log('db error');
  }
  console.log(`Example app listening on port ${port}`)
})

app.get('/api/v2/unicorns', (req, res) => {
  unicornModel.find({})
    .then(docs => {
      console.log(docs);
      res.json(docs);
    })
    .catch(err => {
      console.error(err);
      res.json({
        msg: "db reading .. err. Check with server devs"
      });
    });
})

app.post('/api/v2/unicorn', (req, res) => {
  res.send('Create a new unicorn')
})

app.get('/api/v2/unicorn/:id', (req, res) => {
  console.log(req.params.id);
  unicornModel.find({ _id: mongoose.Types.ObjectId(`${req.params.id}`)})
    .then(doc => {
      console.log(doc);
      res.json(doc);
    })
    .catch(err => {
      console.error(err);
      res.json({ msg: "db reading .. err. Check with server devs" });
    });
})

app.patch('/api/v2/unicorn/:id', (req, res) => {
  res.send('Update a unicorn')
})

app.delete('/api/v2/unicorn/:id', (req, res) => {
  res.send('Delete a unicorn')
})

const { Schema } = mongoose;

const unicornSchema = new Schema({
  "name": String,
  "weight": Number,
  "loves": [String],
  "gender": {
    enum: ["f", "m"]
  },
  "vampires": Number,
  "dob": Date
});

const unicornModel = mongoose.model('unicorns', unicornSchema);