//const {personModel} = require('./models/user');
const {ObjectId} = require("mongodb");
const {mongoos} = require("./db/mongoos");
const {todoModel} = require("./models/todo");
const express = require("express");
const bodyParser = require('body-parser');
const app = express();
//   server config
const port = process.env.PORT || 5000;
app.set('view engine', 'hbs');

// middle wares
app.use(bodyParser.json());
//  define our routes

app.post('/todo',(req,res)=>{
    let newTodo = new todoModel(req.body);


     newTodo.save().then(
       (result)=>{

          res.send(result);

       },
       (err)=>{

         res.status(400);
         res.send("error while saving");
       }
     );

});


app.get('/todo',(req,res)=>{

     todoModel.find().then((reslt)=>{
       res.send({reslt});
     },
    (err)=>{
      res.send(err);
    }
   );
});


app.get("/todo/:id" , (req,res)=>{
  let id  = req.params.id;
  if(!ObjectId.isValid(id))
     return res.status(404).send({err:"invalid Id Casting "});

  todoModel.findById(id).then(
      (result)=>{
        if(!result)
           return res.status(404).send({err:"Object not exist for this id"});
         res.status(200).send({result});
      },
      (err)=>{
        res.send(err);
      }

  );


});












app.listen(port,()=>{
  console.log("server start listening on port # "+port);
});

module.exports = {
    app
}
