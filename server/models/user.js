const mongoos = require("mongoose");
const validator = require("validator");
const _ = require('lodash');
const jwt = require('jsonwebtoken');

let Schema = mongoos.Schema;

let userSchema = new Schema(
    {

       email:{
        type:String,
        required:true,
        unique:true,
        minlength:6,
        trim:true,
        validate:{
             validator: (value)=>{
            return validator.isEmail(value);
          },
          message:`is invalid email`
        }
      }
      ,

      password:{
        type:String,
        minlength:8,
        required:true
      }
      ,
      tokens:[{
        access:{
          type:String,
          required:true
        },
        token:{
          type:String,
          required:true
        }
      }
      ]

    }
);



userSchema.methods.toJSON = function(){
    let user = this;
    let  resbody = _.pick(user.toObject(),['_id','email']);
     return resbody;
}


userSchema.methods.generateAthorToken = function(){
  let user = this;
  var access = "auth";
  var token  = jwt.sign({_id:user._id.toHexString(),access},"123abc").toString();

 user.tokens.push({access,token});

 return user.save().then(
       ()=>{
        return token;
   },
   (err)=>{
     return null;
   }
 );


}

userSchema.statics.findByToken = function(token){

    var user = this;
    let decoded;
    try{
      decoded  =   jwt.verify(token,"123abc");
     }catch(e){
          return Promise.reject();
     }

  return  user.findOne({"tokens.token":token,'_id':decoded._id,"tokens.access":'auth'});

}



let User = mongoos.model("users",userSchema);

module.exports = {
  User
}
