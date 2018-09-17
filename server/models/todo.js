const mongoos = require("mongoose");
let Schema = mongoos.Schema;

let todSchema = new Schema(
    {
      text:{
        type:String,
        trim:true,
        required:true

      },
      timestamp:{
        type:Number,
        default:new Date()
      }

    }
);

let todoModel = mongoos.model("todo",todSchema);

module.exports = {
  todoModel
}
