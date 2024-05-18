const db = require('../config/db');

function buscarTodos(){
    return new Promise((aceito, rejeitado)=>{

        db.query('select * from categoria', (error, results)=>{
            if(error){rejeitado(error); return}
            aceito(results);
        });
    });
};

function buscarCategoria(codigo){
    return new Promise((aceito, rejeitado)=>{

        db.query(`select * from categoria where id = ${codigo}`, (error, results)=>{
            if(error){rejeitado(error); return};
            if(results.length > 0){
                aceito(results[0]);
            }else{
                aceito(false)
            }
        });
    });
}

function cadastraCategoria(descricao) {
    return new Promise((aceito, rejeitado) => {
        db.query(`insert into categoria(descricao) values('${descricao}');`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    const categoriaId = results.insertId; // Obtém o ID do categoria inserido
                    aceito({ id: categoriaId, descricao });
                }
            }
        );
    });
}

function alteraCategoria(id, descricao) {
    return new Promise((aceito, rejeitado) => {
        db.query(`update categoria set descricao = '${descricao}' where id = '${id}';`, 
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

function excluirCategoria(id) {
    return new Promise((aceito, rejeitado) => {
        db.query(`delete from categoria where id = '${id}';`,
        (error, results) =>{
            if(error){rejeitado(error); return;}
            aceito(results); 
        }
        );
    });
}

module.exports = {
    buscarTodos,
    buscarCategoria,
    cadastraCategoria,
    alteraCategoria,
    excluirCategoria
}