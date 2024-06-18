const db = require('../config/db');

function buscarTodos(){
    return new Promise((aceito, rejeitado)=>{
        db.query('select * from categoria', (error, results)=>{
            if(error){rejeitado(error); return}
            aceito(results);
        });
    });
};

function buscarAtivos(){
    return new Promise((aceito, rejeitado)=>{
        db.query('select * from categoria where ativo = 1', (error, results)=>{
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

function cadastraCategoria(descricao, color) {
    return new Promise((aceito, rejeitado) => {
        db.query(`insert into categoria(descricao, color, ativo) values('${descricao}', '${color}', 1);`, 
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

function alteraCategoria(id, descricao, color) {
    return new Promise((aceito, rejeitado) => {
        db.query(`update categoria set descricao = '${descricao}', color = '${color}' where id = '${id}';`, 
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

function ativaInativa(id, param) {
    let ativo = param == "true" ? 1 : 0;

    return new Promise((aceito, rejeitado) => {
        db.query(`update categoria set ativo = ${ativo} where id = '${id}';`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    aceito({
                        id, ativo
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
    ativaInativa,
    buscarCategoria,
    cadastraCategoria,
    alteraCategoria,
    excluirCategoria,
    buscarAtivos
}