const mongoClient = require("mongodb").MongoClient;
const expect = require("expect");
const url =  'mongodb://localhost:27017';
const dbName = "test";

mongoClient.connect(url,{ useNewUrlParser: true } ,(err,client)=>{

  if(err){
    return console.log("connection failed ",err);
  }

console.log("connection  successfully established");
const db = client.db(dbName);
let users = db.collection("users");

users.find({}).forEach((item)=>{
  console.log(item.name);
});

console.log("close connection  ...");
client.close();
});
