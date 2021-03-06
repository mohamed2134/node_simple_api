const mongoos = require("mongoose");
let Schema = mongoos.Schema;

let todSchema = new Schema(
    {
      text:{
        type:String,
        trim:true,
        required:true

      },
      completed:{
        type:Boolean,
        default:false
      },
      createdAt:{
        type:Date
      },
      _creator:{
        required:true,
        type:mongoos.Schema.Types.ObjectId
      }

    }
);

let todoModel = mongoos.model("todo",todSchema);

module.exports = {
  todoModel
}
