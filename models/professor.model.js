const pool = require("./db.js"); // get DB connection

function ProfessorModel() { }

ProfessorModel.prototype.ProfessorExisteNaBaseDeDados = async function (numeroProfessor) {
    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Professor WHERE ?', { id_nroProfessor: numeroProfessor });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "professor_nao_existe", content: select[0][0].quantidade }; // professor não existe
    }

    return { kind: "professor_existe", content: select[0][0].quantidade }; // professor existe
};

ProfessorModel.prototype.findProfessorByNumeroProfessor = async function (numeroProfessor) {

    let select = await pool.query(`SELECT id_nroProfessor, nome, email, telemovel FROM Professor WHERE ?`, { id_nroProfessor: numeroProfessor });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0].length !== 1) {
        return { kind: "not_found", content: null };
    }   

    return { kind: "ok", content: select[0][0] };
};

ProfessorModel.prototype.getProfessorPasswordByNumeroProfessor = async function (numeroProfessor) {

    let select = await pool.query('SELECT password FROM Professor WHERE ?', { id_nroProfessor: numeroProfessor });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0][0] }; // primeiro elemento do array
};


module.exports = new ProfessorModel;