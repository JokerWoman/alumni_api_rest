const express = require('express');
let router = express.Router();
const alumniController = require('../controllers/evento.controller');

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/eventos')
    .get(controller.getAllEventos)
    .post(controller.createEvento)  

router.route('/eventos/:eventoID')
    .delete(controller.deleteEvento)
    .get(controller.getEventoById)
    .put(controller.updateEventoById)   

    
    router.all('*', function(req, res) {
        res.status(404).json({ message: 'Route de eventos não definida!' });
    })
    // EXPORT ROUTES (required by APP)
module.exports = router;