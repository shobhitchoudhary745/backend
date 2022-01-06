const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt=require('jsonwebtoken')
const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    trim: true,
  },
  phoneNumber:{
    type:Number,
    required:true
  },
  adress: {
    type: String,
    required:true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
  },
  tokens:[{
    token:{
      type:String,
      required:true
    }
  }]

});
 


userSchema.methods.generateAuthToken=async function (){
  const user = this
  const token= await jwt.sign({_id:user._id.toString()},process.env.CHECKER)
  user.tokens=user.tokens.concat({token})
  await user.save()
  return token
}

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error({error:"unable to login"});
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error({error:"unable to login"});
  }
  return user;
};
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("userapi", userSchema);

module.exports = User;
