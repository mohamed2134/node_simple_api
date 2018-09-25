
const {User} = require('../models/user');



let authentication = function(req,res,next){

  let token = req.header('x-auth');

  User.findByToken(token).then(
    (user)=>{
       if(!user){
            return res.status(404).send("user not exist empty");
       }
      req.user = user;
      req.token = token;
      next();
    },
    (err)=>{
         return res.status(404).send("user not exist error promise");
    }
  ).catch((err)=>{
    console.log(err);
     return res.status(404).send("user not exist catch erro");
  });




}


module.exports.authentication = authentication;
