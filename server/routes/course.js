const Course = require('../../models/course')
const SecondCourse = require('../../models/secondCourse')
const User = require('../../models/user')
const RegisteredCourse = require('../../models/registeredCourses')
const CreditLimit = require('../../models/creditLimit')
const SecondCreditLimit = require('../../models/secondCreditLimit')
const Payment = require('../../models/payment')
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();





router.get('/remita', async(req, res) => {

  try {
    const userId = req.session.user;
   
    const ObjectUserId = new mongoose.Types.ObjectId(userId)
    var user = await User.findById({_id: ObjectUserId})
    var level = user.level
  
    
    const courses = await Course.find({level: level})
    const secondCourses = await SecondCourse.find({level: level})

    const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
    const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})
    const limit = await CreditLimit.findOne({userId})
    const secondLimit = await SecondCreditLimit.findOne({userId})
  

    var totalCredit = 0
    var secondTotalCredit = 0
    
    if(limit !== null) {
      totalCredit = limit.totalCredit
    }
    if(secondLimit !== null) {
      secondTotalCredit = secondLimit.totalCredit
    }

    if(user.schoolFeesPayment === 'Paid') {
     return  res.render('coursereg', {message:'', error:'', courses, secondCourses, registeredCourses,secondSemesterRegisteredCourses, totalCredit: totalCredit, secondTotalCredit, level: level})

    }

      res.render('remita', {message: '', error:''})
    }
  
   catch (error) {
    console.log(error)
    res.render('pageNotFound')
  }  

})
router.get('/registered', async(req, res) => {
  const userId = req.session.user

  try {
    const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
    const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})

      res.render('registered', {registeredCourses, secondSemesterRegisteredCourses, message: '', error:''})
    }
  
   catch (error) {
    res.render('pageNotFound')
  }  

})



 /*
      * POST /
      * USER - PAY FEES
  */
