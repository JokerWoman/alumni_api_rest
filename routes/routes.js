const express = require('express');
let router = express.Router();
const controller = require('../controllers/controller');
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
    .get(controller.home)

router.route('/alumni')
    .get(controller.getAllAlumni)
    .post(controller.createAlumni);

router.route('/alumni/:numero')
    .get(controller.findAlumniByNumeroEstudante)
    .put(controller.updateAlumniByNumeroEstudante);

router.route('/alumni/:numero/skills/')
    .get(controller.getSkillsFromNumeroEstudante);

router.route('/alumni/:numero/tools/')
    .get(controller.getToolsFromNumeroEstudante);

router.route('/alumni/:numero/cursos/')
    .get(controller.getCursosFromNumeroEstudante);

router.route('/alumni/:numero/skills/:skillId')
    .delete(controller.deleteSkillFromNumeroEstudanteBySkillId)
    .put(controller.updateSkillFromNumeroEstudanteBySkillId)
    .post(controller.createSkillFromNumeroEstudanteBySkillId);

router.route('/alumni/:numero/tools/:toolId')
    .delete(controller.deleteToolFromNumeroEstudanteByToolId)
    .put(controller.updateToolFromNumeroEstudanteByToolId)
    .post(controller.createToolFromNumeroEstudanteByToolId);

router.route('/alumni/:numero/cursos/:cursoId')
    .delete(controller.deleteToolFromNumeroEstudanteByCursoId)
    .put(controller.updateCursoFromNumeroEstudanteByCursoId)
    .post(controller.createCursoFromNumeroEstudanteByCursoId);

router.route('/bolsas')
    .get(controller.getAllBolsas)
    .post(controller.createBolsa)

router.route('/bolsas/:bolsaID')
    .delete(controller.deleteBolsa)
    .get(controller.getBolsaById)
    .put(controller.updateBolsaById)

//send a predefined error message for invalid routes
router.all('*', function(req, res) {
        res.status(404).json({ message: 'Page not found!' });
    })
    // EXPORT ROUTES (required by APP)
module.exports = router;