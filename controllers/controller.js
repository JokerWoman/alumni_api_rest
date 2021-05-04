const model = require('../models/model.js');

class Alumni {
    constructor(nome, dataNascimento, morada, email, fotoLink, telemovel, curriculumPDFLink, password, id_role, id_genero, id_nacionalidade, id_codigoPostal) {
        this.nome = nome;
        this.dataNascimento = dataNascimento;
        this.morada = morada;
        this.email = email;
        this.fotoLink = fotoLink;
        this.telemovel = telemovel;
        this.curriculumPDFLink = curriculumPDFLink;
        this.password = password;
        this.id_role = id_role;
        this.id_genero = id_genero;
        this.id_nacionalidade = id_nacionalidade;
        this.id_codigoPostal = id_codigoPostal;
    }
}

exports.home = (req, res) => {
    res.status(200).json({
        message: "Home "
    });
};

exports.getAllAlumni = (req, res) => {
    model.getAllAlumni((err, data) => {
        if (err) // send error response
            res.status(500).send({
            message: err.message || "Some error occurred while retrieving alumni."
        });
        else
            res.status(200).json(data); // send OK response with all alumni data
    });
};

exports.createAlumni = (req, res) => {

    if (!req.body) {
        res.status(400).json({ message: "Body is empty!" });
        return;
    } else if (!req.body.id_nroEstudante) {
        res.status(400).json({ message: "Id Estudante must be sent!" });
        return;
    } else if (!req.body.nome) {
        res.status(400).json({ message: "Nome Estudante must be sent!" });
        return;
    } else if (!req.body.dataNascimento) {
        res.status(400).json({ message: "Data Nascimento must be sent!" });
        return;
    } else if (!req.body.morada) {
        res.status(400).json({ message: "Morada must be sent!" });
        return;
    } else if (!req.body.email) {
        res.status(400).json({ message: "Email must be sent!" });
        return;
    } else if (!req.body.fotoLink) {
        res.status(400).json({ message: "Foto must be sent!" });
        return;
    } else if (!req.body.telemovel) {
        res.status(400).json({ message: "Telemovel must be sent!" });
        return;
    } else if (!req.body.curriculumPDFLink) {
        res.status(400).json({ message: "Curriculum PDF Link must be sent!" });
        return;
    } else if (!req.body.password) {
        res.status(400).json({ message: "Password must be sent!" });
        return;
    } else if (!req.body.id_role) {
        res.status(400).json({ message: "Role ID must be sent!" });
        return;
    } else if (!req.body.id_genero) {
        res.status(400).json({ message: "Id Genero must be sent!" });
        return;
    } else if (!req.body.id_nacionalidade) {
        res.status(400).json({ message: "Id Nacionalidade must be sent!" });
        return;
    } else if (!req.body.id_codigoPostal) {
        res.status(400).json({ message: "Id codigo postal must be sent!" });
        return;
    }

    // create alumni
    let alumni = new Alumni(req.body.nome, req.body.dataNascimento, req.body.morada, req.body.email,
        req.body.fotoLink, req.body.telemovel, req.body.curriculumPDFLink, req.body.password, req.body.id_role,
        req.body.id_genero, req.body.id_nacionalidade, req.body.id_codigoPostal)

    model.createAlumni(alumni, req.body.id_nroEstudante, (err, data) => {
        if (err) // send error response
            res.status(500).send({
            message: err.message || "Some error occurred while creating the alumni."
        });
        else
            res.status(201).json({
                message: "New alumni created",
                location: "/alumni/" + data.insertId
            });
    });
};

exports.home = (req, res) => {
    res.status(200).json({
        message: "Home "
    });
};

exports.findAlumniByNumeroEstudante = (req, res) => {
    model.findAlumniByNumeroEstudante(req.params.numero, (err, data) => {
        if (err) {
            if (err.kind === "not_found")
                res.status(404).json({
                    message: `Not found Alumni com numero estudante ${req.params.numero}.`
                });
            else
                res.status(500).json({
                    message: `Error retrieving Alumni with id ${req.params.numero}.`
                });
        } else
            res.status(200).json(data);
    });
};

