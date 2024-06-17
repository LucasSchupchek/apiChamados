const db = require('../config/db');
const datas = require('../utils/utils');

function meusChamados(userId, page, limit, filtroAvancado = {}, dataInicial = null, dataFinal = null) {

    const offset = (page - 1) * limit;
    let query = `SELECT
                    chamados.id,
                    chamados.titulo,
                    chamados.descricao,
                    chamados.status_chamado,
                    chamados.data_cadastro,
                    chamados.data_update,
                    chamados.data_fechamento,
                    (select users.nome from users where users.id = chamados.id_usuario) as nome_usuario,
                    (select users.sobrenome from users where users.id = chamados.id_usuario) as sobrenome_usuario,
                    (select users.email from users where users.id = chamados.id_usuario) as email_usuario,
                    (select setor.descricao from users inner join setor on setor.id = users.id_setor where users.id = chamados.id_usuario) as setor_usuario,
                    users.nome as nome_responsavel,
                    users.sobrenome as sobrenome_responsavel,
                    users.email as email_responsavel,
                    categoria.descricao as descricao_categoria,
                    anexos_chamados.path_anexo
                FROM 
                    chamados 
                    LEFT JOIN categoria ON chamados.id_categoria = categoria.id 
                    LEFT JOIN anexos_chamados ON anexos_chamados.id_chamado = chamados.id
                    LEFT JOIN users ON chamados.id_responsavel = users.id`;

    // Condições de filtro avançado
    const whereConditions = [`chamados.id_usuario = '${userId}'`];
    if (filtroAvancado.categoria) {
        whereConditions.push(`chamados.id_categoria = '${filtroAvancado.categoria}'`);
    }
    if (filtroAvancado.responsavel) {
        whereConditions.push(`chamados.id_responsavel = '${filtroAvancado.responsavel}'`);
    }
    if (filtroAvancado.status) {
        whereConditions.push(`chamados.status_chamado = '${filtroAvancado.status}'`);
    }

    // Condições de datas
    if (dataInicial) {
        whereConditions.push(`chamados.data_cadastro >= '${dataInicial}'`);
    }
    if (dataFinal) {
        whereConditions.push(`chamados.data_cadastro <= '${dataFinal}'`);
    }

    // Adiciona as condições de filtro avançado à consulta, se existirem
    if (whereConditions.length > 0) {
        const whereClause = ' WHERE ' + whereConditions.join(' AND ');
        query += whereClause;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    console.log(query)

    return new Promise((aceito, rejeitado) => {
        db.query(query, (error, results) => {
            if (error) {
                rejeitado(error);
                return;
            }
            aceito(results);
        });
    });
};

function buscarTodos(page, limit, filtroAvancado = {}, dataInicial = null, dataFinal = null) {
    const offset = (page - 1) * limit;
    let query = `SELECT
                    chamados.id,
                    chamados.titulo,
                    chamados.descricao,
                    chamados.status_chamado,
                    chamados.data_cadastro,
                    chamados.data_update,
                    chamados.data_fechamento,
                    (select users.nome from users where users.id = chamados.id_usuario) as nome_usuario,
                    (select users.sobrenome from users where users.id = chamados.id_usuario) as sobrenome_usuario,
                    (select users.email from users where users.id = chamados.id_usuario) as email_usuario,
                    (select setor.descricao from users inner join setor on setor.id = users.id_setor where users.id = chamados.id_usuario) as setor_usuario,
                    users.nome as nome_responsavel,
                    users.sobrenome as sobrenome_responsavel,
                    users.email as email_responsavel,
                    categoria.descricao as descricao_categoria,
                    anexos_chamados.path_anexo
                FROM 
                    chamados left join 
                    categoria  on chamados.id_categoria = categoria.id 
                    left join anexos_chamados on anexos_chamados.id_chamado = chamados.id
                    left join users on chamados.id_responsavel = users.id`;

    // Condições de filtro avançado
    const whereConditions = [];
    if (filtroAvancado.categoria) {
        whereConditions.push(`chamados.id_categoria = '${filtroAvancado.categoria}'`);
    }
    if (filtroAvancado.responsavel) {
        whereConditions.push(`chamados.id_responsavel = '${filtroAvancado.responsavel}'`);
    }
    if (filtroAvancado.status) {
        whereConditions.push(`chamados.status_chamado = '${filtroAvancado.status}'`);
    }

    // Condições de datas
    if (dataInicial) {
        whereConditions.push(`chamados.data_cadastro >= '${dataInicial}'`);
    }
    if (dataFinal) {
        whereConditions.push(`chamados.data_cadastro <= '${dataFinal}'`);
    }

    // Adiciona as condições de filtro avançado à consulta, se existirem
    if (whereConditions.length > 0) {
        const whereClause = ' WHERE ' + whereConditions.join(' AND ');
        query += whereClause;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    return new Promise((aceito, rejeitado) => {
        db.query(query, (error, results) => {
            if (error) {
                rejeitado(error);
                return;
            }
            aceito(results);
        });
    });
}

function listChamados(page, limit) {
    const offset = (page - 1) * limit;
    return new Promise((aceito, rejeitado) => {
        db.query(`SELECT
                    chamados.id,
                    chamados.titulo,
                    chamados.descricao,
                    chamados.status_chamado,
                    chamados.data_cadastro,
                    chamados.data_update,
                    chamados.data_fechamento
                FROM 
                    chamados 
                ORDER BY chamados.data_cadastro DESC
                LIMIT ${limit} OFFSET ${offset}`, (error, results) => {
            if (error) {
                rejeitado(error);
                return;
            }
            aceito(results);
        });
    });
}

function buscarChamado(codigo){
    return new Promise((aceito, rejeitado)=>{

        db.query(`SELECT
        chamados.id,
        chamados.titulo,
        chamados.descricao,
        chamados.status_chamado,
        chamados.data_cadastro,
        chamados.data_update,
        chamados.data_fechamento,
        (select users.nome from users where users.id = chamados.id_usuario) as nome_usuario,
        (select users.sobrenome from users where users.id = chamados.id_usuario) as sobrenome_usuario,
        (select users.email from users where users.id = chamados.id_usuario) as email_usuario,
        (select setor.descricao from users inner join setor on setor.id = users.id_setor where users.id = chamados.id_usuario) as setor_usuario,
        chamados.id_responsavel,
        users.nome as nome_responsavel,
        users.sobrenome as sobrenome_responsavel,
        users.email as email_responsavel,
        categoria.descricao as descricao_categoria,
        anexos_chamados.path_anexo
    FROM 
        chamados left join 
        categoria  on chamados.id_categoria = categoria.id 
        left join anexos_chamados on anexos_chamados.id_chamado = chamados.id
        left join users on chamados.id_responsavel = users.id
    WHERE chamados.id = ${codigo}`, (error, results)=>{
            if(error){rejeitado(error); return};
            if(results.length > 0){
                aceito(results);
            }else{
                aceito(false)
            }
        });
    });
}

function cadastraChamado(titulo, descricao, status, id_usuario, categoria, anexos) {
    const data_cadastro = datas.ajustarData(datas.obterDataAtualFormatada());
    return new Promise((aceito, rejeitado) => {
        db.query(`insert into chamados(titulo, id_categoria, descricao, status_chamado, data_cadastro, id_usuario) values('${titulo}', '${categoria}', '${descricao}','${status}', '${data_cadastro}', ${id_usuario});`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    const chamadoId = results.insertId; // Obtém o ID do chamado inserido
                    anexos.forEach(el => {
                        db.query(`insert into anexos_chamados(id_chamado, path_anexo) values(${chamadoId}, '${el}');`)
                    })
                    aceito({ id: chamadoId, titulo, descricao, status, data_cadastro, id_usuario });
                }
            }
        );
    });
}

