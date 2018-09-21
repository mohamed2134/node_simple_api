const {User} = require('./models/user');
const {ObjectId} = require("mongodb");
const {mongoos} = require("./db/mongoos");
const {todoModel} = require("./models/todo");
const _ = require('lodash');
const {authentication} = require('./middlewares/authApi');
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


//   delete resource from  todo colllection

app.delete("/todo/:id",(req,res)=>{

    let id = req.params.id;
    if(!ObjectId.isValid(id)){
        return res.status(404).send("invalid id ");
    }

    todoModel.findByIdAndDelete(id).then(
      (reslt)=>{
        if(!reslt)
           return res.status(404).send("not found document for this id ");
        res.send(reslt);
      },
      (err)=>{
        res.send(err);
      }
    );


});

//       update resource
 app.patch('/todo/:id',(req,res)=>{
        let todo =   todoModel;
        let id = req.params.id;

        if(!ObjectId.isValid(id)){
            return res.status(404).send("invalid id ");
        }
        // get body Object
        let body = _.pick(req.body,["text","completed"]);

        if(_.isBoolean(body.completed) && body.completed){
             body.createdAt = new Date().getTime();
        }else{
          body.completed = false;
          body.createdAt = null;
        }

        console.log(body);
        //find if document exist
        todo.findById(id).then(
          (doc)=>{
            if(!doc){
              return res.status(404).send("not found document for this id ");
            }
            todo.findByIdAndUpdate(id,{$set:body},{new:true}).then(
              (doc)=>{
                return res.send(doc);
              },
              (err)=>{
                return res.send(err);
              }
            );

          }
          ,
          (err)=>{
            return res.send(err);
          }
        );




 });


////////////////////   user routes   ///////////////////////
app.post('/user',(req,res)=>{

   let body = _.pick(req.body,['email','password']);
   let newuser = new User(body);


    newuser.save().then(
      ()=>{
        return   newuser.generateAthorToken();
      },
      (err)=>{
        console.log(err);
        res.send(err);
      }
    ).then(
      (token)=>{
            res.header('x-auth',token).send(newuser);
      },
      (err)=>{
        res.send(err);
      }
    ).catch((e)=>{
      console.log(e);
    });




});


//            private routes

app.get("/user/me",authentication,(req,res)=>{

   res.send(req.user);
});




app.listen(port,()=>{
  console.log("server start listening on port # "+port);
});

module.exports = {
    app
}
