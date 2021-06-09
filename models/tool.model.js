const pool = require("./db.js"); // get DB connection

const alumniModel = require('./alumni.model.js');

function ToolModel() { }

ToolModel.prototype.getAllToolsAvailableForAlumni = async function (numeroEstudante) {

    let data = await alumniModel.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") 
    {
        return { kind: data.kind, content: null };
    }

    let select = await pool.query(`SELECT t1.id_tools, t1.tipoTool FROM Tools t1 WHERE NOT EXISTS (SELECT t2.id_tools FROM Alumni_Tools t2 WHERE t1.id_tools = t2.id_tools AND t2.id_nroEstudante = ?);`, [numeroEstudante]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] }; // array de todos os elementos
};

module.exports = new ToolModel;