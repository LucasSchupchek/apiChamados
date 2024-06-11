const db = require('../config/db');
const datas = require('../utils/utils');
const bcrypt = require('bcrypt');

function login(user, password) {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM users WHERE username = ? AND ativo = 1`, [user], async (error, results) => {
            if (error) {
                reject(error);
                return;
            }
            if (results.length > 0) {
                const storedPassword = results[0].password_user;
                const isMatch = await bcrypt.compare(password, storedPassword);
                if (isMatch) {
                    const id = results[0].id;
                    const nivel_acesso = results[0].nivel_acesso;
                    const nome = results[0].nome;
                    const sobrenome = results[0].sobrenome;
                    const ProfilePath = results[0].path_avatar;
                    resolve({
                        aceito: true,
                        id,
                        nivel_acesso,
                        nome,
                        sobrenome,
                        ProfilePath
                    });
                } else {
                    resolve({
                        aceito: false
                    });
                }
            } else {
                resolve({
                    aceito: false
                });
            }
        });
    });
}


module.exports = {
    login
};