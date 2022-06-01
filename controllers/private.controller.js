const User = require('../models/User');

async function privateController(req, res){
  const id = req.params.id
  
  //check
  const user = await User.findById(id, '-password')
  
  if(!user){
    return res.status(404).json({ msg: 'User not found.' })
  }
  res.status(200).json( user )
}

module.exports = privateController;
