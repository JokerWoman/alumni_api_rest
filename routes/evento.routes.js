const express = require('express');
let router = express.Router();
const eventoController = require('../controllers/evento.controller');

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(authController.verifyToken, authController.isProfessorOrAlumni,eventoController.getAllEventos)
    .post(authController.verifyToken, authController.isProfessorOrAlumni,eventoController.createEvento)

router.route('/:eventoID')
    .delete(authController.verifyToken, authController.isProfessorOrAlumni,eventoController.deleteEvento)
    .get(authController.verifyToken, authController.isProfessorOrAlumni,eventoController.getEventoById)
    .put(authController.verifyToken, authController.isProfessorOrAlumni,eventoController.updateEventoById)

router.route('/subscribe')
    .post(eventoController.subscribeEvent)

router.all('*', function(req, res) {
        res.status(404).json({ message: 'Route de eventos não definida!' });
    })
    // EXPORT ROUTES (required by APP)
module.exports = router;