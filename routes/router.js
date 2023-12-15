const express = require('express');
const router = express.Router();
const contactController = require('../controller/contactController');
const loginController = require('../controller/loginController')
const articleController = require('../controller/articleController');
const detailArticle = require('../controller/detail-article');


const userImage = require('../controller/user-image')

// const userController = require('../controller/userController')

// Define the route for form submission
router.post('/contact', contactController.submitForm);

router.post('/login', loginController.loginUser);

router.post('/verifyOTP', loginController.verifyOTP);

router.post('/getArticleByCategory', articleController.getArticleByCategory);

router.post('/register', loginController.registerUser);
router.post('/addArticle', articleController.addArticle);
router.get('/getArticles', articleController.getArticles);
router.get('/detail/:id', detailArticle.detailArticleById);

router.put('/update/:id', articleController.updateArticle)



router.get('/allContact', contactController.getData);

router.delete('/articles/:id', articleController.deleteArticle);


// router.get('/getDataMonth', contactController.getMonthlySubmissionCounts);

// router.get('/count', userController.getUniqueVisitorCount);

// router.get('/ip', userController.trackUserVisit);

// router.post('/UploadImageInServer', userImage.uploadImageInServer);



module.exports = router;