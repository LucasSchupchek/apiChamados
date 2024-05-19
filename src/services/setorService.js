const db = require('../config/db');

function buscarTodos(){
    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM setor', (error, results)=>{
            if(error){ reject(error); return; }
            resolve(results);
        });
    });
}

function buscarSetor(codigo){
    return new Promise((aceito, rejeitado)=>{

        db.query(`select * from setor where id = ${codigo}`, (error, results)=>{
            if(error){rejeitado(error); return};
            if(results.length > 0){
                aceito(results[0]);
            }else{
                aceito(false)
            }
        });
    });
}

function cadastraSetor(descricao) {
    return new Promise((aceito, rejeitado) => {
        db.query(`insert into setor(descricao) values('${descricao}');`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    const setorId = results.insertId; // Obtém o ID do setor inserido
                    aceito({ id: setorId, descricao });
                }
            }
        );
    });
}

function alteraSetor(id, descricao) {
    return new Promise((aceito, rejeitado) => {
        db.query(`update setor set descricao = '${descricao}' where id = '${id}';`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    aceito({
                        id, descricao
                    });
                }
            }
        );
    });
}

function excluirSetor(id) {
    return new Promise((aceito, rejeitado) => {
        db.query(`delete from setor where id = '${id}';`,
        (error, results) =>{
            if(error){rejeitado(error); return;}
            aceito(results); 
        }
        );
    });
}

module.exports = {
    buscarTodos,
    buscarSetor,
    cadastraSetor,
    alteraSetor,
    excluirSetor
}