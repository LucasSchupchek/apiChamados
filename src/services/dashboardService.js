const db = require('../config/db');

function chamadosCategorias(data_inicial, data_final) {
    return new Promise((aceito, rejeitado) => {
        db.query(
            `SELECT 
                c.id AS id_categoria,
                c.descricao AS descricao_categoria,
                c.color AS cor_categoria,
                COUNT(ch.id) AS quantidade_chamados
            FROM 
                dbapichamados.categoria c
            INNER JOIN 
                dbapichamados.chamados ch ON c.id = ch.id_categoria
            WHERE 
                ch.data_cadastro BETWEEN ? AND ?
            GROUP BY 
                c.id, c.descricao
            HAVING 
                COUNT(ch.id) > 0;`,
            [data_inicial, data_final],
            (error, results) => {
                if (error) {
                    rejeitado(error);
                    return;
                }
                aceito(results);
            }
        );
    });
}

function chamadosSetor(data_inicial, data_final) {
    return new Promise((aceito, rejeitado) => {
        db.query(
            `SELECT 
                s.id AS id_setor,
                s.descricao AS descricao_setor,
                COUNT(ch.id) AS quantidade_chamados
            FROM 
                dbapichamados.setor s
            INNER JOIN 
                dbapichamados.users u ON s.id = u.id_setor
            INNER JOIN 
                dbapichamados.chamados ch ON u.id = ch.id_usuario
            WHERE 
                ch.data_cadastro BETWEEN ? AND ?
            GROUP BY 
                s.id, s.descricao
            HAVING 
                COUNT(ch.id) > 0;`,
            [data_inicial, data_final],
            (error, results) => {
                if (error) {
                    rejeitado(error);
                    return;
                }
                aceito(results);
            }
        );
    });
}

function chamadosTecnicos() {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT 
                u.id AS id_usuario,
                u.nome AS nome_usuario,
                COUNT(ch.id) AS quantidade_chamados
            FROM 
                dbapichamados.users u
            INNER JOIN 
                dbapichamados.chamados ch ON u.id = ch.id_responsavel
            WHERE 
                u.nivel_acesso != 'default'
            GROUP BY 
                u.id, u.nome
            HAVING 
                COUNT(ch.id) > 0;`,
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            }
        );
    });
}

function abertosFechados() {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT 
                CASE 
                    WHEN status_chamado IN ('Em andamento', 'Pendente', 'Aguardando Feedback') THEN 'Em andamento'
                    WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
                    ELSE 'Aberto'
                END AS status,
                COUNT(*) AS total
            FROM 
                chamados
            GROUP BY 
                CASE 
                    WHEN status_chamado IN ('Em andamento', 'Pendente', 'Aguardando Feedback') THEN 'Em andamento'
                    WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
                    ELSE 'Aberto'
                END;`,
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            }
        );
    });
}

function abertosFechadosUsuario(id_usuario) {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT 
                CASE 
                    WHEN status_chamado IN ('Em andamento', 'Pendente', 'Aguardando Feedback') THEN 'Em andamento'
                    WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
                    ELSE 'Aberto'
                END AS status,
                COUNT(*) AS total
            FROM 
                chamados
            WHERE
                id_usuario = ${id_usuario}
            GROUP BY 
                CASE 
                    WHEN status_chamado IN ('Em andamento', 'Pendente', 'Aguardando Feedback') THEN 'Em andamento'
                    WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
                    ELSE 'Aberto'
                END;`,
            (error, results) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(results);
            }
        );
    });
}

module.exports = {
    chamadosCategorias,
    chamadosSetor,
    abertosFechados,
    abertosFechadosUsuario,
    chamadosTecnicos
};