router.post('/pay', async(req, res) => {

  const {username, email, phone, level} = req.body
  const userId = req.session.user
  const ObjectUserId = new mongoose.Types.ObjectId(userId)

  try{
    const payment = await Payment({
      userId: userId,
      username: username,
      email: email,
      phone: phone,
      amount: 40000,
      level: level
    })
    payment.save()

    var user = await User.findByIdAndUpdate(ObjectUserId,
      {schoolFeesPayment: 'Paid',
      level: level})
    user.save()
  console.log(user.schoolFeesPayment)

    const courses = await Course.find({level: level})
    const secondCourses = await SecondCourse.find({level: level})

    const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
    const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})

    res.render('coursereg', {totalCredit: '', secondTotalCredit: '', message: 'Payment successful. Proceed to Course Registration', error:'', courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses,level})
  
  }
  catch (error) {
    console.log(error)
    res.render('pageNotFound')
  }  

})



 
 
  /*
      * GET /
      * USER - COURSE REGISTRATION PAGE
  */
  router.get('/coursereg', async(req, res, next) => {

    try {
      if(req.session.authMiddleware) {
        const userId = req.session.user;
        const level = req.session.level;
        const courses = await Course.find({level: level})
        const secondCourses = await SecondCourse.find({level: level})
    
        const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
        const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})

        res.render('coursereg', {totalCredit:'', secondTotalCredit: '', courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses, error:'', message:'', level:''})
      }
    
    } catch (error) {
      res.render('pageNotFound')
    }  
  
  })



  router.post('/select', async(req, res, next) => {
    req.session.level = req.body.level
    const level = req.body.level
   
    const registeredCourseTitle =  req.body.title;
    const userId = req.session.user;
    var totalCredit = 0;
    try {
      const lim = 10

      const hasBeenSelected = await RegisteredCourse.find({userId: userId, title: registeredCourseTitle})

            if(Object.keys(hasBeenSelected).length !== 0) {
                  const courses = await Course.find({level: level}) 
                  const secondCourses = await SecondCourse.find({level: level})
    
                  const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
                  const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})

                  var currentTotal = await CreditLimit.findOne({userId})
                  var secondCurrentTotal = await SecondCreditLimit.findOne({userId})
                  
                  var unit = currentTotal.totalCredit
                  var secondUnit = currentTotal.totalCredit

                  var currentUnit = 0
                  var secondCurrentUnit = 0
                  if (currentTotal == null) {
                      unit = currentUnit
                  } 
                  if (secondCurrentTotal == null) {
                      secondUnit = secondCurrentUnit
                  } 
                   
                  return res.render('coursereg', {totalCredit: unit, secondTotalCredit: secondUnit ,level: level, error: 'Failed to register! Course has already been registered', message: '', courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses})
            } 
            else {

              var currentTotalLimit = await CreditLimit.findOne({userId})
              var courseCredit = req.body.credit;
              courseCredit= parseInt(courseCredit)
              

              if(currentTotalLimit !== null) {
                var unit = parseInt(currentTotalLimit.totalCredit);
                var totalCreditLoad = unit + courseCredit
              
                

                if(totalCreditLoad > lim) {
                  const courses = await Course.find({level: level})
                  const secondCourses = await SecondCourse.find({level: level})

                  const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
                  const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})      

                  const currentLimit = await CreditLimit.findOne({userId}) 
                  const secondCurrentLimit = await SecondCreditLimit.findOne({userId}) 

                  const unit = currentLimit.totalCredit 
                  const secondUnit = secondCurrentLimit.totalCredit 

                        
                  return res.render('coursereg', {totalCredit: unit, secondTotalCredit: secondUnit, level: level ,courses, secondCourses, error: `You cannot register courses above ${lim} credit unit for a semester!`, registeredCourses, secondSemesterRegisteredCourses, message: ''})

                } 

                var limit = await CreditLimit.findOneAndUpdate({userId, 
                  totalCredit: totalCreditLoad
                })
                 
              }
              else{
                var limit = await CreditLimit({
                  userId: userId,
                  totalCredit: courseCredit
                })
                limit.save()
                
              }
            

              const courses = await Course.find({level: level})     
              const secondCourses = await SecondCourse.find({level: level})    

              var registeredCourse = await RegisteredCourse({
              userId: req.session.user,
               level: req.body.level,
               title: req.body.title,
               code: req.body.code,
               credit: req.body.credit,
               semester: req.body.semester,
               nature: req.body.nature,
             })
             registeredCourse.save() 

             var total = await CreditLimit.findOne({userId})
             var secondTotal = await SecondCreditLimit.findOne({userId})

            
               totalCredit = total.totalCredit

               if(secondTotal !== null) {
                var secondTotalCredit = secondTotal.totalCredit

               }
          
   
 
              const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
              const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})
             
             res.render('coursereg', {totalCredit, secondTotalCredit, level: level, courses, secondCourses, message: `${registeredCourse.title} registered successfully!`, registeredCourses, secondSemesterRegisteredCourses, error: ''})
      

            }
                
          } catch (error) {
            console.log(error)
            res.render('pageNotFound')
          }  
  
  })










  router.post('/selectSecondSemesterCourses', async(req, res) => {

        req.session.level = req.body.level
    const level = req.body.level
   
    const registeredCourseTitle =  req.body.title;
    const userId = req.session.user;
    var totalCredit = 0;
    try {
      const lim = 10

      const hasBeenSelected = await RegisteredCourse.find({userId: userId, title: registeredCourseTitle})

            if(Object.keys(hasBeenSelected).length !== 0) {
                  const courses = await Course.find({level: level}) 
                  const secondCourses = await SecondCourse.find({level: level})
    
                  const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
                  const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})

                  var currentTotal = await CreditLimit.findOne({userId})
                  var secondCurrentTotal = await SecondCreditLimit.findOne({userId})
                  
                  var unit = currentTotal.totalCredit
                  var secondUnit = secondCurrentTotal.totalCredit

                 

                  var currentUnit = 0
                  var secondCurrentUnit = 0
                  if (currentTotal == null) {
                      unit = currentUnit
                  } 
                  if (secondCurrentTotal == null) {
                      secondUnit = secondCurrentUnit
                  } 
                   
                  return res.render('coursereg', {totalCredit: unit, secondTotalCredit: secondUnit ,level: level, error: 'Failed to register! Course has already been registered', message: '', courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses})
            } 
            else {

              var currentTotalLimit = await SecondCreditLimit.findOne({userId})
              var courseCredit = req.body.credit;
              courseCredit= parseInt(courseCredit)
              

              if(currentTotalLimit !== null) {
                var unit = parseInt(currentTotalLimit.totalCredit);
                var totalCreditLoad = unit + courseCredit
              
                

                if(totalCreditLoad > lim) {
                  const courses = await Course.find({level: level})
                  const secondCourses = await SecondCourse.find({level: level})

                  const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
                  const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})      

                  const currentLimit = await CreditLimit.findOne({userId}) 
                  const secondCurrentLimit = await SecondCreditLimit.findOne({userId}) 

                  const unit = currentLimit.totalCredit 
                  const secondUnit = secondCurrentLimit.totalCredit 

                    
                  return res.render('coursereg', {totalCredit: unit, secondTotalCredit: secondUnit, level: level ,courses, secondCourses, error: `You cannot register courses above ${lim} credit unit for a semester!`, registeredCourses, secondSemesterRegisteredCourses, message: ''})

                } 

                var limit = await SecondCreditLimit.findOneAndUpdate({userId, 
                  totalCredit: totalCreditLoad
                })
                 
              }
              else{
                var limit = await SecondCreditLimit({
                  userId: userId,
                  totalCredit: courseCredit
                })
                limit.save()
                
              }
            

              const courses = await Course.find({level: level})     
              const secondCourses = await SecondCourse.find({level: level})     
              var registeredCourse = await RegisteredCourse({
              userId: req.session.user,
               level: req.body.level,
               title: req.body.title,
               code: req.body.code,
               credit: req.body.credit,
               semester: req.body.semester,
               nature: req.body.nature,
             })
             registeredCourse.save() 
             
             var total = await CreditLimit.findOne({userId})
             var secondTotal = await SecondCreditLimit.findOne({userId})
              
 
             
             var secondTotalCredit = secondTotal.totalCredit

             if(total !== null) {
              totalCredit = total.totalCredit
             }
   
 
              const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
              const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})
             
             res.render('coursereg', {totalCredit, secondTotalCredit, level: level, courses, secondCourses, message: `${registeredCourse.title} registered successfully!`, registeredCourses, secondSemesterRegisteredCourses, error: ''})
      

            }
                
          } catch (error) {
            console.log(error)
            res.render('pageNotFound')
          }  
  

    
  })

