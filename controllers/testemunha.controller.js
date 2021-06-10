const model = require('../models/model.js')

class Testemunha {
    constructor(nome,id_nroEstudante ,descricao, id_cursos, fotoLink) {
        this.nome = nome;
        this.id_nroEstudante = id_nroEstudante;
        this.descricao = descricao;
        this.id_cursos = id_cursos;
        this.fotoLink = fotoLink;
    }
}

exports.getAllTestimonies = async function(req,res){

    let data = await model.getAllTestimonies()

    if (data.kind === "ok") {
        res.status(200).json({message: JSON.stringify(data.content)});
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Error na operação` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
}

exports.getTestimonyById = async function(req,res){

    let data = await model.getTestimonyById(req.params.testimonyId)

    if (data.kind === "ok") {
        res.status(200).json(data.content);
    } else if (data.kind === "erro_nao_existe") {
        res.status(404).json({ message: `Testemunha não existe!` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
}

exports.deleteTestimony = async function(req,res){

    let id = req.params.testimonyId

    let data = await model.deleteTestimony(id)

    if (data.kind === "ok") {
        res.status(200).json({ message: `Testemunha com o id ${id} foi eliminada com sucesso!` });
    } else if (data.kind === "erro_nao_existe") {
        res.status(404).json({ message: `Testemunha não existe!` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
}

exports.createTestimony = async function(req,res){
    if (!req.body.nome) {
        res.status(400).json({ message: "Name is empty!" });
        return;
    } else if (!req.body.id_nroEstudante) {
        res.status(400).json({ message: "Student number must be sent!" });
        return;
    } else if (!req.body.descricao) {
        res.status(400).json({ message: "Description must be sent!" });
        return;
    } else if (!req.body.id_cursos) {
        res.status(400).json({ message: "Course must be sent!" });
        return;
    } else if (!req.body.fotoLink) {
        res.status(400).json({ message: "Foto link must be sent!" });
        return;
    }

    let testimony = new Testemunha(req.body.nome,req.body.id_nroEstudante, req.body.descricao, req.body.id_cursos, req.body.fotoLink)

    let data = await model.createTestimony(testimony,req.body.id_nroEstudante);

    if (data.kind === "ok") {
        res.status(201).json({ message: "New Testimony created", location: "/testemunhas/" + data.content,dados:data.content[1] });
    } else if (data.kind === "error_testimony_insert") {
        res.status(500).json({ message: `Erro ao inserir Testemunha.` })
    } else if (data.kind === "erro_nroestudante_nao_existe") {
        res.status(404).json({ message: `Numero de estudante não registado na base de dados!` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
}

exports.updateTestimonyById = async function(req,res){

    if (!req.body.nome) {
        res.status(400).json({ message: "Name is empty!" });
        return;
    } else if (!req.body.id_nroEstudante) {
        res.status(400).json({ message: "Student number must be sent!" });
        return;
    } else if (!req.body.descricao) {
        res.status(400).json({ message: "Description must be sent!" });
        return;
    } else if (!req.body.id_cursos) {
        res.status(400).json({ message: "Course must be sent!" });
        return;
    } else if (!req.body.fotoLink) {
        res.status(400).json({ message: "Foto link must be sent!" });
        return;
    }
    let testimony = new Testemunha(req.body.nome,req.body.id_nroEstudante, req.body.descricao, req.body.id_cursos, req.body.fotoLink)

    let id = req.params.testimonyId

    let data = await model.updateTestimony(testimony,req.params.testimonyId);

    if (data.kind === "ok") {
        res.status(201).json({ message: `Testimony with id ${id} updated successfully`});
    } else if (data.kind === "erro_nroestudante_nao_existe") {
        res.status(404).json({ message: `Numero de estudante não registado na base de dados!` })
    } else if (data.kind === "error_nao_existe") {
        res.status(404).json({ message: `Testemunha não existe` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }

}