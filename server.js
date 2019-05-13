const express = require('express');
const connectDB = require('./config/db');
const routes = require('./routes')


const app = express();

connectDB();

app.use(express.json({ extended: false }))

app.get('/', (req, res) => res.send(`API running`));

app.use(routes)

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => 
  console.log(`Server listening on port http://localhost:${PORT}`));