router.post('/deleteCourse', async(req, res) => {
  const userId = req.session.user;
  const level = req.session.level
  const code = req.body.code
  const ObjectUserId = new mongoose.Types.ObjectId(userId)

  try{
 
  const courses = await Course.find({level: level});
  const secondCourses = await SecondCourse.find({level: level}) 

  const deleteCourse = await RegisteredCourse.findOne({userId: ObjectUserId, code: code })

  var courseCredit = deleteCourse.credit
  var credit = parseInt(courseCredit)

   const creditLimit = await CreditLimit.findOne({userId})
   
    var currentCredit = creditLimit.totalCredit
    var currentUnit = parseInt(currentCredit)  
    var newCredit = currentUnit - credit
        
    const deletedCourse = await RegisteredCourse.findOneAndDelete({userId: userId, code: code })

   const newCreditLoad = await CreditLimit.findOneAndUpdate({userId,
      totalCredit: newCredit})
      newCreditLoad.save() 
     
      const updatedLimit = await CreditLimit.findOne({userId})
      const secondUpdatedLimit = await SecondCreditLimit.findOne({userId})

      if(secondUpdatedLimit === null) {
        const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
        const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})
    
      res.render('coursereg', {totalCredit: updatedLimit.totalCredit , secondTotalCredit: 0, level: level, courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses,message:`${deletedCourse.title} deleted successfully!`, error:''} )

      }
      else {
        const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
        const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})
    
      res.render('coursereg', {totalCredit: updatedLimit.totalCredit , secondTotalCredit: secondUpdatedLimit.totalCredit, level: level, courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses,message:`${deletedCourse.title} deleted successfully!`, error:''} ) 
      }
       } catch (error) {
    console.log(error)
  
    const courses = await Course.find({level: level});
    const secondCourses = await SecondCourse.find({level: level})

    const updatedLimit = await CreditLimit.findOne({userId})
    const secondUpdatedLimit = await SecondCreditLimit.findOne({userId})


    const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
    const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})

    res.render('coursereg', {totalCredit: updatedLimit.totalCredit , secondTotalCredit: secondUpdatedLimit.totalCredit, level: level, courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses, message:'', error: 'Error! Course could not be deleted'} )
  }

})




