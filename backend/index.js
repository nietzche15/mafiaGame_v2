const express = require('express');
const app = express();
const http = require('http').Server(app);
require('./roomChat')(http);

app.get('/', (req, res) => {
  res.send('Docker!');
});

http.listen(7070, () => {
  console.log('Server port : ', 7070);
});
