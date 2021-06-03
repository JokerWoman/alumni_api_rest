const pool = require("./db.js"); // get DB connection

function AlumniModel() { }

AlumniModel.prototype.getAllAlumni = async function () {

    let select = await pool.query("SELECT * FROM Alumni");

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] }; // array de todos os elementos
};


AlumniModel.prototype.getAlumniByNumeroEstudante = async function (numeroEstudante) {

    let select = await pool.query('SELECT * FROM Alumni WHERE ?', { id_nroEstudante: numeroEstudante });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0][0] }; // primeiro elemento do array
};

AlumniModel.prototype.createAlumni = async function (alumni, numeroEstudante) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_nao_existe") /* Para criar um alumni, este não pode existir caso contrário temos que dar erro */ {
        return { kind: data.kind, content: null };
    }

    let insertion = await pool.query('INSERT INTO Alumni SET ? , ?', [alumni, { id_nroEstudante: numeroEstudante }]);

    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows == 0) {
        return { kind: "erro_alumni_insert", content: null };
    }
    return { kind: "ok", content: numeroEstudante }; /* No caso do alumni o insertion[0].insertId nunca irá ter o id porque a coluna não existe */
};

AlumniModel.prototype.AlumniExisteNaBaseDeDados = async function (numeroEstudante) {
    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Alumni WHERE ?', { id_nroEstudante: numeroEstudante });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "alumni_nao_existe", content: select[0][0].quantidade }; // alumni não existe
    }

    return { kind: "alumni_existe", content: select[0][0].quantidade }; // alumni existe
};

AlumniModel.prototype.createSkillFromNumeroEstudanteBySkillId = async function (skill) {

    let data = await this.AlumniExisteNaBaseDeDados(skill.id_nroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let insertion = await pool.query('INSERT INTO Alumni_Skills SET ?', skill);

    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows == 0) {
        return { kind: "erro_skill_insert", content: null };
    }

    return { kind: "ok", content: insertion[0].insertId };

};

AlumniModel.prototype.createToolFromNumeroEstudanteByToolId = async function (tool) {

    let data = await this.AlumniExisteNaBaseDeDados(tool.id_nroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let insertion = await pool.query('INSERT INTO Alumni_Tools SET ?', tool);

    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows == 0) {
        return { kind: "erro_tool_insert", content: null };
    }

    return { kind: "ok" , content: insertion[0].insertId};
};


AlumniModel.prototype.createCursoFromNumeroEstudanteByCursoId = async function (curso) {

    let data = await this.AlumniExisteNaBaseDeDados(curso.id_nroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let insertion = await pool.query('INSERT INTO Alumni_Cursos SET ?', curso);

    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows == 0) {
        return { kind: "erro_curso_insert", content: null };
    }

    return { kind: "ok" , content: insertion[0].insertId};
};

AlumniModel.prototype.createLinkFromNumeroEstudanteByLinkId = async function (link) {

    let data = await this.AlumniExisteNaBaseDeDados(link.id_nroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let insertion = await pool.query('INSERT INTO Alumni_Links SET ?', link);

    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows === 0) {
        return { kind: "erro_link_insert", content: null };
    }

    return { kind: "ok" , content: insertion[0].insertId};
};

AlumniModel.prototype.updateSkillFromNumeroEstudanteBySkillId = async function (numeroEstudante, skillId, newPercentagem) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let update = await pool.query('UPDATE Alumni_Skills SET ? WHERE ? AND ?', [{ percentagem: newPercentagem }, { id_nroEstudante: numeroEstudante }, { id_skills: skillId }]);

    if (update === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (update.affectedRows == 0) {
        return { kind: "erro_skill_update", content: null };
    }

    return { kind: "ok", content: update };
};


AlumniModel.prototype.updateToolFromNumeroEstudanteByToolId = async function (numeroEstudante, toolId, newPercentagem) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let update = await pool.query('UPDATE Alumni_Tools SET ? WHERE ? AND ?', [{ percentagem: newPercentagem }, { id_nroEstudante: numeroEstudante }, { id_tools: toolId }]);

    if (update === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (update.affectedRows == 0) {
        return { kind: "erro_tool_update", content: null };
    }

    return { kind: "ok", content: update };

};

