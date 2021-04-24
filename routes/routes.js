const express = require('express');
let router = express.Router();
const controller = require('../controllers/controller');
// middleware for all routes related with tutorials
router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

//Ordenar as routas por "/", "/:tutorialID", '/published'
router.route('/')
    .get(controller.home)


router.route('/alumni')
    .get(controller.getAllAlumni)
    .post(controller.createAlumni);

// para eliminar depois ou substituir
//router.route('/:tutorialID')
//    .get(controller.findOne)
//    .delete(controller.delete)
//    .put(controller.update);
// para eliminar depois ou substituir

//router.route('/published')
//    .get(controller.findAll)


//send a predefined error message for invalid routes on TUTORIALS
router.all('*', function(req, res) {
        res.status(404).json({ message: 'Page not found!' });
    })
    // EXPORT ROUTES (required by APP)
module.exports = router;