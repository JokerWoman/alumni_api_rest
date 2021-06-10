const pool = require("./db.js"); // get DB connection


function BolsaModel() { }

BolsaModel.prototype.BolsaExisteNaBaseDeDados = async function (id) { // todo change the controller

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Bolsa_Emprego WHERE ?', { id_bolsas: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "bolsa_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "bolsa_existe", content: select[0][0].quantidade };
};

BolsaModel.prototype.EmpresaExisteNaBaseDeDados = async function (id) {

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Empresa WHERE ?', { id_empresa: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "empresa_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "empresa_existe", content: select[0][0].quantidade };
};

BolsaModel.prototype.EmpregoExisteNaBaseDeDados = async function (id) {

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Tipo_Emprego WHERE ?', { id_tipoEmprego: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "emprego_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "emprego_existe", content: select[0][0].quantidade };
};

BolsaModel.prototype.getAllBolsas = async function () {

    let select = await pool.query('SELECT * FROM Bolsa_Emprego');

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] };
};

BolsaModel.prototype.createBolsa = async function (bolsa, empresaId, empregoId) {

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

BolsaModel.prototype.deleteBolsa = async function (id) {

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

BolsaModel.prototype.getBolsaById = async function (id) {

    let select = await pool.query('SELECT * FROM Bolsa_Emprego WHERE id_bolsas = ?', [id]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0].length !== 1) {
        return { kind: "not_found", content: null };
    }

    return { kind: "ok", content: select[0] };
};

BolsaModel.prototype.updateBolsaById = async function (bolsa, bolsaId, empresaId, empregoId) {

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




module.exports = new BolsaModel;