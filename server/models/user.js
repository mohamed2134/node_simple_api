
let Schema = mongoos.Schema;

let personSchema = new Schema(
    {
      name:{
        type:String,
        trim:true,
        required:true

      },
      age:{
        type:Number,
        default:0,
        max:60
      },
      email:{
        type:String,
        required:true
      },
      timestamp:{
        type:Number,
        default:new Date()
      }

    }
);

let personModel = mongoos.model("persons",personSchema);

module.exports = {
  personModel
}