AlumniModel.prototype.updateCursoFromNumeroEstudanteByCursoId = async function (numeroEstudante, cursoId, newAno) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let update = await pool.query('UPDATE Alumni_Cursos SET ? WHERE ? AND ?', [{ anoCurso: newAno }, { id_nroEstudante: numeroEstudante }, { id_cursos: cursoId }]);

    if (update === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (update.affectedRows == 0) {
        return { kind: "erro_curso_update", content: null };
    }

    return { kind: "ok", content: update };
};


AlumniModel.prototype.updateLinkFromNumeroEstudanteByLinkId = async function (numeroEstudante, linkId, newLink) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let update = await pool.query('UPDATE Alumni_Links SET ? WHERE ? AND ?', [{ link: newLink }, { id_nroEstudante: numeroEstudante }, { id_links: linkId }]);

    if (update === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (update.affectedRows == 0) {
        return { kind: "erro_link_update", content: null };
    }

    return { kind: "ok", content: update };
};

AlumniModel.prototype.deleteSkillFromNumeroEstudanteBySkillId = async function (numeroEstudante, skillId) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let deleteEntry = await pool.query('DELETE FROM Alumni_Skills WHERE ? AND ?', [{ id_nroEstudante: numeroEstudante }, { id_skills: skillId }]);

    if (deleteEntry === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (deleteEntry.affectedRows == 0) {
        return { kind: "erro_skill_delete", content: null };
    }

    return { kind: "ok", content: deleteEntry };

};

AlumniModel.prototype.deleteToolFromNumeroEstudanteByToolId = async function (numeroEstudante, toolId) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let deleteEntry = await pool.query('DELETE FROM Alumni_Tools WHERE ? AND ?', [{ id_nroEstudante: numeroEstudante }, { id_tools: toolId }]);

    if (deleteEntry === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (deleteEntry.affectedRows == 0) {
        return { kind: "erro_tool_delete", content: null };
    }

    return { kind: "ok", content: deleteEntry };
};

AlumniModel.prototype.deleteCursoFromNumeroEstudanteByCursoId = async function (numeroEstudante, cursoId) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let deleteEntry = await pool.query('DELETE FROM Alumni_Cursos WHERE ? AND ?', [{ id_nroEstudante: numeroEstudante }, { id_cursos: cursoId }]);

    if (deleteEntry === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (deleteEntry.affectedRows == 0) {
        return { kind: "erro_curso_delete", content: null };
    }

    return { kind: "ok", content: deleteEntry };
};

AlumniModel.prototype.deleteLinkFromNumeroEstudanteByLinkId = async function (numeroEstudante, linkId) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let deleteEntry = await pool.query('DELETE FROM Alumni_Links WHERE ? AND ?', [{ id_nroEstudante: numeroEstudante }, { id_links: linkId }]);

    if (deleteEntry === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (deleteEntry.affectedRows == 0) {
        return { kind: "erro_link_delete", content: null };
    }

    return { kind: "ok", content: deleteEntry };
};

AlumniModel.prototype.getSkillsFromNumeroEstudante = async function (numeroEstudante) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let select = await pool.query('SELECT tipoSkill, percentagem FROM Alumni_Skills INNER JOIN Skills ON Skills.id_skills = Alumni_Skills.id_skills WHERE id_nroEstudante = ?', [numeroEstudante]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] };
};

AlumniModel.prototype.getToolsFromNumeroEstudante = async function (numeroEstudante) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let select = await pool.query('SELECT tipoTool, percentagem FROM Alumni_Tools INNER JOIN Tools ON Tools.id_tools = Alumni_Tools.id_tools WHERE id_nroEstudante = ?', [numeroEstudante]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] };
};

