const linkModel = require('../models/link.model.js');
const validUrl = require('valid-url');

exports.getAllLinksAvailableForAlumni = async function (req, res)  {

    let data = await linkModel.getAllLinksAvailableForAlumni(req.params.numeroEstudante);

    if (data.kind === "ok") {
        res.status(200).json({ message: JSON.stringify(data.content) });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numeroEstudante}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: "Erro a selecionar todos os links disponiveis" })
    }
    else {
        res.status(500).json({ message: "Erro Interno." })
    }
};