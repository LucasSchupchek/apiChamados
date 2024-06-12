const db = require('../config/db');
const datas = require('../utils/utils');
const bcrypt = require('bcrypt');

async function buscarTodos(){
    return new Promise((aceito, rejeitado)=>{
            db.query(`select
                        users.id, 
                        users.nome,
                        users.sobrenome,
                        users.email,
                        users.username,
                        users.nivel_acesso,
                        users.ativo,
                        users.path_avatar,
                        users.id_setor,
                        users.id_cargo,
                        setor.descricao as setor,
                        cargo.descricao as cargo
                    from users inner join setor on users.id_setor = setor.id
                    inner join cargo on users.id_cargo = cargo.id`, (error, results)=>{
                if(error){rejeitado(error); return;}
                aceito({ results });
            });
        });
};

async function responsaveis(){
    return new Promise((aceito, rejeitado)=>{
            db.query(`select
                        users.id, 
                        users.nome,
                        users.sobrenome
                    from users where nivel_acesso <> 'default'`, (error, results)=>{
                if(error){rejeitado(error); return;}
                aceito({ results });
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

    async function cadastraUser(nome, sobrenome, email, username, hashedPassword, setor, cargo, acesso, profile_path) {
        const data_cadastro = datas.ajustarData(datas.obterDataAtualFormatada());
    
        return new Promise((aceito, rejeitado) => {
            // Verifica se o email ou username já existem
            db.query(`SELECT COUNT(*) as count FROM users WHERE email = ? OR username = ?`, [email, username], (error, results) => {
                if (error) {
                    rejeitado(error);
                } else if (results[0].count > 0) {
                    rejeitado({ message: 'Email ou username já cadastrado' });
                } else {
                    // Se não existir, prossegue com o cadastro
                    db.query(`INSERT INTO users(nome, sobrenome, email, username, password_user, id_setor, id_cargo, nivel_acesso, ativo, path_avatar, data_cadastro) 
                              VALUES('${nome}', '${sobrenome}', '${email}', '${username}', '${hashedPassword}', ${setor}, ${cargo}, '${acesso}', '1', '${profile_path}', '${data_cadastro}');`,
                        (error, results) => {
                            if (error) {
                                rejeitado(error);
                            } else {
                                const userId = results.insertId; // Obtém o ID do user inserido

                                aceito({ id: userId, nome, sobrenome, email, username, setor, cargo, acesso, data_cadastro });
                            }
                        }
                    );
                }
            });
        });
    }

function alteraUser(id, nome, sobrenome, email, username, setor, cargo, nivel_acesso, profile_path) {
    return new Promise((aceito, rejeitado) => {
        const data_update = datas.ajustarData(datas.obterDataAtualFormatada());
        db.query(`update users set nome = '${nome}', sobrenome = '${sobrenome}', email = '${email}', username = '${username}', id_setor = ${setor}, id_cargo = ${cargo}, nivel_acesso = '${nivel_acesso}', path_avatar = '${profile_path}' where id = '${id}';`, 
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

function alteraProfile(id, nome, sobrenome, email, profile_path) {
    return new Promise((aceito, rejeitado) => {
        const data_update = datas.ajustarData(datas.obterDataAtualFormatada());
        let query = `UPDATE users SET nome = ?, sobrenome = ?, email = ?, path_avatar = COALESCE(?, path_avatar) WHERE id = ?`;
        let params = [nome, sobrenome, email, profile_path, id];

        db.query(query, params, (error, results) => {
            if (error) {
                rejeitado(error);
            } else {
                aceito({ id, nome, sobrenome, email, profile_path });
            }
        });
    });
}


function ativaInativa(id, param) {
    let ativo = param == "true" ? 1 : 0;

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

function alteraSenha(id, hashedPassword) {
    return new Promise((resolve, reject) => {
        db.query('UPDATE users SET password_user = ? WHERE id = ?', [hashedPassword, id], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
}

module.exports = {
    buscarTodos,
    responsaveis,
    buscarUser,
    cadastraUser,
    alteraUser,
    ativaInativa,
    excluirUser,
    alteraSenha,
    alteraProfile
};