function alteraChamado(id, titulo, descricao) {
    const data_update = datas.ajustarData(datas.obterDataAtualFormatada());
    return new Promise((aceito, rejeitado) => {
        db.query(`update chamados set titulo = '${titulo}', descricao = '${descricao}', data_update = '${data_update}' where id = '${id}';`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    aceito({
                        id, titulo, descricao, data_update
                    });
                }
            }
        );
    });
}

function atribuirChamado(id, id_responsavel) {
    const data_update = datas.ajustarData(datas.obterDataAtualFormatada());
    return new Promise((aceito, rejeitado) => {
        db.query(`update chamados set id_responsavel = '${id_responsavel}', status_chamado = 'Em andamento', data_update = '${data_update}' where id = '${id}';`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    aceito({
                        id, id_responsavel, data_update, status: 'Em andamento'
                    });
                }
            }
        );
    });
}

function rejeitaChamado(id, id_responsavel, motivo) {
    const data_update = datas.ajustarData(datas.obterDataAtualFormatada());
    return new Promise((aceito, rejeitado) => {
        db.query(`update chamados set id_responsavel = '${id_responsavel}', status_chamado = 'Rejeitado', motivo_negacao = '${motivo}', data_update = '${data_update}' where id = '${id}';`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    aceito({
                        id, id_responsavel, data_update, status: 'Rejeitado', motivo
                    });
                }
            }
        );
    });
}

function atualizaStatus(id, status) {
    const data_update = datas.ajustarData(datas.obterDataAtualFormatada());
    let query = `UPDATE chamados SET status_chamado = '${status}', data_update = '${data_update}'`;

    if (status === 'Fechado') {
        query += `, data_fechamento = '${data_update}'`;
    }

    query += ` WHERE id = '${id}';`;

    return new Promise((aceito, rejeitado) => {
        db.query(query, (error, results) => {
            if (error) {
                rejeitado(error);
            } else {
                aceito({
                    id,
                    data_update,
                    status
                });
            }
        });
    });
}

function excluirChamado(id) {
    return new Promise((aceito, rejeitado) => {
        db.query(`delete from chamados where id = '${id}';`,
        (error, results) =>{
            if(error){rejeitado(error); return;}
            aceito(results); 
        }
        );
    });
}

module.exports = {
    meusChamados,
    buscarTodos,
    listChamados,
    buscarChamado,
    cadastraChamado,
    alteraChamado,
    atribuirChamado,
    rejeitaChamado,
    atualizaStatus,
    excluirChamado
};