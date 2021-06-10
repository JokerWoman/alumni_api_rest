const alumniModel = require('../models/alumni.model.js');
const validUrl = require('valid-url');

class Alumni {
    constructor(nome, dataNascimento, morada, email, descricao, telemovel, password, id_role, id_genero) {
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.morada = morada;
        this.email = email;
        this.descricao = descricao;
        this.telemovel = telemovel;
        this.password = password;
        this.id_role = id_role;
        this.id_genero = id_genero;
    }
}

exports.getAllAlumni = async function (req, res)  {

    const filtros = {
        nome: (req.query.nome) ? req.query.nome : "",
        email: (req.query.email) ? req.query.email : ""
      };

    let data = await alumniModel.getAllAlumni(filtros);

    if (data.kind === "ok") {
        res.status(200).json({ message: JSON.stringify(data.content) });
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: "Erro a selecionar todos os alumnis" })
    }
    else {
        res.status(500).json({ message: "Erro Interno." })
    }
};

exports.home = async function (req, res)  {
    res.status(200).json({
        message: "Home "
    });
};

exports.findAlumniByNumeroEstudante = async function (req, res) {

    let data = await alumniModel.findAlumniByNumeroEstudante(req.params.numero);

    if (data.kind === "ok") {
        res.status(200).json({ message: JSON.stringify(data.content) });
    }
    else if (data.kind === "not_found") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro a procurar Alumni com id ${req.params.numero}.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.createSkillFromNumeroEstudanteBySkillId = async function (req, res)  {

    if (!req.body || !req.body.percentagem) {
        res.status(400).json({ message: "Percentagem é obrigatorio no body!" });
        return;
    }

    if (!String(req.body.percentagem).match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Percentagem tem que ser maior que zero e um numero positivo' });
        return;
    }

    if (parseInt(req.body.percentagem) > 100) {
        res.status(400).json({ message: 'Percentagem tem que ser menor que 100' });
        return;
    }

    const skill = {
        percentagem: parseInt(req.body.percentagem),
        id_nroEstudante: req.params.numero,
        id_skills: req.params.skillId
    };

    let data = await alumniModel.createSkillFromNumeroEstudanteBySkillId(skill);

    if (data.kind === "ok") {
        res.status(201).json({ message: "Novo Skill criada." });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${skill.id_nroEstudante}.` })
    }
    else if (data.kind === "erro_skill_insert") {
        res.status(404).json({ message: `Erro ao inserir skill com id ${skill.id_skills}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: "Erro na operação de criar a skill" })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};


