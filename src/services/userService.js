const db = require('../config/db');
const datas = require('../utils/utils');

async function buscarTodos(page, limit){
    const offset = (page - 1) * limit;
    return new Promise((aceito, rejeitado)=>{
        db.query('SELECT COUNT(*) as total FROM users', (error, countResult) => {
            if (error) {
                rejeitado(error);
                return;
            }

            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);

            db.query(`select
                        users.id, 
                        users.nome,
                        users.sobrenome,
                        users.email,
                        users.username,
                        users.nivel_acesso,
                        users.ativo,
                        setor.descricao as setor,
                        cargo.descricao as cargo
                    from users inner join setor on users.id_setor = setor.id
                    inner join cargo on users.id_cargo = cargo.id LIMIT ${limit} OFFSET ${offset}`, (error, results)=>{
                if(error){rejeitado(error); return;}
                aceito({ results, totalPages });
            });
        });
    });
};

function buscarUser(codigo){
    return new Promise((aceito, rejeitado)=>{

        db.query(`select
                    u.id,
                    u.nome,
                    u.sobrenome,
                    u.email,
                    u.username,
                    u.id_setor,
                    s.descricao as setor,
                    u.id_cargo,
                    c.descricao as cargo,
                    u.nivel_acesso,
                    u.ativo,
                    u.path_avatar,
                    u.data_cadastro
                from
                users u inner join setor s on u.id_setor = s.id
                inner join cargo c on u.id_cargo = c.id
                where u.id = ${codigo};`,
            (error, results)=>{
                    if(error){rejeitado(error); return};
                    if(results.length > 0){
                        aceito(results[0]);
                    }else{
                        aceito(false)
                    }
                });
        });
    }

function cadastraUser(nome, sobrenome, email, username, password, setor, cargo, acesso) {
    const data_cadastro = datas.ajustarData(datas.obterDataAtualFormatada());
    return new Promise((aceito, rejeitado) => {
        db.query(`insert into users(nome, sobrenome, email, username, password_user, id_setor, id_cargo, nivel_acesso, ativo, data_cadastro) 
        values('${nome}', '${sobrenome}', '${email}','${username}', '${password}', ${setor}, ${cargo}, '${acesso}', '1','${data_cadastro}');`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    const userId = results.insertId; // Obtém o ID do user inserido
                    aceito({ id: userId, nome, sobrenome, email, username, password, setor, cargo, acesso, data_cadastro });
                }
            }
        );
    });
}

function alteraUser(id, nome, sobrenome, email, username, setor, cargo, nivel_acesso) {
    return new Promise((aceito, rejeitado) => {
        const data_update = datas.ajustarData(datas.obterDataAtualFormatada());
        db.query(`update users set nome = '${nome}', sobrenome = '${sobrenome}', email = '${email}', username = '${username}', id_setor = ${setor}, id_cargo = ${cargo}, nivel_acesso = '${nivel_acesso}' where id = '${id}';`, 
            (error, results) => {
                if (error) {
                    rejeitado(error);
                } else {
                    aceito({
                        id, nome, sobrenome, email, username, setor, cargo, nivel_acesso
                    });
                }
            }
        );
    });
}


function ativaInativa(id, param) {
    let ativo = param == "true" ? 1 : 0;
    console.log(ativo)
    return new Promise((aceito, rejeitado) => {
        db.query(`update users set ativo = ${ativo} where id = '${id}';`, 
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


function excluirUser(id) {
    return new Promise((aceito, rejeitado) => {
        db.query(`delete from users where id = '${id}';`,
        (error, results) =>{
            if(error){rejeitado(error); return;}
            aceito(results); 
        }
        );
    });
}

module.exports = {
    buscarTodos,
    buscarUser,
    cadastraUser,
    alteraUser,
    ativaInativa,
    excluirUser
};