exports.updateSkillFromNumeroEstudanteBySkillId = (req, res) => {

    if (!req.body || !req.body.percentagem) {
        res.status(400).json({ message: "Percentagem é obrigatorio no body!" });
        return;
    }

    if (!req.body.percentagem.match(/^(0|[1-9]\d*)$/g)) {
        res.status(400).json({ message: 'Percentagem tem que ser maior que zero e um numero positivo' });
        return;
    }

    if (parseInt(req.body.percentagem) > 100) {
        res.status(400).json({ message: 'Percentagem tem que ser menor que 100' });
        return;
    }

    model.updateSkillFromNumeroEstudanteBySkillId(req.params.numero, req.params.skillId, parseInt(req.body.percentagem), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `Not found skill with id ${req.params.skillId}.`
                });
            } else {
                res.status(500).json({
                    message: "Error updating skill with id " + req.params.skillId
                });
            }
        } else res.status(200).json({ message: "Updated skill." });
    });
};

exports.deleteSkillFromNumeroEstudanteBySkillId = (req, res) => {
    model.deleteSkillFromNumeroEstudanteBySkillId(req.params.numero, req.params.skillId, (err, data) => {
        if (err) {
            if (err.kind === "not_found")
                res.status(404).json({
                    message: `Não foi encontrado o Alumni com numero estudante ${req.params.numero}.`
                });
            else
                res.status(500).json({
                    message: `Erro no servidor.`
                });
        } else
            res.status(200).json(data);
    });
};

exports.getSkillsFromNumeroEstudante = (req, res) => {
    model.getSkillsFromNumeroEstudante(req.params.numero, (err, data) => {
        if (err) {
            if (err.kind === "not_found")
                res.status(404).json({
                    message: `Não foi encontrado o Alumni com numero estudante ${req.params.numero}.`
                });
            else
                res.status(500).json({
                    message: `Erro no servidor.`
                });
        } else
            res.status(200).json(data);
    });
};


exports.updateAlumniByNumeroEstudante = (req, res) => {

    if (!req.body) {
        res.status(400).json({ message: "Body is empty!" });
        return;
    } else if (!req.body.nome) {
        res.status(400).json({ message: "Nome Estudante must be sent!" });
        return;
    } else if (!req.body.dataNascimento) {
        res.status(400).json({ message: "Data Nascimento must be sent!" });
        return;
    } else if (!req.body.morada) {
        res.status(400).json({ message: "Morada must be sent!" });
        return;
    } else if (!req.body.email) {
        res.status(400).json({ message: "Email must be sent!" });
        return;
    } else if (!req.body.fotoLink) {
        res.status(400).json({ message: "Foto must be sent!" });
        return;
    } else if (!req.body.telemovel) {
        res.status(400).json({ message: "Telemovel must be sent!" });
        return;
    } else if (!req.body.curriculumPDFLink) {
        res.status(400).json({ message: "Curriculum PDF Link must be sent!" });
        return;
    } else if (!req.body.password) {
        res.status(400).json({ message: "Password must be sent!" });
        return;
    } else if (!req.body.id_role) {
        res.status(400).json({ message: "Role ID must be sent!" });
        return;
    } else if (!req.body.id_genero) {
        res.status(400).json({ message: "Id Genero must be sent!" });
        return;
    } else if (!req.body.id_nacionalidade) {
        res.status(400).json({ message: "Id Nacionalidade must be sent!" });
        return;
    } else if (!req.body.id_codigoPostal) {
        res.status(400).json({ message: "Id codigo postal must be sent!" });
        return;
    }

    let alumni = new Alumni(req.body.nome, req.body.dataNascimento, req.body.morada, req.body.email,
        req.body.fotoLink, req.body.telemovel, req.body.curriculumPDFLink, req.body.password, req.body.id_role,
        req.body.id_genero, req.body.id_nacionalidade, req.body.id_codigoPostal)

    model.updateAlumniByNumeroEstudante(alumni, req.params.numero, (err, data) => {
        if (err) // send error response
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found alumni with id ${req.params.numero}`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Error updating alumni with id" + req.params.numero
                });
            }
        else {
            res.status(200).json({
                message: "updated tutorial ",
                location: `/alumni/${req.params.numero}`
            });
        }
    });
};