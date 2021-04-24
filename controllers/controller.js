const model = require('../models/model.js');

class Alumni {
    constructor(id_nroEstudante, nome, dataNascimento, morada, email, fotoLink, telemovel, curriculumPDFLink, password, id_role, id_genero, id_nacionalidade, id_codigoPostal) {
        this.id_nroEstudante = id_nroEstudante;
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

exports.getAllAlumni = (req, res) => {
    model.getAllAlumni((err, data) => {
        if (err) // send error response
            res.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        });
        else
            res.status(200).json(data); // send OK response with all tutorials data
    });
};

exports.createAlumni = (req, res) => {

    // Validar o titulo, descrição e publicação
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
    let alumni = new Alumni(req.body.id_nroEstudante, req.body.nome, req.body.dataNascimento, req.body.morada, req.body.email,
        req.body.fotoLink, req.body.telemovel, req.body.curriculumPDFLink, req.body.password, req.body.id_role,
        req.body.id_genero, req.body.id_nacionalidade, req.body.id_codigoPostal)

    model.createAlumni(alumni, (err, data) => {
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











/* Abaixo são funñçoes que tem que se apagar depois */

exports.findAll = (req, res) => {
    model.getAll((err, data) => {
        if (err) // send error response
            res.status(500).send({
            message: err.message || "Some error occurred while retrieving tutorials."
        });
        else
            res.status(200).json(data); // send OK response with all tutorials data
    });
};

exports.home = (req, res) => {
    res.status(200).json({
        message: "Home "
    });
};

exports.findOne = (req, res) => {
    model.findById(req.params.tutorialID, (err, data) => {
        if (err) {
            if (err.kind === "not_found")
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.tutorialID}.`
                });
            else
                res.status(500).json({
                    message: `Error retrieving Tutorial with id ${req.params.tutorialID}.`
                });
        } else
            res.status(200).json(data);
    });
};

exports.create = (req, res) => {
    // Validar o titulo, descrição e publicação
    if (!req.body) {
        res.status(400).json({ message: "Body is emptu!" });
        return;
    } else if (!req.body.title) {
        res.status(400).json({ message: "Title must be sent!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Description must be sent!" });
        return;
    } else if (!req.body.published) {
        res.status(400).json({ message: "published must be sent!" });
        return;
    }

    // create tutorial: a Tutorial instance based on request data
    let tutorial = new Tutorial(req.body.title, req.body.description, req.body.published ? req.body.published : false)

    model.create(tutorial, (err, data) => {
        if (err) // send error response
            res.status(500).send({
            message: err.message || "Some error occurred while creating the tutorial."
        });
        else
            res.status(201).json({
                message: "New tutorial created",
                location: "/tutorials/" + data.insertId
            });
    });
};


exports.update = (req, res) => {
    // validate request
    if (!req.body) {
        res.status(400).json({ message: "Body is emptu!" });
        return;
    } else if (!req.body.title) {
        res.status(400).json({ message: "Title must be sent!" });
        return;
    } else if (!req.body.description) {
        res.status(400).json({ message: "Description must be sent!" });
        return;
    } else if (!req.body.published) {
        res.status(400).json({ message: "published must be sent!" });
        return;
    }

    // create tutorial: a Tutorial instance based on request data
    let tutorial = new Tutorial(req.body.title, req.body.description, req.body.published ? req.body.published : false)

    model.updateById(tutorial, req.params.tutorialID, (err, data) => {
        if (err) // send error response
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found tutorial with id ${req.params.tutorialID}`
                });
            } else {
                res.status(500).send({
                    message: err.message || "Error updating tutorial with id" + req.params.tutorialID
                });

            }
        else {
            res.status(200).json({
                message: "updated tutorial ",
                location: `/tutorials/${req.params.tutorialID}`
            });
        }

    });
};

exports.delete = (req, res) => {
    model.remove(req.params.tutorialID, (err, data) => {
        console.log(err, data)
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).json({
                    message: `Not found Tutorial with id ${req.params.tutorialID}.`
                });
            } else {
                res.status(500).json({
                    message: `Could not delete Tutorial with id ${req.params.tutorialID}.`
                });
            }
            return;
        }
        res.status(200).json({ message: `Tutorial with id ${req.params.tutorialID} was successfully deleted!` });
        // res.status(204).json({}); //when using a status code 204, must send a NO CONTENT answer
    });
};

exports.findAllPublished = (req, res) => {
    model.getAllPublished = ((err, data) => {
        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            });
        else {
            res.status(200).json(data);
        }
    });
}