router.post('/deleteSecondCourse', async(req, res) => {
  const userId = req.session.user;
  const level = req.session.level
  const code = req.body.code

  try{
 
  const courses = await Course.find({level: level});
  const secondCourses = await SecondCourse.find({level: level}) 

    const deleteCourse = await RegisteredCourse.findOne({userId: userId, code: code })

  var courseCredit = deleteCourse.credit
  var credit = parseInt(courseCredit)

   const creditLimit = await SecondCreditLimit.findOne({userId})
    var currentCredit = creditLimit.totalCredit
    var currentUnit = parseInt(currentCredit)  
    var newCredit = currentUnit - credit
    
    const deletedCourse = await RegisteredCourse.findOneAndDelete({userId})

   const newCreditLoad = await SecondCreditLimit.findOneAndUpdate({userId,
      totalCredit: newCredit})
      newCreditLoad.save() 

      const updatedLimit = await CreditLimit.findOne({userId})
      const secondUpdatedLimit = await SecondCreditLimit.findOne({userId})


      if(updatedLimit === null) {
        const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
        const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})
     
      res.render('coursereg', {totalCredit: 0, secondTotalCredit: secondUpdatedLimit.totalCredit, level: level, courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses,message:`${deletedCourse.title} deleted successfully!`, error:''} )
  

      }
      else {
        const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
        const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})
     
      res.render('coursereg', {totalCredit: updatedLimit.totalCredit , secondTotalCredit: secondUpdatedLimit.totalCredit, level: level, courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses,message:`${deletedCourse.title} deleted successfully!`, error:''} )  
      }
     } catch (error) {
    console.log(error)
  
    const courses = await Course.find({level: level});
    const secondCourses = await SecondCourse.find({level: level})

    const updatedLimit = await CreditLimit.findOne({userId})
    const secondUpdatedLimit = await SecondCreditLimit.findOne({userId})


    const registeredCourses = await RegisteredCourse.find({userId: userId, semester: '1ST'})
    const secondSemesterRegisteredCourses = await RegisteredCourse.find({userId: userId, semester: '2ND'})

    res.render('coursereg', {totalCredit: updatedLimit.totalCredit , secondTotalCredit: secondUpdatedLimit.totalCredit, level: level, courses, secondCourses, registeredCourses, secondSemesterRegisteredCourses, message:'', error: 'Error! Course could not be deleted'} )
  }

})





router.post('/registered', async (req, res) => {
  const userId = req.session.user
  const level = req.body.level
  const registeredCourses = await RegisteredCourse.find({userId})
  try {
    res.render('registered', {level, registeredCourses, error:'', message:'View registered courses'})
  }catch (error){
    res.render('registered', {courses, registeredCourses, error, message:''})
  }


})



router.post('/course', async(req, res) => {

    try {
    
 function insertCourse() {
    SecondCourse.insertMany([

      {
        level: '100',
        title: "Visual Basic Programming",
        code: "CPT121",
        credit: 3,
        semester: '2ND',
        nature: 'Core',
    },
    {
        level: '100',
        title: "Calculus",
        code: "MAT121",
        credit: 3,
        semester: '2ND',
        nature: 'Core',
    }, 
    {
        level: '100',
        title: "Introduction to Cyber Security",
        code: "CSS121",
        credit: 2,
        semester: '2ND',
        nature: 'Core',
    }, 
    {
        level: 100,
        title: "Mechanics & Thermodynamics",
        code: "PHY121",
        credit: 3,
        semester: '2ND',
        nature: 'Core',
    },

        {
            level: '100',
            title: "Gas Laws",
            code: "PHY123",
            credit: 2,
            semester: '2ND',
            nature: 'Core',
        },
        {
            level: '100',
            title: "Organic Chemistry",
            code: "CHM121",
            credit: 2,
            semester: '2ND',
            nature: 'Core',
        },
        {
            level: '100',
            title: "Biometrics",
            code: "CSS126",
            credit: 2,
            semester: '2ND',
            nature: 'Elective',
        },
        
        {  level: '100',
            title: "Nigerian History",
            code: "GST121",
            credit: 2,
            semester: '2ND',
            nature: 'Elective',
        },
      ])
    }
    
    insertCourse()
 
    res.render('test')
} catch(error) {
    console.log(error)
}

})


module.exports = router