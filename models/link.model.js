const pool = require("./db.js"); // get DB connection

const alumniModel = require('../models/alumni.model.js');

function LinkModel() { }

LinkModel.prototype.getAllLinksAvailableForAlumni = async function (numeroEstudante) {

    let data = await alumniModel.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") 
    {
        return { kind: data.kind, content: null };
    }

    let select = await pool.query(`SELECT t1.id_links, t1.tipoLink FROM Links t1 WHERE NOT EXISTS (SELECT t2.id_links FROM Alumni_Links t2 WHERE t1.id_links = t2.id_links AND t2.id_nroEstudante = ?);`, [numeroEstudante]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] }; // array de todos os elementos
};

module.exports = new LinkModel;