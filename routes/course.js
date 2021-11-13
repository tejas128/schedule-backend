const route=require("express").Router()
const checkJwt=require("./middlewares/check-jwt")
const checkAccess=require("./middlewares/check-access")
const Course=require("../models/Course")
const multer=require('multer')
const path=require("path")
require("dotenv").config()
const createAccess=["admin"]
const getAccess=["admin"]
//create course
const imagestorage=multer.diskStorage({
    destination:(req,file,cb)=>{
           cb(null,'images')
    },
    filename:(req,file,cb)=>{
        
       
        cb(null,Date.now() + path.extname(file.originalname) )

    }
})
const imageUpload=multer({
    storage:imagestorage
})

route.post("/",checkJwt,checkAccess(createAccess),imageUpload.single('image'),async(req,res)=>{
    const {lectures,image,...rest}=req.body
   let newlectures=JSON.parse(req.body.lectures)
   let  img= `${process.env.APIURL}/images/`+req.file.filename;

    const newcourse= new Course({...rest,lectures:newlectures,img})
    
    try{
      const savedCourse=await newcourse.save()
      return res.status(200).json({
          savedCourse
      })

    }catch(e){
        console.log(e)
        return res.status(500).json({
            message:"internal db error"
        })
    }
})


//get courses by instructor id

route.get("/:id",async(req,res)=>{
   
    
    
    try{
        const users = await Course.aggregate([
            { "$unwind": "$lectures" },
            { "$match": { "lectures.insId": req.params.id } }
          ])
      return res.status(200).json(users)

    }catch(e){
        console.log(e)
        return res.status(500).json({
            message:"internal db error"
        })

    }

})

//get courses
route.get("/",checkJwt,checkAccess(getAccess),async(req,res)=>{
    try{
        const courses=await Course.find()
        return res.status(200).json(courses)

    }catch(e){
        console.log(e)
        return res.status(500).json({
            message:"internal db error"
        })

    }

})





module.exports=route