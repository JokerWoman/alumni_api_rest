const express = require('express');
let router = express.Router();
const controller = require('../controllers/bolsas.controller');
const authController = require('../controllers/auth.controller');
// middleware for all routes related with alumni
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(authController.verifyToken, authController.isProfessorOrAlumni,controller.getAllBolsas)
    .post(authController.verifyToken, authController.isProfessor,controller.createBolsa)

router.route('/:bolsaID')
    .delete(authController.verifyToken, authController.isProfessor,controller.deleteBolsa)
    .get(authController.verifyToken, authController.isProfessorOrAlumni,controller.getBolsaById)
    .put(authController.verifyToken, authController.isProfessor,controller.updateBolsaById)

//send a predefined error message for invalid routes
router.all('*', function(req, res) {
        res.status(404).json({ message: 'Route não definida!' });
    })
    // EXPORT ROUTES (required by APP)
module.exports = router;