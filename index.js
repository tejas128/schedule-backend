const express=require("express")
const bodyparser=require("body-parser")
const mongoose=require("mongoose")
const userroute=require("./routes/users")
const courseroute=require("./routes/course")
require("dotenv").config()
const cors = require('cors')
const app = express()


mongoose
  .connect(process.env.MONGOURL, {
    useNewUrlParser: true,
   

  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));
app.use(bodyparser.json())
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use(cors())
app.use("/",userroute)
app.use("/course",courseroute)
app.use("/images",express.static("images"))


app.listen(5000,()=>{
    console.log("server is started on 5000")
})