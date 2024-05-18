const db = require('../config/db');
const datas = require('../utils/utils');

function buscarComentario(codigo){
    return new Promise((aceito, rejeitado)=>{

        db.query(`select * from comentarios_chamado where id_chamado = ${codigo}`, (error, results)=>{
            if(error){rejeitado(error); return};
            if(results.length > 0){
                aceito(results[0]);
            }else{
                aceito(false)
            }
        });
    });
}

function cadastraComentario(id_chamado, id_usuario, descricao, path_anexo) {
    const data_cadastro = datas.ajustarData(datas.obterDataAtualFormatada());
    return new Promise((aceito, rejeitado) => {
        db.query(`insert into comentarios_chamado(id_chamado, id_usuario, data_inclusao, path_anexo, descricao) 
        values('${id_chamado}', '${id_usuario}','${descricao}', '${path_anexo}', ${data_cadastro});`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    const comentarioId = results.insertId; // Obtém o ID do user inserido
                    aceito({ id: comentarioId, id_chamado, id_usuario, descricao, path_anexo, data_cadastro });
                }
            }
        );
    });
}

function alteraComentario(id_comentario, id_usuario, descricao, path_anexo) {
    const data_update = datas.ajustarData(datas.obterDataAtualFormatada());
    return new Promise((aceito, rejeitado) => {
        //aqui deverá verificar se o dono do comentário é o mesmo que está tentando alterar

        db.query(`update comentarios_chamado set descricao = '${descricao}' 
        where id = '${id_comentario}';`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    aceito({
                        id_comentario, id_usuario, descricao, path_anexo
                    });
                }
            }
        );
    });
}

function excluirComentario(id) {
    return new Promise((aceito, rejeitado) => {
        db.query(`delete from comentarios_chamado where id = '${id}';`,
        (error, results) =>{
            if(error){rejeitado(error); return;}
            aceito(results); 
        }
        );
    });
}

module.exports = {
    buscarComentario,
    cadastraComentario,
    alteraComentario,
    excluirComentario
};