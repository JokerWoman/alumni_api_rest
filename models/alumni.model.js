const pool = require("./db.js"); // get DB connection

function AlumniModel() { }

AlumniModel.prototype.getAllAlumni = async function (filtros) {

    let filterQuery = " "; /* Espaço é intencional para espaçar o query antes dos filtros */

    if(filtros.nome !== "" && filtros.email !== "")
    {
        filterQuery += `WHERE nome LIKE '%${filtros.nome}%' AND email LIKE '%${filtros.email}%'`;
    }
    else if(filtros.nome !== "")
    {
        filterQuery += `WHERE nome LIKE '%${filtros.nome}%'`;
    }
    else if(filtros.email !== "")
    {
        filterQuery += `WHERE email LIKE '%${filtros.email}%'`;
    }
    
    let select = await pool.query("SELECT id_nroEstudante, nome, DATE_FORMAT(dataNascimento,'%d/%m/%Y') AS dataNascimento, morada, email, descricao, telemovel, id_role, id_genero FROM Alumni" + filterQuery);

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] }; // array de todos os elementos
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

    let select = await pool.query(`SELECT id_nroEstudante, nome, DATE_FORMAT(dataNascimento,'%d/%m/%Y') AS dataNascimento, morada, email, descricao, telemovel, id_role, id_genero FROM Alumni WHERE ?`, { id_nroEstudante: numeroEstudante });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (select[0].length !== 1) {
        return { kind: "not_found", content: null };
    }   

    return { kind: "ok", content: select[0][0] };
};

AlumniModel.prototype.getAlumniPasswordByNumeroEstudante = async function (numeroEstudante) {

    let select = await pool.query('SELECT password FROM Alumni WHERE ?', { id_nroEstudante: numeroEstudante });

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0][0] }; // primeiro elemento do array
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


module.exports = new AlumniModel;