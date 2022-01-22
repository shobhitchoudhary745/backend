const express = require("express");
const User = require("../models/user");
const router = new express.Router();
const auth = require('../middleware/auth')
router.post("/users", async (req, res) => {
    const user = new User(req.body);
    try {
      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  });

router.get('/users',async(req,res)=>{
    const users=await User.find({},null,{sort: {Name: 1}})
    res.send(users)
})  
router.delete('/users/:id',async(req,res)=>{
    await User.findByIdAndDelete(req.params.id)
    res.send();
})
router.get('/users/me',auth,async(req,res)=>{
    res.send(req.user)
})

router.post("/users/login", async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );  
      const token=await user.generateAuthToken()
      res.send({user,token});
    } catch (e) {
      res.status(400).send();
    }
  });


  router.post("/users/:id",async (req, res) => {
     const user=await User.findById(req.params.id)
     try {
       if(req.body.Name!=='')
       user.Name=req.body.Name
       if(req.body.email!=='')
       user.email=req.body.email
       if(req.body.phoneNumber!=='')
       user.phoneNumber=req.body.phoneNumber
       await user.save()
       res.send(user)
     } catch (e) {
       res.status(400).send(e);
     }
  });

  router.post('/userrs/Logout',auth,async(req,res)=>{
    try{
      req.user.tokens=req.user.tokens.filter((token)=> token.token!==req.token)
     
       await req.user.save()
     
       res.status(200).send(req.user)
      
    }catch(e){
      
  res.status(500).send()
    }
  })

  module.exports = router;