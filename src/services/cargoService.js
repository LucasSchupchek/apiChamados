const db = require('../config/db');

function buscarTodos(){
    return new Promise((aceito, rejeitado)=>{

        db.query('select * from cargo', (error, results)=>{
            if(error){rejeitado(error); return}
            aceito(results);
        });
    });
};

function buscarCargo(codigo){
    return new Promise((aceito, rejeitado)=>{

        db.query(`select * from cargo where id = ${codigo}`, (error, results)=>{
            if(error){rejeitado(error); return};
            if(results.length > 0){
                aceito(results[0]);
            }else{
                aceito(false)
            }
        });
    });
}

function cadastraCargo(descricao) {
    return new Promise((aceito, rejeitado) => {
        db.query(`insert into cargo(descricao) values('${descricao}');`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    const cargoId = results.insertId; // Obtém o ID do cargo inserido
                    aceito({ id: cargoId, descricao });
                }
            }
        );
    });
}

function alteraCargo(id, descricao) {
    return new Promise((aceito, rejeitado) => {
        db.query(`update cargo set descricao = '${descricao}' where id = '${id}';`, 
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

function excluirCargo(id) {
    return new Promise((aceito, rejeitado) => {
        db.query(`delete from cargo where id = '${id}';`,
        (error, results) =>{
            if(error){rejeitado(error); return;}
            aceito(results); 
        }
        );
    });
}

module.exports = {
    buscarTodos,
    buscarCargo,
    cadastraCargo,
    alteraCargo,
    excluirCargo
}