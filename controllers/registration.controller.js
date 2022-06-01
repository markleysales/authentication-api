const User = require('../models/User');
const bcrypt = require('bcrypt');

async function registrationController(req, res){
  const passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{8,}$/
  const { name, number, email, password, confirmpassword } = req.body
    
  // validation
  if(!name){
    return res.status(400).json({ msg: 'Name is required.' })
  }
  if(!number){
    return res.status(400).json({ msg: 'Number is required.' })
  }
  if(!email){
    return res.status(400).json({ msg: 'Email is required.' })
  }
  if(!password){
    return res.status(400).json({ msg: 'Password is required.' })
  }
  if(password !== confirmpassword){
    return res.status(400).json({ msg: 'Passwords do not match.' })
  }
  if(!passwordValidation.exec(password)){
    return res.status(400).json({ msg: 'Your password must follow the following requirements: Have at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 digit.' })
  }
  
    // existence
  const userExist = await User.findOne({ email })
    if(userExist){
      return res.status(400).json({ msg: 'Please use another email.' })
    }
  
    // hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)
  
    // create user
    const user = new User({
      name,
      number,
      email,
      password: hashedPassword,
    })
    try{
      await user.save()
      res.status(201).json({ msg: 'User was created!' })
    }catch(error){
      console.log(error)
      res.status(500).json({ msg: 'Server error, try later.' })
    }
  };

module.exports = registrationController;