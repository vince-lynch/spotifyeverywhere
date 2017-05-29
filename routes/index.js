var
express              = require('express'),
router               = express.Router();

// Models
var User = require('../models/User');

// Controllers
var userController = require('../controllers/user');
var contactController = require('../controllers/contact');
var spotifyController = require('../controllers/spotify');



router.use(function(req, res, next) {
  req.isAuthenticated = function() {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token;
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      return false;
    }
  };

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated();
    User.findById(payload.sub, function(err, user) {
      req.user = user;
      next();
    });
  } else {
    next();
  }
});



router.get('/auth/spotify',spotifyController.spotifyAuth);

router.get('/auth/check', function(req, res){
  console.log("req.headers:",req.headers);
})


router.post('/contact', contactController.contactPost);
router.put('/account', userController.ensureAuthenticated, userController.accountPut);
router.delete('/account', userController.ensureAuthenticated, userController.accountDelete);
router.post('/signup', userController.signupPost);
router.post('/login', userController.loginPost);
router.post('/forgot', userController.forgotPost);
router.post('/reset/:token', userController.resetPost);
router.get('/unlink/:provider', userController.ensureAuthenticated, userController.unlink);
router.post('/auth/facebook', userController.authFacebook);
router.get('/auth/facebook/callback', userController.authFacebookCallback);
router.post('/auth/google', userController.authGoogle);
router.get('/auth/google/callback', userController.authGoogleCallback);
router.post('/auth/github', userController.authGithub);
router.get('/auth/github/callback', userController.authGithubCallback);


module.exports = router;