AlumniModel.prototype.getCursosFromNumeroEstudante = async function (numeroEstudante) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let select = await pool.query('SELECT tipoCurso, anoCurso FROM Alumni_Cursos INNER JOIN Cursos ON Cursos.id_cursos = Alumni_Cursos.id_cursos WHERE id_nroEstudante = ?', [numeroEstudante]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] };       
};

AlumniModel.prototype.getLinksFromNumeroEstudante = async function (numeroEstudante) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);


    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let select = await pool.query('SELECT tipoLink, link FROM Alumni_Links INNER JOIN Links ON Links.id_links = Alumni_Links.id_links WHERE id_nroEstudante = ?', [numeroEstudante]);

    if (select === null) {

        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] };     
};

AlumniModel.prototype.findAlumniByNumeroEstudante = async function (numeroEstudante) {

    let select = await pool.query('SELECT * FROM Alumni WHERE ?', { id_nroEstudante: numeroEstudante });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0].length !== 1) {
        return { kind: "not_found", content: null };
    }   

    return { kind: "ok", content: select[0] };
};

AlumniModel.prototype.updateAlumniByNumeroEstudante = async function (alumni, numeroEstudante) {

    let data = await this.AlumniExisteNaBaseDeDados(numeroEstudante);

    if (data.kind !== "alumni_existe") {
        return { kind: data.kind, content: null };
    }

    let update = await pool.query('UPDATE Alumni SET ? WHERE ?', [alumni, { id_nroEstudante: numeroEstudante }]);

    if (update === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (update.affectedRows == 0) {
        return { kind: "erro_alumni_update", content: null };
    }

    return { kind: "ok", content: update };
};

AlumniModel.prototype.BolsaExisteNaBaseDeDados = async function (id) { // todo change the controller

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Bolsa_Emprego WHERE ?', { id_bolsas: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "bolsa_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "bolsa_existe", content: select[0][0].quantidade };
};

AlumniModel.prototype.EmpresaExisteNaBaseDeDados = async function (id) {

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Empresa WHERE ?', { id_empresa: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "empresa_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "empresa_existe", content: select[0][0].quantidade };
};

AlumniModel.prototype.EmpregoExisteNaBaseDeDados = async function (id) {

    const select = await pool.query('SELECT COUNT(*) AS quantidade FROM Tipo_Emprego WHERE ?', { id_tipoEmprego: id });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0][0].quantidade !== 1) {
        return { kind: "emprego_nao_existe", content: select[0][0].quantidade };
    }

    return { kind: "emprego_existe", content: select[0][0].quantidade };
};

AlumniModel.prototype.getAllBolsas = async function () {

    let select = await pool.query('SELECT * FROM Bolsa_Emprego');

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] };
};

AlumniModel.prototype.createBolsa = async function (bolsa, empresaId, empregoId) {

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

    return { kind: "ok", content: insertion[0].insertId };
};

AlumniModel.prototype.deleteBolsa = async function (id) {

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

AlumniModel.prototype.getBolsaById = async function (id) {

    let select = await pool.query('SELECT * FROM Bolsa_Emprego WHERE id_bolsas = ?', [id]);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0].length !== 1) {
        return { kind: "not_found", content: null };
    }

    return { kind: "ok", content: select[0] };
};

AlumniModel.prototype.updateBolsaById = async function (bolsa, bolsaId, empresaId, empregoId) {

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

    return { kind: "ok", content: update };
};

AlumniModel.prototype.EventoExisteNaBaseDeDados = async function (id) {

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

AlumniModel.prototype.getAllEventos = async function () {

    let select = await pool.query('SELECT * FROM Evento');

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] };
};

AlumniModel.prototype.createEvento = async function (evento) {

    let insertion = await pool.query('INSERT INTO Evento SET ?', [evento]);

    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows == 0) {
        return { kind: "erro_evento_insert", content: null };
    }

    return { kind: "ok", content: insertion[0].insertId };
};

AlumniModel.prototype.deleteEvento = async function (id) {

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

AlumniModel.prototype.getEventoById = async function (id) {

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

AlumniModel.prototype.updateEventoById = async function (evento, id) {

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


module.exports = new AlumniModel;