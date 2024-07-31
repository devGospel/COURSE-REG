const express = require('express')
const router = express.Router();
const UserModel = require('../../models/user')
const authMiddleware = require('../../config/authMiddleware');
 

 

  
  /*
      * POST /
      * USER - REGISTER
  */
  router.post('/register', async (req, res) => {

    try {
     
      const  {username, email, password, confirmPassword} = req.body;

      let user = await UserModel.findOne({username})

      if(user) {
        res.render('register' ,{ message:"Username already exist", error:''});
        return;
     }
  
  
        const hasAlphabet = /[a-zA-Z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);
  
   
  
        if (password.length >= 8 && hasAlphabet && hasNumber && hasSpecialChar) {

          
            if(password !== confirmPassword) {
              res.render('register', {error: 'Passwords entered do not match', message:''})
            }

         

            user = new UserModel({
              username,
              email,
              password,
             
            })

            await user.save() 
            res.render('index', {message: 'Registration successful', error:''}) 
          

        }   
        else {
          res.render('register' ,{error:"Password should be at least 8 characters long and contain a mixture of numbers, alphabets, and special characters.", message:''});
        }
      }  catch (error) {
        console.log(error)
        res.render('register', {error: error, message:''})
        }
  });



 
   
   
  router.post('/login', async (req, res) => {

    try {
    const {username, password} = req.body;

    const user = await UserModel.findOne({username})

    if(user.username === username && user.password === password) {
      req.session.user = user._id
      res.render('dashboard', {user, message: 'Login successful', error:''})
    }
    else {
      res.render('index',{error: "Invalid credentials", message:''})
    }
  } catch (error) {
    console.log(error);
    res.render('index', {error: "User does not exist", message:''})
  }


  })
     


  /*
      * GET /
      * USER - Payment confirmation
  */
  router.get('/payment',(req, res, next) => {

    try {
     
        res.render('payment', {message: '', error:''})

    
    } catch (error) {
      res.render('pageNotFound')
    }  
  
  })


   



  
  
  /*
  * POST /
  * USER -  LOG-OUT
  */
  
   
   router.get('/logout', (req, res) => {

   req.session.destroy((err) => {
    if(err) throw err;
    res.redirect('/')
   })
  }); 
  
 
  





  router.get('/dashboard', authMiddleware, (req, res) => {
    const user = req.session.user
    res.render('dashboard', {user, message: '', error:''})
  
  })
  router.get('/', (req, res) => {
    res.render('index', {message: '', error:''})
  
  })
  router.get('/pageNotFound', (req, res) => {
    res.render('pageNotFound', {error:""} )
  
  })
  router.get('/slider', (req, res) => {
    res.render('slider')
  
  })

  router.get('/message', (req, res) =>{
    res.render('message', {message: ''})
  })
  router.get('/register', (req, res) =>{
    res.render('register', {message: '', error:''})
  })
  
  module.exports = router;