const User = require('../models/User');

function updateUserController (req,res){
  const users = User.updateOne({ _id: req.params.id }, req.body, (err) => {
    if(err) return res.status(500).json({ msg: 'Server error, try later.' })
    res.status(200).json({ msg: 'User was updated!' })
  })
}

module.exports = updateUserController;