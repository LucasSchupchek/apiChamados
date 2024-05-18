const db = require('../config/db');
const datas = require('../utils/utils');

function meusChamados(userId, page, limit){
    console.log(userId)
    const offset = (page - 1) * limit;
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
                WHERE id_usuario = '${userId}' LIMIT ${limit} OFFSET ${offset}`, (error, results)=>{
            if(error){rejeitado(error); return}
            aceito(results);
        });
    });
};

function buscarTodos(page, limit){
    const offset = (page - 1) * limit;
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
                LIMIT ${limit} OFFSET ${offset}`, (error, results)=>{
            if(error){rejeitado(error); return}
            aceito(results);
        });
    });
};

function buscarChamado(codigo){
    return new Promise((aceito, rejeitado)=>{

        db.query(`select * from chamados where id = ${codigo}`, (error, results)=>{
            if(error){rejeitado(error); return};
            if(results.length > 0){
                aceito(results[0]);
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
    return new Promise((aceito, rejeitado) => {
        db.query(`update chamados set status_chamado = '${status}', data_update = '${data_update}' where id = '${id}';`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    aceito({
                        id, data_update, status: 'Em andamento'
                    });
                }
            }
        );
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
    buscarChamado,
    cadastraChamado,
    alteraChamado,
    atribuirChamado,
    rejeitaChamado,
    atualizaStatus,
    excluirChamado
};