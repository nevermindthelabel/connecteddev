const express = require('express');
const mongoose = require('mongoose');
const logger = require('morgan');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT ||3001;
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
};

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/connecteddevdb",
 { useNewUrlParser: true }, () => console.log('database connected'));

 const db = mongoose.connection

 db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.listen(PORT, () => {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
