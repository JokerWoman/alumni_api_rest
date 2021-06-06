const express = require('express');
let router = express.Router();
const controller = require('../controllers/testemunha.controller.js');

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
.get(controller.getAllTestimonies)
.post(controller.createTestimony)

router.route('/:testimonyId')
.get(controller.getTestimonyById)
.delete(controller.deleteTestimony)
.put(controller.updateTestimonyById)

//send a predefined error message for invalid routes
router.all('*', function(req, res) {
    res.status(404).json({ message: 'Route não definida!' });
})
// EXPORT ROUTES (required by APP)
module.exports = router;