// app.get('/api/v1/unicorns')           // - get all the unicorns
// app.post('/api/v1/unicorn')          // - create a new unicorn
// app.get('/api/v1/unicorn/:id')       // - get a unicorn
// app.patch('/api/v1/unicorn/:id')     // - update a unicorn
// app.delete('/api/v1/unicorn/:id')       // - delete unicorn

// var { unicornsJSON } = require('./data.js');
const { writeFile, readFile } = require('fs');
const util = require('util');
const readFileAsync = util.promisify(readFile);
const writeFileAsync = util.promisify(writeFile);
var unicornsJSON = [];

const express = require('express');

const app = express();
const port = 8090;
app.use(express.json());

app.listen(port, async () => {
  try {
    unicornsJSON = await readFileAsync('./data.json', 'utf-8')
    if (!unicornsJSON) {
      console.log("Could not read the file");
      return
    }
    unicornsJSON = JSON.parse(unicornsJSON)
    console.log(unicornsJSON);
  } catch (error) {
    console.log(error);
  }

  console.log(`Example app listening on port ${port}`)
})

app.get('/api/v1/unicorns', (req, res) => {
  res.json(unicornsJSON);
})

app.post('/api/v1/unicorn', (req, res) => {
  unicornsJSON.push(req.body);

  //Update the data.js file
  writeFileAsync('./data.js', JSON.stringify(unicornsJSON), 'utf-8')
    .then(() => { })
    .catch((err) => { console.log(err); });
  res.json(req.body);
})

app.get('/api/v1/unicorn/:id', (req, res) => {
  var found = false;
  for (i = 0; i < unicornsJSON.length; i++) {
    if (unicornsJSON[i]._id == req.params.id) {
      found = true;
      break
    }
  }
  if (found) {
    res.json(unicornsJSON[i]);
    return
  }
  res.json({ msg: "not found" })
})

app.patch('/api/v1/unicorn/:id', (req, res) => {
  unicornsJSON = unicornsJSON.map(({ _id, ...aUnicorn }) => {
    if (_id == req.body._id) {
      console.log("Bingo!");
      return req.body;
    } else {
      return aUnicorn;
    }
  })
  res.send("Updated successfully!");
  //update the file after patch
  writeFileAsync('./data.json', JSON.stringify(unicornsJSON), 'utf-8')
    .then(() => { })
    .catch((err) => { console.log(err); })
})

app.delete('/api/v1/unicorn/:id', (req, res) => {
  unicornsJSON = unicornsJSON.filter((element) => {
    element._id != req.params.id
  })

  res.send("Deleted successfully!");
  //update the file after delete
  writeFileAsync('./data.json', JSON.stringify(unicornsJSON), 'utf-8')
    .then(() => { })
    .catch((err) => { console.log(err); })
})