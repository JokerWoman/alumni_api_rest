const pool = require("./db.js"); // get DB connection

function EventoModel() { }

EventoModel.prototype.getAllEventos = async function () {

    let select = await pool.query("SELECT * FROM Evento");

    if (select === null) {
        return { kind: "erro_operacao", content: null };
    }

    return { kind: "ok", content: select[0] }; // array de todos os elementos
};

EventoModel.prototype.EventoExisteNaBaseDeDados = async function (id) {

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



EventoModel.prototype.createEvento = async function (evento) {

    let insertion = await pool.query('INSERT INTO Evento SET ?', [evento]);

    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows == 0) {
        return { kind: "erro_evento_insert", content: null };
    }

    return { kind: "ok", content: insertion[0].insertId };
};

EventoModel.prototype.deleteEvento = async function (id) {

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

EventoModel.prototype.getEventoById = async function (id) {

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

EventoModel.prototype.updateEventoById = async function (evento, id) {

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

EventoModel.prototype.subscribeEvent = async function ( evento ) {
    let data = await this.EventoExisteNaBaseDeDados(evento.id_evento);
    if (data.kind !== "evento_existe") {
        return { kind: data.kind, content: null };
    }

    let insertion = await pool.query('INSERT INTO Alumni_Evento SET ?' , [evento]);
    if (insertion === null) {
        return { kind: "erro_operacao", content: null };
    }

    if (insertion.affectedRows == 0) {
        return { kind: "erro_evento_insert", content: null };
    }

    return { kind: "ok", content: insertion[0].insertId };


}

module.exports = new EventoModel;