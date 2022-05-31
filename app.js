// import of required dependencies
require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');

const app = express();

// json config
app.use(express.json());

// models
const User = require('./models/User');

// open route
app.get('/', (req,res) => {
  res.status(200).json({ msg: 'Welcome' })
});

// private route
app.get('/user/:id', checkToken, async (req, res) => {
  const id = req.params.id

  //check
  const user = await User.findById(id, '-password')

  if(!user){
    return res.status(404).json({ msg: 'User not found.' })
  }
  res.status(200).json( user )
})

// middleware
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

// registration user
app.post('/auth/register', async(req, res) => {
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
});

// login
app.post('/auth/login', async (req, res) => {
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
});

// user update
app.put('/users/:id', checkToken, (req,res) => {
  const users = User.updateOne({ _id: req.params.id }, req.body, (err) => {
    if(err) return res.status(500).json({ msg: 'Server error, try later.' })
    res.status(200).json({ msg: 'User was updated!' })
  })
})

// users list limited
app.get('/users', checkToken, async (req, res) => {
  try {
    let { page, size, sort } = req.query;

    if (!page) {
        page = 1;
    }

    if (!size) {
        size = 10;
    }

    const limit = parseInt(size);
    const user = await User.find().sort(
        { votes: 1, _id: 1 }).limit(limit)
    res.send({
        page,
        size,
        Info: user,
    });
  }catch (error) {
    res.sendStatus(500);
  }
});

// db credentials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@cluster0.ds97p.mongodb.net/?retryWrites=true&w=majority`, 
)
.then(() => (
  app.listen(3000),
  console.log('Connected to Mongo database.')
))
.catch((err) => console.log(err));