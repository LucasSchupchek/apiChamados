const db = require('../config/db');
const datas = require('../utils/utils');

function login(user, password){
    return new Promise((aceito, rejeitado)=>{
        db.query(`select * from users where username = '${user}' and password_user = '${password}'`, (error, results)=>{
            if(error){rejeitado(error); return};
            if(results.length > 0){
                const id = results[0].id;
                const nivel_acesso = results[0].nivel_acesso;
                const secret = results[0].secret;
                const nome = results[0].nome;
                const sobrenome = results[0].sobrenome;
                aceito({
                    aceito: true,
                    id,
                    nivel_acesso,
                    secret,
                    nome,
                    sobrenome
                });
            }else{
                aceito({
                    aceito: false
                })
            }
        });
    });
};

module.exports = {
    login
};