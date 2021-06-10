const model = require('../models/evento.model.js');
const validUrl = require('valid-url');

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

class Subscriçao{
    constructor(id_nroEstudante, id_evento) {
        this.id_nroEstudante = id_nroEstudante;
        this.id_evento = id_evento;
    }
}

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
        res.status(200).json({ message: "updated evento ", location: `/evento/${req.params.eventoID}` });
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

exports.subscribeEvent = async function(req , res){

    if (!req.body.id_nroEstudante) {
        res.status(400).json({ message: "numero de estudante is empty!" });
        return;
    }
    if (!req.body.id_evento) {
        res.status(400).json({ message: "Evento is empty!" });
        return;
    }
    let subscription = new Subscricao(req.body.id_nroEstudante, req.body.id_evento);

    let data = await model.subscribeEvent( subscription );

    if (data.kind === "ok") {
        res.status(201).json({ message: "New evento created", location: "/evento/" + data.content });
    } else if (data.kind === "erro_evento_insert") {
        res.status(500).json({ message: `Erro ao inserir evento.` })
    } else if (data.kind === "erro_operacao") {
        res.status(500).json({ message: `Erro na operação de inserir um evento` })
    } else {
        res.status(500).json({ message: `Erro Interno.` })
    }
}
