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
    .get(authController.verifyToken, authController.isAlumni, alumniController.getAllAlumni);

router.route('/:numero')
    .get(authController.verifyToken, authController.isAlumni, alumniController.findAlumniByNumeroEstudante)
    .put(authController.verifyToken, authController.isAlumni, alumniController.updateAlumniByNumeroEstudante);

router.route('/:numero/skills/')
    .get(authController.verifyToken, authController.isAlumni, alumniController.getSkillsFromNumeroEstudante);

router.route('/:numero/tools/')
    .get(authController.verifyToken, authController.isAlumni, alumniController.getToolsFromNumeroEstudante);

router.route('/:numero/cursos/')
    .get(authController.verifyToken, authController.isAlumni, alumniController.getCursosFromNumeroEstudante);

router.route('/:numero/links/')
    .get(authController.verifyToken, authController.isAlumni, alumniController.getLinksFromNumeroEstudante);


router.route('/:numero/skills/:skillId')
    .delete(authController.verifyToken, authController.isAlumni, alumniController.deleteSkillFromNumeroEstudanteBySkillId)
    .put(authController.verifyToken, authController.isAlumni, alumniController.updateSkillFromNumeroEstudanteBySkillId)
    .post(authController.verifyToken, authController.isAlumni, alumniController.createSkillFromNumeroEstudanteBySkillId);

router.route('/:numero/tools/:toolId')
    .delete(authController.verifyToken, authController.isAlumni, alumniController.deleteToolFromNumeroEstudanteByToolId)
    .put(authController.verifyToken, authController.isAlumni, alumniController.updateToolFromNumeroEstudanteByToolId)
    .post(authController.verifyToken, authController.isAlumni, alumniController.createToolFromNumeroEstudanteByToolId);

router.route('/:numero/cursos/:cursoId')
    .delete(authController.verifyToken, authController.isAlumni, alumniController.deleteCursoFromNumeroEstudanteByCursoId)
    .put(authController.verifyToken, authController.isAlumni, alumniController.updateCursoFromNumeroEstudanteByCursoId)
    .post(authController.verifyToken, authController.isAlumni, alumniController.createCursoFromNumeroEstudanteByCursoId);

router.route('/:numero/links/:linkId')
    .delete(authController.verifyToken, authController.isAlumni, alumniController.deleteLinkFromNumeroEstudanteByLinkId)
    .put(authController.verifyToken, authController.isAlumni, alumniController.updateLinkFromNumeroEstudanteByLinkId)
    .post(authController.verifyToken, authController.isAlumni, alumniController.createLinkFromNumeroEstudanteByLinkId);

//send a predefined error message for invalid routes
router.all('*', function(req, res) {
    res.status(404).json({ message: 'Route Alumni não definida!' });
})

module.exports = router;