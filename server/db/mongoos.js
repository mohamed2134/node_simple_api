const mongoos = require("mongoose");
const dbName = "todos";
const localUrl = "mongodb://localhost/"+dbName;
const user = "mohamed";
const password = "m010095707099";
const cloudUrl = `mongodb://${user}:${password}@ds215093.mlab.com:15093/${dbName}`;


  mongoos.Promise = global.Promise;
  mongoos.set('useFindAndModify', false);
  mongoos.set('useCreateIndex',true );

  mongoos.connect(cloudUrl,{ useNewUrlParser: true});




module.exports = {
  mongoos
}
