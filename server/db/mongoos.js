const mongoos = require("mongoose");
const dbName = "todos";
const localUrl = "mongodb://localhost/"+dbName;
const user = "mohamed";
const password = "m010095707099";
const cloudUrl = `mongodb://${user}:${password}@ds261332.mlab.com:61332/${dbName}`;


  mongoos.Promise = global.Promise;
  mongoos.set('useFindAndModify', false);
  mongoos.set('useCreateIndex',true );

  mongoos.connect(localUrl,{ useNewUrlParser: true});




module.exports = {
  mongoos
}
