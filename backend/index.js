const express = require('express');
const fs = require('fs');
const app = express();
require('dotenv').config();
const port = process.env.PORT;

const privateKey = fs.readFileSync(
  '/etc/letsencrypt/live/playmafiagame.shop/privkey.pem',
  'utf-8'
);
const certificate = fs.readFileSync(
  '/etc/letsencrypt/live/playmafiagame.shop/cert.pem',
  'utf-8'
);
const ca = fs.readFileSync(
  '/etc/letsencrypt/live/playmafiagame.shop/chain.pem',
  'utf-8'
);

// const privateKey = fs.readFileSync('./encrypt/cert.key', 'utf-8');
// const certificate = fs.readFileSync('./encrypt/cert.crt', 'utf-8');
// const ca = fs.readFileSync('./encrypt/chain.pem', 'utf-8');

const credentials = {
  key: privateKey,
  cert: certificate,
  ca: ca,
};

const https = require('https').createServer(credentials, app);
console.log('key: ', privateKey);
require('./roomChat')(https);
// const http = require('http').createServer(app);
// require('./roomChat')(http);

// app.set('trust proxy', true);

app.get('/', (req, res) => {
  res.status(200).send('Server');
});

// http.listen(port, () => {
//   console.log('HTTP Server port : ', port);
// });

https.listen(port, () => {
  console.log('HTTPS Server port : ', port);
});
