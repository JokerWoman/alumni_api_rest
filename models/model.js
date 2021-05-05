const sql = require("./db.js"); // get DB connection

const Model = function() {

};


Model.getAllAlumni = (result) => {
    sql.query("SELECT * FROM Alumni", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Model.createAlumni = (alumni, numeroEstudante, result) => {
    sql.query('INSERT INTO Alumni SET ? , ?', [alumni, { id_nroEstudante: numeroEstudante }], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};


Model.createSkillFromNumeroEstudanteBySkillId = (skill, result) => {
    sql.query('INSERT INTO Alumni_Skills SET ?', skill, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        // affectedRows informs about the number of record(s) deleted
        if (res.affectedRows == 0) {
            // not found Tutorials with the specified ID: setup a new error property 'kind'
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};

Model.updateSkillFromNumeroEstudanteBySkillId = (numeroEstudante, skillId, newPercentagem, result) => {
    sql.query('UPDATE Alumni_Skills SET ? WHERE ? AND ?', [{ percentagem: newPercentagem }, { id_nroEstudante: numeroEstudante }, { id_skills: skillId }], (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        // affectedRows informs about the number of record(s) deleted
        if (res.affectedRows == 0) {
            // not found Tutorials with the specified ID: setup a new error property 'kind'
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};

Model.deleteSkillFromNumeroEstudanteBySkillId = (numeroEstudante, skillId, result) => {
    sql.query('DELETE FROM Alumni_Skills WHERE ? AND ?', [{ id_nroEstudante: numeroEstudante }, { id_skills: skillId }], (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        // affectedRows informs about the number of record(s) deleted
        if (res.affectedRows == 0) {
            // not found Tutorials with the specified ID: setup a new error property 'kind'
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};

Model.getSkillsFromNumeroEstudante = (numeroEstudante, result) => {
    sql.query('SELECT tipoSkill, percentagem FROM Alumni_Skills INNER JOIN Skills ON Skills.id_skills = Alumni_Skills.id_skills WHERE id_nroEstudante = ?', [numeroEstudante], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res);
            return
        }
        result({ kind: "not_found" }, null);
    });
};

Model.findAlumniByNumeroEstudante = (numeroEstudante, result) => {
    sql.query('SELECT * FROM Alumni WHERE id_nroEstudante = ?', [numeroEstudante], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return
        }
        result({ kind: "not_found" }, null);
    });
};


Model.updateAlumniByNumeroEstudante = (alumni, numeroEstudante, result) => {
    sql.query("UPDATE Alumni SET ? WHERE ?", [alumni, { id_nroEstudante: numeroEstudante }], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return
        }
        result(null, res)
    });
};

Model.getAllBolsas = (result) => {
    sql.query("SELECT * FROM Bolsa_Emprego", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Model.createBolsa = (bolsa, result) => {
    sql.query('INSERT INTO Bolsa_Emprego SET ?', bolsa, (err, res) => {
        if (err) {
            result(err, null);
        }
        else {
            result(null, res);
        }
    });
};

Model.deleteBolsa =(id, result) => {
    sql.query('DELETE FROM Bolsa_Emprego WHERE id_bolsas = ?', id, (err,res) =>{
        if(err){
            result(err,null);
        }
        
        result(null, res);
    });
};

Model.getBolsaById = (id, result) =>{
    sql.query('SELECT * FROM Bolsa_Emprego WHERE id_bolsas = ?', [id], (err,res) =>{
        if(err){
            result(err,null);
            return;
        }
        if(res.length){
            result(null,res[0]);
            return
        }
        result({kind: "not_found"}, null);
    });
};

Model.updateBolsaById = (bolsa, id, result) =>{
    sql.query('UPDATE Bolsa_Emprego SET ? WHERE ?', [bolsa,{id_bolsas:id}], (err,res) =>{
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return
        }
        result(null, res)
    });
};

module.exports = Model;