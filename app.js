// import of required dependencies
require ('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// middleware
const checkToken = require('./middlewares/check-auth');

// controllers
const privateController = require('./controllers/private.controller');
const registrationController = require('./controllers/registration.controller');
const loginController = require('./controllers/login.controller');
const updateUserController = require('./controllers/update-user.controller');
const listingController = require('./controllers/listing.controller');

// json config
app.use(express.json());

// open route
app.get('/', (req,res) => {
  res.status(200).json({ msg: 'Welcome' })
});

// routes
app.get('/user/:id', checkToken, privateController);
app.post('/auth/register', registrationController);
app.post('/auth/login', loginController);
app.put('/users/:id', checkToken, updateUserController);
app.get('/users', checkToken, listingController);

// db credentials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

// connect to db
mongoose.connect(
  `mongodb+srv://${dbUser}:${dbPassword}@cluster0.ds97p.mongodb.net/?retryWrites=true&w=majority`, 
)
.then(() => (
  app.listen(3000),
  console.log('Connected to Mongo database.')
))
.catch((err) => console.log(err));
