const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");

const __path = process.cwd();
const app = express();
const { PORT } = require('./config.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname,'public')))

const add = require('./routes/add');
app.use('/add', add);

const dlt = require('./routes/delete');
app.use('/delete', dlt);

const edit = require('./routes/edit');
app.use('/edit', edit);

const view = require('./routes/view');
app.use('/view', view);

app.get('/', (req, res) => {
    res.sendFile(path.join(__path, '/public/index.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__path, '/public/about.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on localhost:${PORT}`)
});
