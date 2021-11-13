const route = require("express").Router()
const { Router } = require("express")
const Course = require("../models/Course")
const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
require("dotenv").config()
//create user

route.post("/register", async (req, res) => {
  const { password, ...rest } = req.body



  try {

    let saltround = parseInt(process.env.SALTSROUND)
    const salt = await bcrypt.genSalt(saltround)
    const hashedpassword = await bcrypt.hash(password, salt)



    const newuser = new User({ ...rest, password: hashedpassword })
    const saveduser = await newuser.save()
    return res.status(200).json(saveduser)

  } catch (e) {
    console.log(e)

    return res.status(500).json({
      message: "internal db error"
    })

  }


})

//login
route.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user) {

      const result = await bcrypt.compare(password, user.password)
      if (result) {
        var token = jwt.sign({
          user: { id:user._id, email:user.email,role:user.role }
        }, process.env.SECRET, {
          expiresIn: '1h'
        });
        return res.status(200).json({
          message:"enjoy your token",
          token:token,
          role:user.role,
          id:user._id
        })

      } else {
        return res.status(403).json({
          message: "password does not match"
        })
      }

    } else {
      return res.status(404).json({
        message: "user not found"
      })
    }

  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: "internal db error"
    })


  }
})

//get users

// route.get("/",async(req,res)=>{
//   try{
//     const users=await User.find()
//     return res.status(200).json(users)
//   }catch(e){
//     console.log(e)
//     return res.status(500).json({
//         message:"internal db error"
//     })
//   }

// })
//get instuctor by avilable on date

route.get("/", async (req, res) => {
  const date = req.query.date
  console.log(date)
  try {
    const users = await Course.aggregate([
      { "$unwind": "$lectures" },
      { "$match": { "lectures.date": date } },
      { "$group": { "_id": "$lectures.insId" } }
    ])

    function userExists(id) {

      return users.some(function (el) {


        return el._id === id.valueOf();
      });
    }
    const allusers = await User.find()
    const temp = allusers.filter(e => !userExists(e._id))

    return res.status(200).json(temp)

  } catch (e) {
    console.log(e)
    return res.status(500).json({
      message: "internal db error"
    })

  }
})



module.exports = route