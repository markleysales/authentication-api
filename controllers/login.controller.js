const User = require('../models/User');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function loginController (req, res){
  const {email, password} = req.body
  // validation
  if(!email){
    return res.status(400).json({ msg: 'Email is required.' })
  }
  if(!password){
    return res.status(400).json({ msg: 'Password is required.' })
  }

  // existence email
  const userExist = await User.findOne({ email })
  if(!userExist){
    return res.status(404).json({ msg: 'User not found!' })
  }
  
  // existence password
  const checkPassword = await bcrypt.compare(password, userExist.password)
    
  if(!checkPassword){
    return res.status(400).json({ msg: 'Invalid password!' })
  }

  try{
    const secret = process.env.SECRET
    const token = jsonwebtoken.sign(
      {
        id: userExist._id
    }, 
    secret, { expiresIn: 180 /* 3 minutes 180 seconds */}
    )
    res.status(200).json({ msg: "Authentication was a success!", token })
  }catch(error){
    console.log(error)
    res.status(500).json({ msg: 'Server error, try later.' })
  }
};

module.exports = loginController;
  