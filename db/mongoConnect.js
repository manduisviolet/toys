const mongoose = require('mongoose');
const {config} = require("../config/secretData");
mongoose.connect(`mongodb+srv://${config.mongoUser}:${config.mongoPass}@toysdb.6nf9w.mongodb.net/toysdb`, {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log("mongo connect");
  // we're connected!
});

module.exports = db;