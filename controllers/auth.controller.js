const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");
const alumniModel = require('../models/alumni.model.js');

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

exports.signupAlumni = async (req, res) => {
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
    } 

    // create alumni
    let alumni = new Alumni(req.body.nome, req.body.dataNascimento, req.body.morada, req.body.email,
        req.body.fotoLink, req.body.telemovel, req.body.curriculumPDFLink, bcrypt.hashSync(req.body.password, 8), req.body.id_role,
        req.body.id_genero, req.body.id_nacionalidade, req.body.id_codigoPostal)

    let data = await alumniModel.createAlumni(alumni, req.body.id_nroEstudante);
        
    if (data.kind === "ok") {
        res.status(201).json({ message: "New alumni created", location: "/alumni/" + data.content });
    }
    else if (data.kind === "alumni_existe") {
        res.status(417).json({ message: `Erro Alumni já exsite com id ${req.body.id_nroEstudante}.` })
    }
    else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro Alumni de operaão ao criar alumni com id ${req.body.id_nroEstudante}.` })
    }
    else {
        res.status(500).json({ message: `Erro Interno.` })
    }   
};

exports.signinAlumni = async (req, res) => {

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

        if (data.kind === "alumni_nao_existe")
        {
            res.status(417).json({ message: "User não existe." });
            return
        }
        else if (data.kind === "erro_operacao")
        {
            res.status(500).json({ message: "Erro interno." });
            return
        }

        let userData = await alumniModel.getAlumniByNumeroEstudante(req.body.id_nroEstudante)
        
        if (userData.kind !== "ok") 
        {
            res.status(500).send({
                message: "Some error occurred while retrieving alumni."
            });
        }
   
        const passwordIsValid = bcrypt.compareSync(req.body.password, userData.content.password);

        if (!passwordIsValid) {
            res.status(401).json({
                accessToken: null, message: "Invalid Password!"
            });
            return
        }
        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        const token = jwt.sign({ id_nroEstudante: req.body.id_nroEstudante }, config.secret, {
            expiresIn: 86400 // 24 hours
        });
        
       return res.status(200).json({
            id: req.body.id_nroEstudante, // return mais dados para guardar depois no local storage
            accessToken: token
        });


    } catch (err) { 
        return res.status(500).json({ message: err.message }); };
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

//exports.isAdmin = async (req, res, next) => {
//    let user = await User.findByPk(req.loggedUserId);//

//    if (!user)
//    {
//        return res.status(400).json({ message: "Failed! Username does not exist!" });
//    }//

//    let role = await user.getRole();//

//    if (!role){
//        return res.status(400).json({ message: "Failed! Username does not have a role!" });
//    }//

//    if (role.name === "admin")
//    {
//        next();
//    }
//    else{
//        return res.status(403).send({ message: "Require Admin Role!" });
//    }
// };//

//exports.isAdminOrLoggedUser = async (req, res, next) => {
//    let user = await User.findByPk(req.loggedUserId);
//    
//    if (!user){
//        return res.status(400).json({ message: "Failed! Username does not exist!" });
//    }//

//    let role = await user.getRole();//

//    if (!role){
//        return res.status(400).json({ message: "Failed! Username does not have a role!" });
//    }//

//    if (role.name === "admin" || role.name === "user")
//    {
//        next();
//    }
//    else
//    {
//        return res.status(403).send({ message: "Require Admin Role!" });
//    }       
//};

