const {User} = require('./models/user');
const config = require('./config/config');
const {ObjectId} = require("mongodb");
const {mongoos} = require("./db/mongoos");
const {todoModel} = require("./models/todo");
const _ = require('lodash');
var bcrypt = require('bcrypt');
const {authentication} = require('./middlewares/authApi');
const {loginAuth} = require('./middlewares/login');
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
//   server config
const port = process.env.PORT || 5000;
app.set('view engine', 'hbs');

// middle wares
app.use(bodyParser.json());
//  define our routes

app.post('/todo',authentication,(req,res)=>{

    let newTodo = new todoModel({
      'text':req.body.text,
      '_creator':req.user._id
    });


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


app.get('/todo',authentication,(req,res)=>{

     todoModel.find({'_creator':req.user._id}).then((reslt)=>{
       res.send({reslt});
     },
    (err)=>{
      res.send(err);
    }
   );
});


app.get("/todo/:id" ,authentication, (req,res)=>{
  let id  = req.params.id;
  if(!ObjectId.isValid(id))
     return res.status(404).send({err:"invalid Id Casting "});

  todoModel.find({'_id':id,'_creator':req.user._id}).then(
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

app.delete("/todo/:id",authentication,(req,res)=>{

    let id = req.params.id;
    if(!ObjectId.isValid(id)){
        return res.status(404).send("invalid id ");
    }

    todoModel.findOneAndDelete({'_id':id,'_creator':req.user._id}).then(
      (reslt)=>{
        if(!reslt)
           return res.status(404).send("not found document ");
        res.send(reslt);
      },
      (err)=>{
        res.send(err);
      }
    );


});

//       update resource
 app.patch('/todo/:id',authentication,(req,res)=>{
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


        //find if document exist
        todo.find({'_id':id,'_creator':req.user._id}).then(
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
      //  save new user
app.post('/user',(req,res)=>{

   let body = _.pick(req.body,['email','password']);
   let newuser = new User(body);


    newuser.save().then(
      ()=>{
        return   newuser.generateAthorToken();
      },
      (err)=>{

          throw new Error(err);
      }
    ).then(
      (token)=>{
            res.header('x-auth',token).send(newuser);
      },
      (err)=>{
        return res.send(" =>"+err);
      }
    ).catch((e)=>{
      console.log("catch handeled");
      res.send(e);
    });




});


//            private routes

app.get("/user/me",authentication,(req,res)=>{

   res.send(req.user);
});


//          login routes
app.post('/users/login',loginAuth,(req,res)=>{
        let user = req.user;
    user.generateAthorToken().then(
      (token)=>{
         res.header('x-auth',token).send(user);
      }
    ).catch((err)=>{ res.send(err); });



});

//    logout user and delete the tokens
app.delete('/user/me/token',authentication,(req,res)=>{

        let user = req.user;
        user.removeToken(req.token).then(
          (user)=>{
            res.send("user loged out");
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
