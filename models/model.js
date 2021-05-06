const sql = require("./db.js"); // get DB connection

const Model = function() {

};

Model.getAllAlumni = (result) => {
    sql.query("SELECT * FROM Alumni", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Model.createAlumni = (alumni, numeroEstudante, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 0) {
                sql.query('INSERT INTO Alumni SET ? , ?', [alumni, { id_nroEstudante: numeroEstudante }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                    } else {
                        result(null, res);
                    }
                });
            } else {
                result({ kind: "erro_alumni_ja_existe" }, null);
            }
        } else {
            result = (erro, data)
        }
    });
};

Model.AlumniExisteNaBaseDeDados = (numeroEstudante, resultado) => {
    sql.query('SELECT COUNT(*) AS quantidade FROM Alumni WHERE ?', { id_nroEstudante: numeroEstudante }, (err, res) => {
        if (err) {
            resultado({ kind: "erro_operacao" }, null);
            return;
        }
        resultado(null, { quantidade: res[0].quantidade });
    });
};

Model.createSkillFromNumeroEstudanteBySkillId = (skill, result) => {
    Model.AlumniExisteNaBaseDeDados(skill.id_nroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('INSERT INTO Alumni_Skills SET ?', skill, (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }
                    if (res.affectedRows == 0) {
                        result({ kind: "skill_nao_inserida" }, null);
                        return;
                    }
                    result(null, res);
                });
            } else {
                result({ kind: "not_found_alumni" }, null);
            }
        } else {
            result = (erro, data)
        }
    });
};

Model.createToolFromNumeroEstudanteByToolId = (tool, result) => {
    Model.AlumniExisteNaBaseDeDados(tool.id_nroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('INSERT INTO Alumni_Tools SET ?', tool, (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }
                    if (res.affectedRows == 0) {
                        result({ kind: "tool_nao_inserida" }, null);
                        return;
                    }
                    result(null, res);
                });
            } else {
                result({ kind: "not_found_alumni" }, null);
            }
        } else {
            result = (erro, data)
        }
    });
};

Model.updateSkillFromNumeroEstudanteBySkillId = (numeroEstudante, skillId, newPercentagem, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('UPDATE Alumni_Skills SET ? WHERE ? AND ?', [{ percentagem: newPercentagem }, { id_nroEstudante: numeroEstudante }, { id_skills: skillId }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "skill_nao_updated" }, null);
                        return;
                    }
                    result(null, res);
                });
            } else {
                result({ kind: "not_found_alumni" }, null);
            }
        } else {
            result = (erro, data)
        }
    });

};


Model.updateToolFromNumeroEstudanteByToolId = (numeroEstudante, toolId, newPercentagem, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('UPDATE Alumni_Tools SET ? WHERE ? AND ?', [{ percentagem: newPercentagem }, { id_nroEstudante: numeroEstudante }, { id_tools: toolId }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "tool_nao_updated" }, null);
                        return;
                    }
                    result(null, res);
                });
            } else {
                result({ kind: "not_found_alumni" }, null);
            }
        } else {
            result = (erro, data)
        }
    });

};

Model.deleteSkillFromNumeroEstudanteBySkillId = (numeroEstudante, skillId, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('DELETE FROM Alumni_Skills WHERE ? AND ?', [{ id_nroEstudante: numeroEstudante }, { id_skills: skillId }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "skill_nao_apagada" }, null);
                        return;
                    }
                    result(null, res);
                });
            } else {
                result({ kind: "not_found_alumni" }, null);
            }
        } else {
            result = (erro, data)
        }
    });
};



Model.deleteToolFromNumeroEstudanteByToolId = (numeroEstudante, toolId, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('DELETE FROM Alumni_Tools WHERE ? AND ?', [{ id_nroEstudante: numeroEstudante }, { id_tools: toolId }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "tool_nao_apagada" }, null);
                        return;
                    }
                    result(null, res);
                });
            } else {
                result({ kind: "not_found_alumni" }, null);
            }
        } else {
            result = (erro, data)
        }
    });
};
Model.getSkillsFromNumeroEstudante = (numeroEstudante, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('SELECT tipoSkill, percentagem FROM Alumni_Skills INNER JOIN Skills ON Skills.id_skills = Alumni_Skills.id_skills WHERE id_nroEstudante = ?', [numeroEstudante], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }
                    // se nao houver skills queremos um array vazio
                    result(null, res);
                    return
                });
            } else {
                result({ kind: "not_found_alumni" }, null);
            }
        } else {
            result = (erro, data)
        }
    });
};

Model.getToolsFromNumeroEstudante = (numeroEstudante, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('SELECT tipoTool, percentagem FROM Alumni_Tools INNER JOIN Tools ON Tools.id_tools = Alumni_Tools.id_tools WHERE id_nroEstudante = ?', [numeroEstudante], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }
                    // se nao houver skills queremos um array vazio
                    result(null, res);
                    return
                });
            } else {
                result({ kind: "not_found_alumni" }, null);
            }
        } else {
            result = (erro, data)
        }
    });
};

Model.findAlumniByNumeroEstudante = (numeroEstudante, result) => {
    sql.query('SELECT * FROM Alumni WHERE id_nroEstudante = ?', [numeroEstudante], (err, res) => {
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


Model.updateAlumniByNumeroEstudante = (alumni, numeroEstudante, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query("UPDATE Alumni SET ? WHERE ?", [alumni, { id_nroEstudante: numeroEstudante }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }
                    if (res.affectedRows == 0) {
                        result({ kind: "alumni_nao_updated" }, null);
                        return
                    }
                    result(null, res)
                });
            } else {
                result({ kind: "not_found_alumni" }, null);
            }
        } else {
            result = (erro, data)
        }
    });
};

Model.getAllBolsas = (result) => {
    sql.query("SELECT * FROM Bolsa_Emprego", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};

Model.createBolsa = (bolsa, result) => {
    sql.query('INSERT INTO Bolsa_Emprego SET ?', bolsa, (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};

Model.deleteBolsa = (id, result) => {
    sql.query('DELETE FROM Bolsa_Emprego WHERE id_bolsas = ?', id, (err, res) => {
        if (err) {
            result(err, null);
        }

        result(null, res);
    });
};

Model.getBolsaById = (id, result) => {
    sql.query('SELECT * FROM Bolsa_Emprego WHERE id_bolsas = ?', [id], (err, res) => {
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

Model.updateBolsaById = (bolsa, id, result) => {
    sql.query('UPDATE Bolsa_Emprego SET ? WHERE ?', [bolsa, { id_bolsas: id }], (err, res) => {
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

module.exports = Model;