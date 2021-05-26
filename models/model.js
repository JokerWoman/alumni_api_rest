const sql = require("./db.js"); // get DB connection

const Model = function () {

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


Model.createCursoFromNumeroEstudanteByCursoId = (curso, result) => {
    Model.AlumniExisteNaBaseDeDados(curso.id_nroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('INSERT INTO Alumni_Cursos SET ?', curso, (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }
                    if (res.affectedRows == 0) {
                        result({ kind: "curso_nao_inserida" }, null);
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



Model.createLinkFromNumeroEstudanteByLinkId = (link, result) => {
    Model.AlumniExisteNaBaseDeDados(link.id_nroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('INSERT INTO Alumni_Links SET ?', link, (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }
                    if (res.affectedRows == 0) {
                        result({ kind: "link_nao_inserida" }, null);
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

Model.updateCursoFromNumeroEstudanteByCursoId = (numeroEstudante, cursoId, newAno, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('UPDATE Alumni_Cursos SET ? WHERE ? AND ?', [{ anoCurso: newAno }, { id_nroEstudante: numeroEstudante }, { id_cursos: cursoId }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "curso_nao_updated" }, null);
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


Model.updateLinkFromNumeroEstudanteByLinkId = (numeroEstudante, linkId, newLink, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('UPDATE Alumni_Links SET ? WHERE ? AND ?', [{ link: newLink }, { id_nroEstudante: numeroEstudante }, { id_links: linkId }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "link_nao_updated" }, null);
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



Model.deleteCursoFromNumeroEstudanteByCursoId = (numeroEstudante, cursoId, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('DELETE FROM Alumni_Cursos WHERE ? AND ?', [{ id_nroEstudante: numeroEstudante }, { id_cursos: cursoId }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "curso_nao_apagada" }, null);
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



Model.deleteLinkFromNumeroEstudanteByLinkId = (numeroEstudante, linkId, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('DELETE FROM Alumni_Links WHERE ? AND ?', [{ id_nroEstudante: numeroEstudante }, { id_links: linkId }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "link_nao_apagada" }, null);
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



Model.getCursosFromNumeroEstudante = (numeroEstudante, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('SELECT tipoCurso, anoCurso FROM Alumni_Cursos INNER JOIN Cursos ON Cursos.id_cursos = Alumni_Cursos.id_cursos WHERE id_nroEstudante = ?', [numeroEstudante], (err, res) => {
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

Model.getLinksFromNumeroEstudante = (numeroEstudante, result) => {
    Model.AlumniExisteNaBaseDeDados(numeroEstudante, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('SELECT tipoLink, link FROM Alumni_Links INNER JOIN Links ON Links.id_links = Alumni_Links.id_links WHERE id_nroEstudante = ?', [numeroEstudante], (err, res) => {
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

Model.BolsaExisteNaBaseDeDados = (id, resultado) => {
    sql.query('SELECT COUNT(*) AS quantidade FROM Bolsa_Emprego WHERE ?', { id_bolsas: id }, (err, res) => {
        if (err) {
            resultado({ kind: "erro_operacao" }, null);
            return;
        }
        resultado(null, { quantidade: res[0].quantidade });
    });
};

Model.EmpresaExisteNaBaseDeDados = (id, resultado) => {
    sql.query('SELECT COUNT(*) AS quantidade FROM Empresa WHERE ?', { id_empresa: id }, (err, res) => {
        if (err) {
            resultado({ kind: "erro_operacao" }, null);
            return;
        }
        resultado(null, { quantidade: res[0].quantidade });
    });
};
Model.EmpregoExisteNaBaseDeDados = (id, resultado) => {
    sql.query('SELECT COUNT(*) AS quantidade FROM Tipo_Emprego WHERE ?', { id_tipoEmprego: id }, (err, res) => {
        if (err) {
            resultado({ kind: "erro_operacao" }, null);
            return;
        }
        resultado(null, { quantidade: res[0].quantidade });
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

Model.createBolsa = (bolsa, empresaId, empregoId, result) => {
    Model.EmpresaExisteNaBaseDeDados(empresaId, (erro1, data1) => {
        if (!erro1) {
            //verificar se foi encontrada alguma empresa com esse empresaId na base de dados
            if (data1.quantidade == 1) {
                Model.EmpregoExisteNaBaseDeDados(empregoId, (erro2, data2) => {
                    if (!erro2) {
                        //verificar se foi encontrada algum emprego com esse empregoId na base de dados
                        if (data2.quantidade == 1) {
                            sql.query('INSERT INTO Bolsa_Emprego SET ?', bolsa, (err, res) => {
                                if (err) {
                                    result({ kind: "erro_operacao" }, null);
                                    return;
                                }

                                if (res.affectedRows == 0) {
                                    result({ kind: "bolsa_nao_criada" }, null);
                                    return;
                                }
                                result(null, res);
                            });
                        }
                        else {
                            result({ kind: "not_found_idEmprego" }, null);
                        }
                    }
                    else {
                        result = (erro2, data2)
                    }
                })
            } else {
                result({ kind: "not_found_idEmpresa" }, null);
            }
        } else {
            result = (erro1, data1)
        }
    });
};

Model.deleteBolsa = (id, result) => {
    Model.BolsaExisteNaBaseDeDados(id, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('DELETE FROM Bolsa_Emprego WHERE ?', [{ id_bolsas: id }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "bolsa_nao_apagada" }, null);
                        return;
                    }
                    result(null, res);
                });
            } else {
                result({ kind: "not_found_bolsa" }, null);
            }
        } else {
            result = (erro, data)
        }
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

Model.updateBolsaById = (bolsa, bolsaId, empresaId, empregoId, result) => {
    Model.BolsaExisteNaBaseDeDados(bolsaId, (erro, data) => {
        if (!erro) {
            //verificar se foi encontrada alguma bolsa com bolsaId na base de dados
            if (data.quantidade == 1) {
                Model.EmpresaExisteNaBaseDeDados(empresaId, (erro1, data1) => {
                    if (!erro1) {
                        //verificar se foi encontrada alguma empresa com esse empresaId na base de dados
                        if (data1.quantidade == 1) {
                            Model.EmpregoExisteNaBaseDeDados(empregoId, (erro2, data2) => {
                                if (!erro2) {
                                    //verificar se foi encontrada algum emprego com esse empregoId na base de dados
                                    if (data2.quantidade == 1) {
                                        sql.query('UPDATE Bolsa_Emprego SET ? WHERE ?', [bolsa, { id_bolsas: bolsaId }], (err, res) => {
                                            if (err) {
                                                result({ kind: "erro_operacao" }, null);
                                                return;
                                            }

                                            if (res.affectedRows == 0) {
                                                result({ kind: "bolsa_nao_updated" }, null);
                                                return;
                                            }
                                            result(null, res);
                                        });
                                    }
                                    else {
                                        result({ kind: "not_found_idEmprego" }, null);
                                    }
                                }
                                else {
                                    result = (erro2, data2)
                                }
                            })
                        } else {
                            result({ kind: "not_found_idEmpresa" }, null);
                        }
                    } else {
                        result = (erro1, data1)
                    }
                });
            } else {
                result({ kind: "not_found_bolsa" }, null);
            }
        }else{
            result = (erro, data)
        }
    })

};

Model.EventoExisteNaBaseDeDados = (id, resultado) => {
    sql.query('SELECT COUNT(*) AS quantidade FROM Evento WHERE ?', { id_evento: id }, (err, res) => {
        if (err) {
            resultado({ kind: "erro_operacao" }, null);
            return;
        }
        resultado(null, { quantidade: res[0].quantidade });
    });
};
Model.getAllEventos = (result) => {
    sql.query("SELECT * FROM Evento", (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        result(null, res);
    });
};
Model.createEvento = (evento, result) => {
    sql.query('INSERT INTO Evento SET ?', [evento], (err, res) => {
        if (err) {
            result(err, null);
        } else {
            result(null, res);
        }
    });
};
Model.deleteEvento = (id, result) => {
    Model.EventoExisteNaBaseDeDados(id, (erro, data) => {
        if (!erro) {
            if (data.quantidade == 1) {
                sql.query('DELETE FROM Evento WHERE id_evento = ?', [id], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }

                    if (res.affectedRows == 0) {
                        result({ kind: "evento_nao_apagada" }, null);
                        return;
                    }
                    result(null, res);
                });
            } else {
                result({ kind: "not_found_evento" }, null);
            }
        } else {
            result = (erro, data)
        }
    });
};
Model.getEventoById = (id, result) => {
    sql.query('SELECT * FROM Evento WHERE id_evento = ?', [id], (err, res) => {
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
Model.updateEventoById = (evento, id, result) => {
    Model.EventoExisteNaBaseDeDados(id, (erro, data) => {
        if (!erro) {
            if (data.quantidade === 1) {
                sql.query('UPDATE Evento SET ? WHERE ?', [evento, { id_evento: id }], (err, res) => {
                    if (err) {
                        result({ kind: "erro_operacao" }, null);
                        return;
                    }
                    if (res.affectedRows == 0) {
                        result({ kind: "evento_nao_updated" }, null);
                        return
                    }
                    result(null, res)
                });
            }else{
                result({ kind: "not_found_evento" }, null);
            }
        }else{
            result = (erro, data)
        }

    });
};


module.exports = Model;