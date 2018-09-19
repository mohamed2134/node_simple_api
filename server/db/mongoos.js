const mongoos = require("mongoose");
const dbName = "todo";
const localUrl = "mongodb://localhost/"+dbName;
  mongoos.Promise = global.Promise;
  mongoos.set('useFindAndModify', false);
  mongoos.connect(localUrl,{ useNewUrlParser: true });




module.exports = {
  mongoos
}
