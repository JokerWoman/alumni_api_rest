const pool = require("./db.js"); // get DB connection

function Model() { }

Model.prototype.BolsaExisteNaBaseDeDados = async function (id) { // todo change the controller

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Bolsa_Emprego WHERE ?', { id_bolsas: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "bolsa_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "bolsa_existe", content: select[0][0].quantidade };
};

Model.prototype.EmpresaExisteNaBaseDeDados = async function (id) {

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Empresa WHERE ?', { id_empresa: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "empresa_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "empresa_existe", content: select[0][0].quantidade };
};

Model.prototype.EmpregoExisteNaBaseDeDados = async function (id) {

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Tipo_Emprego WHERE ?', { id_tipoEmprego: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "emprego_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "emprego_existe", content: select[0][0].quantidade };
};

Model.prototype.getAllBolsas = async function () {

    let select = await pool.query('SELECT * FROM Bolsa_Emprego');

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] };
};

Model.prototype.createBolsa = async function (bolsa, empresaId, empregoId) {

    let data = await this.EmpresaExisteNaBaseDeDados(empresaId);

    if (data.kind !== "empresa_existe") {
        return { kind: data.kind, content: null };
    }

    data = await this.EmpregoExisteNaBaseDeDados(empregoId);

    if (data.kind !== "emprego_existe") {
        return { kind: data.kind, content: null };
    }

    let insertion = await pool.query('INSERT INTO Bolsa_Emprego SET ?', bolsa);

    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows == 0) {
        return { kind: "erro_bolsa_insert", content: null };
    }

    return { kind: "ok", content: [insertion[0].insertId, bolsa] };
};

Model.prototype.deleteBolsa = async function (id) {

    let data = await this.BolsaExisteNaBaseDeDados(id);

    if (data.kind !== "bolsa_existe") {
        return { kind: data.kind, content: null };
    }

    let deleteEntry = await pool.query('DELETE FROM Bolsa_Emprego WHERE ?', [{ id_bolsas: id }]);

    if (deleteEntry === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (deleteEntry.affectedRows == 0) {
        return { kind: "erro_bolsa_delete", content: null };
    }

    return { kind: "ok", content: deleteEntry };
};

Model.prototype.getBolsaById = async function (id) {

    let select = await pool.query('SELECT * FROM Bolsa_Emprego WHERE id_bolsas = ?', [id]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0].length !== 1) {
        return { kind: "not_found", content: null };
    }

    return { kind: "ok", content: select[0] };
};

Model.prototype.updateBolsaById = async function (bolsa, bolsaId, empresaId, empregoId) {

    let data = await this.BolsaExisteNaBaseDeDados(bolsaId);

    if (data.kind !== "bolsa_existe") {
        return { kind: data.kind, content: null };
    }

    data = await this.EmpresaExisteNaBaseDeDados(empresaId);

    if (data.kind !== "empresa_existe") {
        return { kind: data.kind, content: null };
    }

    data = await this.EmpregoExisteNaBaseDeDados(empregoId);

    if (data.kind !== "emprego_existe") {
        return { kind: data.kind, content: null };
    }

    let update = await pool.query('UPDATE Bolsa_Emprego SET ? WHERE ?', [bolsa, { id_bolsas: bolsaId }]);

    if (update === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (update.affectedRows == 0) {
        return { kind: "bolsa_nao_updated", content: null };
    }

    return { kind: "ok", content: [update, bolsa] };
};

Model.prototype.EventoExisteNaBaseDeDados = async function (id) {

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Evento WHERE ?', { id_evento: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) 
    {
        return { kind: "evento_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "evento_existe", content: select[0][0].quantidade };
};

Model.prototype.getAllEventos = async function () {

    let select = await pool.query('SELECT * FROM Evento');

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] };
};

Model.prototype.createEvento = async function (evento) {

    let insertion = await pool.query('INSERT INTO Evento SET ?', [evento]);

    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows == 0) {
        return { kind: "erro_evento_insert", content: null };
    }

    return { kind: "ok", content: insertion[0].insertId };
};

Model.prototype.deleteEvento = async function (id) {

    let data = await this.EventoExisteNaBaseDeDados(id);

    if (data.kind !== "evento_existe") {
        return { kind: data.kind, content: null };
    }

    let deleteEntry = await pool.query('DELETE FROM Evento WHERE id_evento = ?', [id]);

    if (deleteEntry === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (deleteEntry.affectedRows == 0) {
        return { kind: "erro_evento_delete", content: null };
    }

    return { kind: "ok", content: deleteEntry };
};

Model.prototype.getEventoById = async function (id) {

    let select = await pool.query('SELECT * FROM Evento WHERE id_evento = ?', [id]);

    if (select === null)
    {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0].length !== 1) {
        return { kind: "not_found", content: null };
    }

    return { kind: "ok", content: select[0] };
};

Model.prototype.updateEventoById = async function (evento, id) {

    let data = await this.EventoExisteNaBaseDeDados(id);

    if (data.kind !== "evento_existe") {
        return { kind: data.kind, content: null };
    }

    let update = await pool.query('UPDATE Evento SET ? WHERE ?', [evento, { id_evento: id }]);

    if (update === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (update.affectedRows == 0) {
        return { kind: "evento_nao_updated", content: null };
    }

    return { kind: "ok", content: update };
};

Model.prototype.getAllTestimonies = async function (){

    let select = await pool.query('SELECT * FROM Testemunha')

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] }
}

Model.prototype.testimonyExists = async function (id){

    let select = await pool.query('SELECT COUNT(*) AS quantity FROM Testemunha WHERE id_testemunha = ?', id)

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }
    
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
            return {kind:"erro_interno"}
        }
        return { kind: "ok"}
    }
    else{
        return {kind:"erro_nao_existe", content:null}
    }
}

Model.prototype.createTestimony = async function (testimony) {

    let insertion = await pool.query('INSERT INTO Testemunha SET ?', [testimony])

    if(insertion === null){
        return { kind: "error_operation", content: null }
    }

    if (insertion.affectedRows == 0) {
        return { kind: "error_testimony_insert", content:null};
    }

    return {kind:"ok", content:insertion[0].insertId}
}

Model.prototype.updateTestimony = async function (testimony,id){  

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