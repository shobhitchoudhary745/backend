const cors=require('cors')
require('dotenv').config()
const express = require("express");   

const app = express();
app.use(cors())
require("./db/mongoose");
const port = process.env.PORT;

const userRouter=require('./routers/user')
app.use(express.json())
app.use(userRouter)

app.listen(port,()=>{
    console.log('server is upon port '+port)
})