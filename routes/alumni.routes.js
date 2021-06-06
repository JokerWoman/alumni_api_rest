const express = require('express');
let router = express.Router();
const alumniController = require('../controllers/alumni.controller');
const authController = require('../controllers/auth.controller');

router.use((req, res, next) => {
    const start = Date.now();
    res.on("finish", () => { //finish event is emitted once the response is sent to the client
        const diffSeconds = (Date.now() - start) / 1000; //figure out how many seconds elapsed
        console.log(`${req.method} ${req.originalUrl} completed in ${diffSeconds} seconds`);
    });
    next()
})

router.route('/')
    .get(authController.verifyToken, authController.isProfessorOrAlumni, alumniController.getAllAlumni);

router.route('/:numero')
    .get(alumniController.findAlumniByNumeroEstudante)
    .put(alumniController.updateAlumniByNumeroEstudante);

router.route('/:numero/skills/')
    .get(alumniController.getSkillsFromNumeroEstudante);

router.route('/:numero/tools/')
    .get(alumniController.getToolsFromNumeroEstudante);

router.route('/:numero/cursos/')
    .get(alumniController.getCursosFromNumeroEstudante);

router.route('/:numero/links/')
    .get(alumniController.getLinksFromNumeroEstudante);


router.route('/:numero/skills/:skillId')
    .delete(alumniController.deleteSkillFromNumeroEstudanteBySkillId)
    .put(alumniController.updateSkillFromNumeroEstudanteBySkillId)
    .post(alumniController.createSkillFromNumeroEstudanteBySkillId);

router.route('/:numero/tools/:toolId')
    .delete(alumniController.deleteToolFromNumeroEstudanteByToolId)
    .put(alumniController.updateToolFromNumeroEstudanteByToolId)
    .post(alumniController.createToolFromNumeroEstudanteByToolId);

router.route('/:numero/cursos/:cursoId')
    .delete(alumniController.deleteCursoFromNumeroEstudanteByCursoId)
    .put(alumniController.updateCursoFromNumeroEstudanteByCursoId)
    .post(alumniController.createCursoFromNumeroEstudanteByCursoId);

router.route('/:numero/links/:linkId')
    .delete(alumniController.deleteLinkFromNumeroEstudanteByLinkId)
    .put(alumniController.updateLinkFromNumeroEstudanteByLinkId)
    .post(alumniController.createLinkFromNumeroEstudanteByLinkId);

//send a predefined error message for invalid routes
router.all('*', function(req, res) {
        res.status(404).json({ message: 'Route Alumni não definida!' });
    })

module.exports = router;