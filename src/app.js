const express = require('express');
require('dotenv').config();
const app = express();

require('./conf/database.js');

app.use(express.json());

app.use('/api/products', require('./routes/product'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/auth', require('./routes/auth'));

module.exports = app;