exports.createToolFromNumeroEstudanteByToolId = async function (req, res)  {

    if (!req.body || !req.body.percentagem) {
        res.status(400).json({ message: "Percentagem é obrigatorio no body!" });
        return;
    }

    if (!String(req.body.percentagem).match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Percentagem tem que ser maior que zero e um numero positivo' });
        return;
    }

    if (parseInt(req.body.percentagem) > 100) {
        res.status(400).json({ message: 'Percentagem tem que ser menor que 100' });
        return;
    }

    const tool = {
        percentagem: parseInt(req.body.percentagem),
        id_nroEstudante: req.params.numero,
        id_tools: req.params.toolId
    };

    let data = await alumniModel.createToolFromNumeroEstudanteByToolId(tool);

    if (data.kind === "ok") {
        res.status(201).json({ message: "Nova tool criada." });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${tool.id_nroEstudante}.` })
    }
    else if (data.kind === "erro_tool_insert") {
        res.status(404).json({ message: `Erro ao inserir tool com id ${tool.id_tools}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de criar a tool` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.createCursoFromNumeroEstudanteByCursoId = async function (req, res)  {

    if (!req.body || !req.body.anoCurso) {
        res.status(400).json({ message: "Ano do curso é obrigatorio no body!" });
        return;
    }
    console.log(req.body.anoCurso)
    if (!String(req.body.anoCurso).match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'o Ano do curso tem que ser maior que zero e um numero positivo' });
        return;
    }

    if (parseInt(req.body.anoCurso) < 2016) {
        res.status(400).json({ message: 'Ano do curso tem que ser mayor a que 2016' });
        return;
    }

    const curso = {
        anoCurso: parseInt(req.body.anoCurso),
        id_nroEstudante: req.params.numero,
        id_cursos: req.params.cursoId
    };

    let data = await alumniModel.createCursoFromNumeroEstudanteByCursoId(curso);

    if (data.kind === "ok") {
        res.status(201).json({ message: "Nova curso criada." });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${curso.id_nroEstudante}.` })
    }
    else if (data.kind === "erro_curso_insert") {
        res.status(404).json({ message: `Erro ao inserir a tool com id ${curso.id_cursos}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de criar o curso.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.createLinkFromNumeroEstudanteByLinkId = async function (req, res)  {
    
    if (!req.body || !req.body.link) {
        res.status(400).json({ message: "link é obrigatorio no body!" });
        return;
    }

    const link = {
        link: req.body.link,
        id_nroEstudante: req.params.numero,
        id_links: req.params.linkId
    };

    let data = await alumniModel.createLinkFromNumeroEstudanteByLinkId(link);

    if (data.kind === "ok") {
        res.status(201).json({ message: "Nova link criado." });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${link.id_nroEstudante}.` })
    }
    else if (data.kind === "erro_link_insert") {
        res.status(404).json({ message: `Erro ao inserir o link com id ${link.id_links}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de criar o link.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.updateSkillFromNumeroEstudanteBySkillId = async function (req, res)  {

    if (!req.body || !req.body.percentagem) {
        res.status(400).json({ message: "Percentagem é obrigatorio no body!" });
        return;
    }

    if (!String(req.body.percentagem).match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Percentagem tem que ser maior que zero e um numero positivo' });
        return;
    }

    if (parseInt(req.body.percentagem) > 100) {
        res.status(400).json({ message: 'Percentagem tem que ser menor que 100' });
        return;
    }

    let data = await alumniModel.updateSkillFromNumeroEstudanteBySkillId(req.params.numero, req.params.skillId, parseInt(req.body.percentagem));

    if (data.kind === "ok") {
        res.status(200).json({ message: "Updated skill" });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_skill_update") {
        res.status(404).json({ message: `Erro no update da skill com id ${req.params.skillId}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de update de uma skill.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.updateToolFromNumeroEstudanteByToolId = async function (req, res)  {

    if (!req.body || !req.body.percentagem) {
        res.status(400).json({ message: "Percentagem é obrigatorio no body!" });
        return;
    }

    if (!String(req.body.percentagem).match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Percentagem tem que ser maior que zero e um numero positivo' });
        return;
    }

    if (parseInt(req.body.percentagem) > 100) {
        res.status(400).json({ message: 'Percentagem tem que ser menor que 100' });
        return;
    }

    let data = await alumniModel.updateToolFromNumeroEstudanteByToolId(req.params.numero, req.params.toolId, parseInt(req.body.percentagem));

    if (data.kind === "ok") {
        res.status(200).json({ message: "Updated tool" });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_tool_update") {
        res.status(500).json({ message: `Erro no update da tool com id ${req.params.toolId}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de update de uma tool` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.updateCursoFromNumeroEstudanteByCursoId = async function (req, res)  {

    if (!req.body || !req.body.anoCurso) {
        res.status(400).json({ message: "Ano Curso é obrigatorio no body!" });
        return;
    }

    if (!String(req.body.anoCurso).match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Ano Curso tem que ser maior que zero e um numero positivo' });
        return;
    }

    if (parseInt(req.body.anoCurso) < 2016) {
        res.status(400).json({ message: 'Ano Curso tem que ser menor que 2016' });
        return;
    }

    let data = await alumniModel.updateCursoFromNumeroEstudanteByCursoId(req.params.numero, req.params.cursoId, parseInt(req.body.anoCurso));

    if (data.kind === "ok") {
        res.status(200).json({ message: "Updated curso" });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_curso_update") {
        res.status(500).json({ message: `Erro no update do curso curso com id ${req.params.cursoId}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de update de um curso.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.updateLinkFromNumeroEstudanteByLinkId = async function (req, res)  {

    if (!req.body || !req.body.link) {
        res.status(400).json({ message: "link é obrigatorio no body!" });
        return;
    }

    if (!validUrl.isUri(req.body.link)) {
        res.status(400).json({ message: 'o link deve ser valido ' });
        return;
    }

    let data = await alumniModel.updateLinkFromNumeroEstudanteByLinkId(req.params.numero, req.params.linkId, req.body.link);

    if (data.kind === "ok") {
        res.status(200).json({ message: "Updated link" });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_link_update") {
        res.status(500).json({ message: `Erro no update do link com id ${req.params.cursoId}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de update de um link.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.deleteSkillFromNumeroEstudanteBySkillId = async function (req, res)  {

    let data = await alumniModel.deleteSkillFromNumeroEstudanteBySkillId(req.params.numero, req.params.skillId);

    if (data.kind === "ok") {
        res.status(200).json({ message: "Deleted skill" });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_skill_delete") {
        res.status(500).json({ message: `Erro no delete da skill com id ${req.params.skillId}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de delete de uma skill.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};


exports.deleteToolFromNumeroEstudanteByToolId = async function (req, res)  {

    let data = await alumniModel.deleteToolFromNumeroEstudanteByToolId(req.params.numero, req.params.toolId);

    if (data.kind === "ok") {
        res.status(200).json({ message: "Deleted tool" });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_tool_delete") {
        res.status(500).json({ message: `Erro no delete da tool com id ${req.params.toolId}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de delete de uma tool.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.deleteCursoFromNumeroEstudanteByCursoId = async function (req, res)  {

    let data = await alumniModel.deleteCursoFromNumeroEstudanteByCursoId(req.params.numero, req.params.cursoId);

    if (data.kind === "ok") {
        res.status(200).json({ message: "Deleted curso" });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_curso_delete") {
        res.status(500).json({ message: `Erro no delete do curso com id ${req.params.cursoId}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de delete de um curso.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.deleteLinkFromNumeroEstudanteByLinkId = async function (req, res)  {

    let data = await alumniModel.deleteLinkFromNumeroEstudanteByLinkId(req.params.numero, req.params.linkId);

    if (data.kind === "ok") {
        res.status(200).json({ message: "Deleted curso" });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro Alumni não exsite com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_link_delete") {
        res.status(500).json({ message: `Erro no delete do link com id ${req.params.cursoId}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de delete de um link.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.getSkillsFromNumeroEstudante = async function (req, res)  {

    let data = await alumniModel.getSkillsFromNumeroEstudante(req.params.numero);

    
    if (data.kind === "ok") {
        res.status(200).json({ message: JSON.stringify(data.content)});
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Error na operação no get das skill do estudante com id ${req.params.numero}.` })
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro alumni não existe com id ${req.params.numero}.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.getToolsFromNumeroEstudante = async function (req, res)  {

    let data = await alumniModel.getToolsFromNumeroEstudante(req.params.numero);

    if (data.kind === "ok") {
        res.status(200).json({ message: JSON.stringify(data.content)});
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Error na operação no get das tools do estudante com id ${req.params.numero}.` })
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro alumni não existe com id ${req.params.numero}.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.getCursosFromNumeroEstudante = async function (req, res)  {

    let data = await alumniModel.getCursosFromNumeroEstudante(req.params.numero);

    if (data.kind === "ok") {
        res.status(200).json({ message: JSON.stringify(data.content)});
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Error na operação no get dos cursos do estudante com id ${req.params.numero}.` })
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro alumni não existe com id ${req.params.numero}.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.getLinksFromNumeroEstudante = async function (req, res)  {

    let data = await alumniModel.getLinksFromNumeroEstudante(req.params.numero);

    if (data.kind === "ok") {
        res.status(200).json({ message: JSON.stringify(data.content) });
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Error na operação no get dos links do estudante com id ${req.params.numero}.` })
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro alumni não existe com id ${req.params.numero}.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};


exports.updateAlumniByNumeroEstudante = async function (req, res)  {
    if (!req.body) {
        res.status(400).json({ message: "Body is empty!" });
        return;
    } else if (!req.body.morada) {
        res.status(400).json({ message: "Morada must be sent!" });
        return;
    } else if (!req.body.descricao) {
        res.status(400).json({ message: "Descricao must be sent!" });
        return;
    } else if (!req.body.telemovel) {
        res.status(400).json({ message: "Telemovel must be sent!" });
        return;
    }

    const alumni = {
        morada: req.body.morada,
        telemovel: req.body.telemovel,
        descricao: req.body.descricao
      };

    let data = await alumniModel.updateAlumniByNumeroEstudante(alumni, req.params.numero);

    if (data.kind === "ok") {
        res.status(200).json({ message: "Updated alumni" });
    }
    else if (data.kind === "alumni_nao_existe") {
        res.status(404).json({ message: `Erro alumni não existe com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_alumni_update") {
        res.status(404).json({ message: `Erro no update do Alumni com id ${req.params.numero}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro de operação no update de um Alumni com id ${req.params.numero}.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};
