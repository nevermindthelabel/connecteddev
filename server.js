const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes');
const path = require('path');

const app = express();

connectDB();

app.use(express.json({ extended: false }));

app.use(routes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server listening on port http://localhost:${PORT}`));
