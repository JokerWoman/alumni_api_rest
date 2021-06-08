const pool = require("./db.js"); // get DB connection

const alumniModel = require('../models/alumni.model.js');

function CursoModel() { }

CursoModel.prototype.getAllCursosAvailableForAlumni = async function (numeroEstudante) {

    let data = await alumniModel.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") 
    {
        return { kind: data.kind, content: null };
    }

    let select = await pool.query(`SELECT t1.id_cursos, t1.tipoCurso FROM Cursos t1 WHERE NOT EXISTS (SELECT t2.id_cursos FROM Alumni_Cursos t2 WHERE t1.id_cursos = t2.id_cursos AND t2.id_nroEstudante = ?);`, [numeroEstudante]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] }; // array de todos os elementos
};

module.exports = new CursoModel;