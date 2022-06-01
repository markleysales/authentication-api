const User = require('../models/User');

async function listingController (req, res){
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
};

module.exports = listingController;