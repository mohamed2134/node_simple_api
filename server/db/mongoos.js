const mongoos = require("mongoose");
const dbName = "ToDo";
  mongoos.Promise = global.Promise;
  mongoos.connect("mongodb://localhost/"+dbName,{ useNewUrlParser: true });




module.exports = {
  mongoos
}
