const model = require('../models/model.js');
const validUrl = require('valid-url');

class Bolsa {
    constructor(descricao, fotoLink, estado, data_publicacao, data_inicio, id_empresa, id_tipoEmprego, id_nroProfessor) {
        this.descricao = descricao;
        this.fotoLink = fotoLink;
        this.estado = estado;
        this.data_publicacao = data_publicacao;
        this.data_inicio = data_inicio;
        this.id_empresa = id_empresa;
        this.id_tipoEmprego = id_tipoEmprego;
        this.id_nroProfessor = id_nroProfessor;

    }
}
class Evento {
    constructor(titulo, data, fotoLink, informacao, id_nroProfessor, id_tipoEvento) {
        this.fotoLink = fotoLink;
        this.titulo = titulo;
        this.data = data;
        this.informacao = informacao;
        this.id_nroProfessor = id_nroProfessor;
        this.id_tipoEvento = id_tipoEvento;
    }
}

exports.home = async function(req, res) {
    res.status(200).json({
        message: "Home "
    });
};

exports.getAllBolsas = async function(req, res) {

    let data = await model.getAllBolsas();

    if (data.kind === "ok") {
        const filters = req.query;
        const filteredBolsas = data.content.filter(bolsa => {
            let isValid = true;

            for (filter in filters) {
                if (filter == "estado" || filter == "id_tipoEmprego") {
                    console.log(filter, bolsa[filter], filters[filter])
                    isValid = isValid && bolsa[filter] == filters[filter]
                }
            }

            return isValid;
        });
        res.status(200).json(filteredBolsas); // send OK response with all bolsas data
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Error na operação no get das bolsas.` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.createBolsa = async function(req, res) {

    if (!req.body.descricao) {
        res.status(400).json({ message: "Descricao is empty!" });
        return;
    }
    if (!req.body.fotoLink) {
        res.status(400).json({ message: "Foto must be sent!" });
        return;
    } else if (!req.body.estado) {
        res.status(400).json({ message: "Estado must be sent!" });
        return;
    } else if (!req.body.data_publicacao) {
        res.status(400).json({ message: "Data Publicação must be sent!" });
        return;
    } else if (!req.body.data_inicio) {
        res.status(400).json({ message: "Data Inicio must be sent!" });
        return;
    } else if (!req.body.id_empresa) {
        res.status(400).json({ message: "ID Empresa must be sent!" });
        return;
    } else if (!req.body.id_tipoEmprego) {
        res.status(400).json({ message: "ID Tipo Emprego must be sent!" });
        return;
    } else if (!req.body.id_nroProfessor) {
        res.status(400).json({ message: "ID Nro Professor must be sent!" });
        return;
    }
    let bolsa = new Bolsa(req.body.descricao, req.body.fotoLink, req.body.estado, req.body.data_publicacao,
        req.body.data_inicio, req.body.id_empresa, req.body.id_tipoEmprego, req.body.id_nroProfessor)

    let data = await model.createBolsa(bolsa, req.body.id_empresa, req.body.id_tipoEmprego);

    if (data.kind === "ok") {
        res.status(201).json({ message: "New bolsa created", location: "/bolsas/" + data.content });
    } else if (data.kind === "empresa_nao_existe") {
        res.status(417).json({ message: `Erro a empresa não existe com id ${req.body.id_empresa}.` })
    } else if (data.kind === "emprego_nao_existe") {
        res.status(500).json({ message: `Erro o emprego não existe com id ${req.body.id_tipoEmprego}.` })
    } else if (data.kind === "erro_bolsa_insert") {
        res.status(500).json({ message: `Erro ao inserir bolsa com id ${req.body.id_nroEstudante}.` })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de criar uma bolsa` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.deleteBolsa = async function(req, res) {

    let data = await model.deleteBolsa(req.params.bolsaID);

    if (data.kind === "ok") {
        res.status(200).json({ message: "Bolsa Deleted" });
    } else if (data.kind === "bolsa_nao_existe") {
        res.status(500).json({ message: `Erro a bolsa não existe com id ${req.params.bolsaID}.` })
    } else if (data.kind === "erro_bolsa_delete") {
        res.status(500).json({ message: `Erro no delete da bolsa com id ${req.params.bolsaID}.` })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de delete de uma bolsa com id ${req.params.bolsaID}.` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.getBolsaById = async function(req, res) {

    let data = await model.getBolsaById(req.params.bolsaID);

    if (data.kind === "ok") {
        res.status(200).json({ message: data.content });
    } else if (data.kind === "not_found") {
        res.status(404).json({ message: `Erro a bolsa não existe com id ${req.params.bolsaID}.` })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de get da bolsa com id ${req.params.bolsaID}.` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.updateBolsaById = async function(req, res) {

    if (!req.body.descricao) {
        res.status(400).json({ message: "Descricao is empty!" });
        return;
    }
    if (!req.body.fotoLink) {
        res.status(400).json({ message: "Foto must be sent!" });
        return;
    } else if (!req.body.estado) {
        res.status(400).json({ message: "Estado must be sent!" });
        return;
    } else if (!req.body.data_publicacao) {
        res.status(400).json({ message: "Data Publicação must be sent!" });
        return;
    } else if (!req.body.data_inicio) {
        res.status(400).json({ message: "Data Inicio must be sent!" });
        return;
    } else if (!req.body.id_empresa) {
        res.status(400).json({ message: "ID Empresa must be sent!" });
        return;
    } else if (!req.body.id_tipoEmprego) {
        res.status(400).json({ message: "ID Tipo Emprego must be sent!" });
        return;
    } else if (!req.body.id_nroProfessor) {
        res.status(400).json({ message: "ID Nro Professor must be sent!" });
        return;
    }
    let bolsa = new Bolsa(req.body.descricao, req.body.fotoLink, req.body.estado, req.body.data_publicacao,
        req.body.data_inicio, req.body.id_empresa, req.body.id_tipoEmprego, req.body.id_nroProfessor)

    let data = await model.updateBolsaById(bolsa, req.params.bolsaID, req.body.id_empresa, req.body.id_tipoEmprego);

    if (data.kind === "ok") {
        res.status(200).json({ message: "updated bolsas ", location: `/bolsas/${req.params.bolsaID}` });
    } else if (data.kind === "bolsa_nao_existe") {
        res.status(417).json({ message: `Erro bolsa não existe com id ${req.params.bolsaID}.` })
    } else if (data.kind === "emprego_nao_existe") {
        res.status(500).json({ message: `Erro emprego não existe com id ${req.body.id_tipoEmprego}.` })
    } else if (data.kind === "empresa_nao_existe") {
        res.status(500).json({ message: `Erro empresa não existe com id ${req.body.id_empresa}.` })
    } else if (data.kind === "bolsa_nao_updated") {
        res.status(500).json({ message: `Erro no update da bolsa com id ${req.params.bolsaID}.` })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de update de bolsa com id ${req.params.bolsaID}.` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.getAllEventos = async function(req, res) {

    let data = await model.getAllEventos();

    if (data.kind === "ok") {
        res.status(200).json(data.content);
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Error na operação no get dos eventos` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};
exports.createEvento = async function(req, res) {

    if (!req.body.titulo) {
        res.status(400).json({ message: "Titulo is empty!" });
        return;
    }
    if (!req.body.fotoLink) {
        res.status(400).json({ message: "Foto must be sent!" });
        return;
    } else if (!req.body.data) {
        res.status(400).json({ message: "Data must be sent!" });
        return;
    } else if (!req.body.informacao) {
        res.status(400).json({ message: "Informação must be sent!" });
        return;
    } else if (!req.body.id_tipoEvento) {
        res.status(400).json({ message: "ID Tipo Evento must be sent!" });
        return;
    } else if (!req.body.id_nroProfessor) {
        res.status(400).json({ message: "ID Nro Professor must be sent!" });
        return;
    }

    let evento = new Evento(req.body.titulo, req.body.data, req.body.fotoLink, req.body.informacao, req.body.id_nroProfessor, req.body.id_tipoEvento)

    let data = await model.createEvento(evento);

    if (data.kind === "ok") {
        res.status(201).json({ message: "New evento created", location: "/eventos/" + data.content });
    } else if (data.kind === "erro_evento_insert") {
        res.status(500).json({ message: `Erro ao inserir evento.` })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de inserir um evento` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.deleteEvento = async function(req, res) {

    let data = await model.deleteEvento(req.params.eventoID);

    if (data.kind === "ok") {
        res.status(200).json({ message: `Evento with id ${req.params.eventoID} was successfully deleted!` });
    } else if (data.kind === "evento_nao_existe") {
        res.status(500).json({ message: `Erro o evento não existe com id ${req.params.eventoID}.` })
    } else if (data.kind === "erro_evento_delete") {
        res.status(500).json({ message: `Erro no delete do evento com id ${req.params.eventoID}.` })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de delete de um evento com id ${req.params.eventoID}.` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.getEventoById = async function(req, res) {
    let data = await model.getEventoById(req.params.eventoID);

    if (data.kind === "ok") {
        res.status(200).json({ message: data.content });
    } else if (data.kind === "not_found") {
        res.status(404).json({ message: `Erro o evento não foi encontrado com id ${req.params.eventoID}.` })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de get de evento com id ${req.params.eventoID}.` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};

exports.updateEventoById = async function(req, res) {

    if (!req.body.titulo) {
        res.status(400).json({ message: "Titulo is empty!" });
        return;
    }
    if (!req.body.fotoLink) {
        res.status(400).json({ message: "Foto must be sent!" });
        return;
    } else if (!req.body.data) {
        res.status(400).json({ message: "Data must be sent!" });
        return;
    } else if (!req.body.informacao) {
        res.status(400).json({ message: "Informação must be sent!" });
        return;
    } else if (!req.body.id_tipoEvento) {
        res.status(400).json({ message: "ID Tipo Evento must be sent!" });
        return;
    } else if (!req.body.id_nroProfessor) {
        res.status(400).json({ message: "ID Nro Professor must be sent!" });
        return;
    }

    let evento = new Evento(req.body.titulo, req.body.data, req.body.fotoLink, req.body.informacao, req.body.id_nroProfessor, req.body.id_tipoEvento)

    let data = await model.updateEventoById(evento, req.params.eventoID);

    if (data.kind === "ok") {
        res.status(200).json({ message: "updated evento ", location: `/eventos/${req.params.eventoID}` });
    } else if (data.kind === "evento_nao_existe") {
        res.status(404).json({ message: `Erro evento não existe com id ${req.params.eventoID}.` })
    } else if (data.kind === "evento_nao_updated") {
        res.status(500).json({ message: "Error no update do evento com id" + req.params.eventoID })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de update de evento com id ${req.params.eventoID}.` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
};