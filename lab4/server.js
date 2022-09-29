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
app.use(express.json());

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
  unicornModel.create(req.body, function (err) {
    if (err) console.log(err);
    // Saved!
  });
  res.json(req.body);
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
  const { _id, ...rest } = req.body;
  unicornModel.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, rest, function (err, res) {
    // Updated at most one doc, `res.nModified` contains the number
    // of docs that MongoDB updated
    if (err) console.log(err);
    console.log(res);
  })
})

app.delete('/api/v2/unicorn/:id', (req, res) => {
  unicornModel.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }, function (err, res) {
    if (err) console.log(err);
    console.log(res);
  })
  res.send("Deleted Successfully!");
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