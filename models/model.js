const pool = require("./db.js"); // get DB connection
const alumniModel = require('./alumni.model.js')

function Model() { }


Model.prototype.getAllTestimonies = async function (){

    let select = await pool.query('SELECT * FROM Testemunha')

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] }
}

Model.prototype.testimonyExists = async function (id){

    let select = await pool.query('SELECT COUNT(*) AS quantity FROM Testemunha WHERE id_testemunha = ?', id)
    
    if (select[0][0].quantity !== 1) {
        return { kind: "Testemuha não existe", content: null };
    }

    return {kind: "ok"}
}

Model.prototype.getTestimonyById = async function (id){

    let testimonyExists = await this.testimonyExists(id)

    if(testimonyExists.kind == "ok"){
        let select = await pool.query('SELECT * FROM Testemunha WHERE id_testemunha = ?',id)

        if (select === null) {
            return { kind: "erro_operacao", content: null };
        }

        return { kind: "ok", content: select[0] }
    }
    else{
        return {kind:"erro_nao_existe", content:null}
    }
}

Model.prototype.deleteTestimony = async function (id) {

    let testimonyExists = await this.testimonyExists(id)

    if(testimonyExists.kind === "ok"){
        let deleteEntry = await pool.query('DELETE FROM Testemunha WHERE id_testemunha = ?',id)
        if(deleteEntry ===  null){
            return {kind:"erro_interno", content: null}
        }
        return {kind: "ok"}
    }
    else{
        return {kind:"erro_nao_existe", content:null}
    }
}

Model.prototype.createTestimony = async function (testimony,id) {

    let data = alumniModel.AlumniExisteNaBaseDeDados(id)

    if(data.kind == "alumni_nao_existe"){
        return { kind: "error_operation", content: null }
    }

    let insertion = await pool.query('INSERT INTO Testemunha SET ?', [testimony])

    if(insertion === null){
        return { kind: "error_operation", content: null }
    }

    if (insertion.affectedRows == 0) {
        return { kind: "error_testimony_insert", content:null};
    }

    return {kind:"ok", content:[insertion[0].insertId,testimony]}
}

Model.prototype.updateTestimony = async function (testimony,id){  

    let exists = alumniModel.AlumniExisteNaBaseDeDados(testimony.id_nroEstudante)

    if(exists.kind != "alumni_existe"){
        return {kind:"erro_nroestudante_nao_existe", content: null}
    }

    let testimonyExists = await this.testimonyExists(id)

    if(testimonyExists.kind == "ok"){

        let update = await pool.query('UPDATE Testemunha SET ? WHERE ?', [testimony, { id_testemunha: id }])

        if(update === null){
            return { kind: "error_operation", content: null }
        }

        if (update.affectedRows == 0) {
            return { kind: "testimony_not_updated", content: null };
        }

        return {kind:"ok",content:update}
    }
    else{
        return {kind:"error_nao_existe", content:null}
    }

}

module.exports = new Model;