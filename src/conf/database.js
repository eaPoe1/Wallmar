const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
    .then(connection => console.log(connection.connection.name))
    .catch(err => console.error(err));