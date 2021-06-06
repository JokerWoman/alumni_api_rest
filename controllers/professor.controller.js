const professorModel = require('../models/professor.model.js');
const validUrl = require('valid-url');

exports.findProfessorByNumeroProfessor = async function (req, res) {

    let data = await professorModel.findProfessorByNumeroProfessor(req.params.numeroProfessor);

    if (data.kind === "ok") {
        res.status(200).json({ message: JSON.stringify(data.content) });
    }
    else if (data.kind === "not_found") {
        res.status(404).json({ message: `Erro Professor não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro a procurar Professor com id ${req.params.numero}.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};
