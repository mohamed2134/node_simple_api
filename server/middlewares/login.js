var bcrypt = require('bcrypt');
const {User} = require('./../models/user');
const _ = require('lodash');



let loginAuth = function(req,res,next){

let body  = _.pick(req.body ,['email','password'])

User.findOne({'email':body.email}).then(
   (user)=>{
      if(!user){
        return res.status(404).send("sorry mail not exist");
      }

      bcrypt.compare(body.password,user.password,(err,reslt)=>{
        if(err)
           return res.status(404).send("sorry wrong password");
          req.user = user;
          next();
      });

    }
      ,
      (err)=>{
        return res.status(404).send("sorry mail not exist");
      }

).catch((e)=>{res.status(404).send("sorry mail not exist");});

}

module.exports.loginAuth = loginAuth;
