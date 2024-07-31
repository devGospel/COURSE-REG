const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../../models/user');
const router = express.Router();
const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
} 

 const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    cb(null, 'public/uploads')
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(' ').join('-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`)
  }
 }
 )
  
const uploadOptions = multer({ storage: storage })
 

 
    /*
      * GET /
      * USER - PROFILE
  */
    router.get('/profile', async (req, res) => {

        const userId = req.session.user
        const user =  await User.findById(userId)

         var photo = user.photo

        res.render("profile", {photo, name: user.username})    
      })
  
  
      /*
        * POST /
        * Upload - photo
    */
      router.post('/upload',  uploadOptions.single('image'), async (req, res) => {

        const fileName = req.file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;

        const userId = req.session.user
        const ObjectUserId = new mongoose.Types.ObjectId(userId)
        

        const user =  await User.findOneAndUpdate(ObjectUserId,
            {
                photo: `${basePath}${fileName}`, 
            })
            
            var photo = user.photo
            res.render("profile", {photo, name: user.username})
    })


  
module.exports = router