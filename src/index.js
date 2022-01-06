require('dotenv').config()
const express = require("express");   
require("./db/mongoose");
const app = express();
const cors=require('cors')
app.use(cors())
const port = process.env.PORT;

const userRouter=require('./routers/user')
app.use(express.json())
app.use(userRouter)

app.listen(port,()=>{
    console.log('server is upon port '+port)
})