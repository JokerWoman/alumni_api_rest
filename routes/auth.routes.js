const express = require('express');
const authController = require("../controllers/auth.controller");
let router = express.Router();

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
    next()
})

router.route('/signup/alumni').post(authController.signupAlumni);
router.route('/signin/alumni').post(authController.signinAlumni)

router.all('*', function(req, res) {
    res.status(404).json({ message: 'Route não definida!' });
})

module.exports = router;
