const jsonwebtoken = require('jsonwebtoken');

function checkToken (req, res, next) {
  const authHeader = req.header('authorization')
  const token = authHeader && authHeader.split(' ')[1]

  if(!token){
    return res.status(401).json({ msg: 'No token, authorization denied.' })
  }

  try{
    const secret = process.env.SECRET

    jsonwebtoken.verify(token, secret)
    next()
  }catch(error){
    res.status(400).json({ msg: 'Invalid token.' })
  }
}

module.exports = checkToken;
