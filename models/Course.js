const mongoose=require("mongoose")


const CourseSchema=new mongoose.Schema({
    name:{
        type:String,
    },
    level:{
        type:String
    },
    desc:{
        type:String
    },
    img:{
        type:String
    },
    lectures:{
        type:Array,
        default:[]
    }


},{
    timestamps:true
})

module.exports=mongoose.model("Course",CourseSchema)