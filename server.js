require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const path = require('path');
const PORT = process.env.PORT || 3001;
const mongoose = require('mongoose');
const db = process.env.mongoURI;

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    console.log('mongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

app.use(express.json({ extended: false }));

app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './client/build/index.html'));
  });
}

app.listen(PORT, () => console.log(`Server listening on port http://localhost:${PORT}`));
