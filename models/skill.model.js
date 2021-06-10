const pool = require("./db.js"); // get DB connection

const alumniModel = require('./alumni.model.js');

function SkillModel() { }

SkillModel.prototype.getAllSkillsAvailableForAlumni = async function (numeroEstudante) {

    let data = await alumniModel.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") 
    {
        return { kind: data.kind, content: null };
    }

    let select = await pool.query(`SELECT t1.id_skills, t1.tipoSkill FROM Skills t1 WHERE NOT EXISTS (SELECT t2.id_skills FROM Alumni_Skills t2 WHERE t1.id_skills = t2.id_skills AND t2.id_nroEstudante = ?);`, [numeroEstudante]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] }; // array de todos os elementos
};

module.exports = new SkillModel;