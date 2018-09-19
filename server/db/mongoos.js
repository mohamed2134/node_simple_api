const mongoos = require("mongoose");
const dbName = "todo";
const localUrl = "mongodb://localhost/"+dbName;
const user = "mohamed";
const password = "m010095707099";
const cloudUrl = `mongodb://${user}:${password}@ds261332.mlab.com:61332/${dbName}`;
  mongoos.Promise = global.Promise;
  mongoos.set('useFindAndModify', false);
  mongoos.connect(cloudUrl,{ useNewUrlParser: true });




module.exports = {
  mongoos
}
