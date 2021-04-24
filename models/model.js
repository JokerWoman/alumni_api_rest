const sql = require("./db.js"); // get DB connection

const Tutorial = function(title, description, published) {
    this.title = title;
    this.description = description;
    this.published = published;
};


Tutorial.getAllAlumni = (result) => {
    sql.query("SELECT * FROM Alumni", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res); // the result will be sent to the CONTROLLER
    });
};

Tutorial.createAlumni = (alumni, result) => {
    sql.query('INSERT INTO Alumni SET ?', alumni, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};





/* Abaixo são funñçoes que tem que se apagar depois */

// define method getAll to handle getting all Tutorials from DB
// result = "(error, data)", meaning it will return either an error message or some sort of data
Tutorial.getAll = (result) => {
    sql.query("SELECT * FROM tutorials", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res); // the result will be sent to the CONTROLLER
    });
};

Tutorial.findById = (id, result) => {
    sql.query('SELECT * FROM tutorials WHERE id = ?', [id], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.length) {
            result(null, res[0]);
            return
        }
        result({ kind: "not_found" }, null);
    });
};

Tutorial.create = (tutorial, result) => {
    sql.query('INSERT INTO tutorials SET ?', tutorial, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Tutorial.updateById = (tutorial, id, result) => {
    sql.query("UPDATE tutorials SET ? WHERE ?", [tutorial, { id: id }], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {
            result({ kind: "not_found" }, null);
            return
        }
        result(null, res)
    });
};

Tutorial.getAllPublished = (result) => {
    sql.query("SELECT * FROM tutorials WHERE published = true", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res); // the result will be sent to the CONTROLLER
    });
};
Tutorial.remove = (id, result) => {
    sql.query("DELETE FROM tutorials WHERE id = ?", id, (err, res) => {
        if (err) {
            result(null, err);
            return;
        }
        // affectedRows informs about the number of record(s) deleted
        if (res.affectedRows == 0) {
            // not found Tutorials with the specified ID: setup a new error property 'kind'
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res);
    });
};
// EXPORT MODEL (required by CONTROLLER)
module.exports = Tutorial;