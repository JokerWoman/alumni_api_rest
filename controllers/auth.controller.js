const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");
const alumniModel = require('../models/alumni.model.js');
const professorModel = require('../models/professor.model.js');

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

exports.signupAlumni = async(req, res) => {
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
    } else if (!req.body.descricao) {
        res.status(400).json({ message: "Descricao must be sent!" });
        return;
    } else if (!req.body.telemovel) {
        res.status(400).json({ message: "Telemovel must be sent!" });
        return;
    } else if (!req.body.password) {
        res.status(400).json({ message: "Password must be sent!" });
        return;
    }

    // create alumni
    let alumni = new Alumni(req.body.nome, req.body.dataNascimento, req.body.morada, req.body.email,
        req.body.descricao, req.body.telemovel, bcrypt.hashSync(req.body.password, 8), req.body.id_role,
        req.body.id_genero)

    let data = await alumniModel.createAlumni(alumni, req.body.id_nroEstudante);

    if (data.kind === "ok") {
        res.status(201).json({ message: data.content });
    } else if (data.kind === "alumni_existe") {
        res.status(417).json({ message: `Erro Alumni já exsite com id ${req.body.id_nroEstudante}.` })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro Alumni de operaão ao criar alumni com id ${req.body.id_nroEstudante}.` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.signinProfessor = async(req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ message: "Body is empty!" });
            return;
        } else if (!req.body.id_nroProfessor) {
            res.status(400).json({ message: "Id Professor must be sent!" });
            return;
        } else if (!req.body.password) {
            res.status(400).json({ message: "Password must be sent!" });
            return;
        }

        /* Verificar se o utilizador existe */
        let data = await professorModel.ProfessorExisteNaBaseDeDados(req.body.id_nroProfessor);

        if (data.kind === "professor_nao_existe") {
            res.status(417).json({ message: "Professor não existe." });
            return
        } else if (data.kind === "erro_operacao") {
            res.status(500).json({ message: "Erro interno." });
            return
        }

        let userData = await professorModel.getProfessorPasswordByNumeroProfessor(req.body.id_nroProfessor)

        if (userData.kind !== "ok") {
            res.status(500).send({
                message: "Some error occurred while retrieving alumni."
            });
        }

        const passwordIsValid = bcrypt.compareSync(req.body.password, userData.content.password);

        if (!passwordIsValid) {
            res.status(401).json({
                accessToken: null,
                message: "Invalid Password!"
            });
            return
        }
        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        const token = jwt.sign({ id: req.body.id_nroProfessor }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        return res.status(200).json(JSON.stringify({
            id: req.body.id_nroProfessor, // return mais dados para guardar depois no local storage
            userType: "professor",
            accessToken: token
        }));


    } catch (err) {
        return res.status(500).json({ message: err.message });
    };
};

exports.signinAlumni = async(req, res) => {
    try {
        if (!req.body) {
            res.status(400).json({ message: "Body is empty!" });
            return;
        } else if (!req.body.id_nroEstudante) {
            res.status(400).json({ message: "Id Estudante must be sent!" });
            return;
        } else if (!req.body.password) {
            res.status(400).json({ message: "Password must be sent!" });
            return;
        }

        /* Verificar se o utilizador existe */
        let data = await alumniModel.AlumniExisteNaBaseDeDados(req.body.id_nroEstudante);

        if (data.kind === "alumni_nao_existe") {
            res.status(417).json({ message: "User não existe." });
            return
        } else if (data.kind === "erro_operacao") {
            res.status(500).json({ message: "Erro interno." });
            return
        }

        let userData = await alumniModel.getAlumniPasswordByNumeroEstudante(req.body.id_nroEstudante)

        if (userData.kind !== "ok") {
            res.status(500).send({
                message: "Some error occurred while retrieving alumni."
            });
        }



        const passwordIsValid = bcrypt.compareSync(req.body.password, userData.content.password);

        if (!passwordIsValid) {
            res.status(401).json({
                accessToken: null,
                message: "Invalid Password!"
            });
            return
        }
        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        const token = jwt.sign({ id: req.body.id_nroEstudante }, config.secret, {
            expiresIn: 86400 // 24 hours
        });

        return res.status(200).json(JSON.stringify({
            id: req.body.id_nroEstudante, // return mais dados para guardar depois no local storage
            userType: "alumni",
            accessToken: token
        }));


    } catch (err) {
        return res.status(500).json({ message: err.message });
    };
};

exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({
            message: "No token provided!"
        });
    }
    // verify request token given the JWT secret key
    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.loggedUserId = decoded.id; // save user ID for future verifications
        next();
    });
};

exports.isAlumni = async(req, res, next) => {
    let tipoUser = req.headers["user-type"];

    if (!tipoUser) {
        return res.status(403).send({
            message: "O tipo de utilizador não foi fornecido!"
        });
    } else if (tipoUser !== "alumni") {
        return res.status(403).send({
            message: "O tipo de utilizador têm que ser obrigatóriamente alumni para aceder a esta route!"
        });
    }

    let userData = await alumniModel.AlumniExisteNaBaseDeDados(req.loggedUserId)

    if (userData.kind === "alumni_existe") {
        next();
    } else if (userData.kind === "alumni_nao_existe") {
        res.status(500).send({
            message: `O alumni com id: ${req.loggedUserId} não existe.`
        });
    } else {
        res.status(500).send({
            message: `Erro a verificar se o alumni é valido.`
        });
    }
};

exports.isProfessor = async(req, res, next) => {
    let tipoUser = req.headers["user-type"];

    if (!tipoUser) {
        return res.status(403).send({
            message: "O tipo de utilizador não foi fornecido!"
        });
    } else if (tipoUser !== "professor") {
        return res.status(403).send({
            message: "O tipo de utilizador têm que ser obrigatóriamente professor para aceder a esta route!"
        });
    }

    let userData = await professorModel.ProfessorExisteNaBaseDeDados(req.loggedUserId)

    if (userData.kind === "professor_existe") {
        next();
    } else if (userData.kind === "professor_nao_existe") {
        res.status(500).send({
            message: `O professor com id: ${req.loggedUserId} não existe.`
        });
    } else {
        res.status(500).send({
            message: `Erro a verificar se o professor é valido.`
        });
    }
};

exports.isProfessorOrAlumni = async(req, res, next) => {

    let tipoUser = req.headers["user-type"];

    if (!tipoUser) {
        return res.status(403).send({
            message: "O tipo de utilizador não foi fornecido!"
        });
    } else if (tipoUser !== "alumni" && tipoUser !== "professor") {
        return res.status(403).send({
            message: "O tipo de utilizador têm que ser alumni ou professor!"
        });
    } else if (tipoUser === "alumni") {
        let userData = await alumniModel.AlumniExisteNaBaseDeDados(req.loggedUserId)

        if (userData.kind === "alumni_existe") {
            next();
        } else if (userData.kind === "alumni_nao_existe") {
            res.status(500).send({
                message: `O alumni com id: ${req.loggedUserId} não existe.`
            });
        } else {
            res.status(500).send({
                message: `Erro a verificar se o alumni é valido.`
            });
        }
    } else if (tipoUser === "professor") {
        let userData = await professorModel.ProfessorExisteNaBaseDeDados(req.loggedUserId)

        if (userData.kind === "professor_existe") {
            next();
        } else if (userData.kind === "professor_nao_existe") {
            res.status(500).send({
                message: `O professor com id: ${req.loggedUserId} não existe.`
            });
        } else {
            res.status(500).send({
                message: `Erro a verificar se o professor é valido.`
            });
        }
    }
};