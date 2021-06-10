const express = require('express');
let router = express.Router();
const toolController = require('../controllers/tool.controller');
const authController = require('../controllers/auth.controller');

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/alumni/:numeroEstudante/disponiveis').get(authController.verifyToken, authController.isAlumni, toolController.getAllToolsAvailableForAlumni);

//send a predefined error message for invalid routes
router.all('*', function(req, res) {
    res.status(404).json({ message: 'Route Tools não definida!' });
})

module.exports = router;