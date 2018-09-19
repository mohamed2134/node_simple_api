const mongoos = require("mongoose");
const validator = require("validator");
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
      token:[

      ]

    }
);

let User = mongoos.model("users",userSchema);

module.exports = {
  User
}
