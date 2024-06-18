// services/messageService.js
const connection = require('../config/db');

const saveMessage = (data) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO comentarios_chamado (id_chamado, id_usuario, data_inclusao, path_anexo, descricao)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [data.chatId, data.user_id, new Date(), data.path_anexo || null, data.text];
        
        connection.query(query, values, (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve({ id: results.insertId, ...data, data_inclusao: new Date() });
        });
    });
};

const getChatMessages = (chatId, page, limit) => {
    const offset = (page - 1) * limit;

    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                comentarios_chamado.id,
                comentarios_chamado.id_chamado,
                comentarios_chamado.id_usuario,
                comentarios_chamado.data_inclusao,
                comentarios_chamado.descricao,
                users.nome
            FROM comentarios_chamado
            INNER JOIN users on comentarios_chamado.id_usuario = users.id
            WHERE id_chamado = ?
            ORDER BY data_inclusao ASC
            LIMIT ?
            OFFSET ?
        `;
        connection.query(query, [chatId, limit, offset], (error, results) => {
            if (error) {
                return reject(error);
            }
            resolve(results);
        });
    });
};

module.exports = {
    saveMessage,
    getChatMessages
};
