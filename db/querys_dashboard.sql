use dbapichamados;

SELECT 
    c.id AS id_categoria,
    c.descricao AS descricao_categoria,
    COUNT(ch.id) AS quantidade_chamados
FROM 
    dbapichamados.categoria c
INNER JOIN 
    dbapichamados.chamados ch ON c.id = ch.id_categoria
WHERE 
    ch.data_cadastro BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY 
    c.id, c.descricao
HAVING 
    COUNT(ch.id) > 0;

SELECT
    s.id AS id_setor,
    s.descricao AS descricao_setor,
    COUNT(ch.id) AS quantidade_chamados
FROM
    dbapichamados.chamados ch
INNER JOIN
    dbapichamados.users u ON ch.id_usuario = u.id
INNER JOIN
    dbapichamados.setor s ON u.id_setor = s.id
WHERE
    ch.data_cadastro BETWEEN '2024-01-01' AND '2024-12-31'
GROUP BY
    s.id, s.descricao;

SELECT 
    CASE 
        WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
        ELSE 'Aberto'
    END AS status,
    COUNT(*) AS total
FROM 
    chamados
GROUP BY 
    CASE 
        WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
        ELSE 'Aberto'
    END;

SELECT 
    s.status,
    COALESCE(c.total, 0) as total
FROM (
    SELECT 'Aberto' AS status
    UNION ALL
    SELECT 'Em andamento' AS status
    UNION ALL
    SELECT 'Fechado' AS status
) AS s
LEFT JOIN (
    SELECT 
        CASE 
            WHEN status_chamado IN ('Em andamento', 'Pendente', 'Aguardando Feedback') THEN 'Em andamento'
            WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
            ELSE 'Aberto'
        END AS status_chamado,
        COUNT(*) AS total
    FROM 
        chamados
    GROUP BY 
        CASE 
            WHEN status_chamado IN ('Em andamento', 'Pendente', 'Aguardando Feedback') THEN 'Em andamento'
            WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
            ELSE 'Aberto'
        END
) AS c
ON s.status = c.status_chamado;

SELECT
        chamados.id,
        chamados.titulo,
        chamados.descricao,
        chamados.status_chamado,
        chamados.data_cadastro,
        chamados.data_update,
        chamados.data_fechamento,
        (select users.nome from users where users.id = chamados.id_usuario) as nome_usuario,
        (select users.sobrenome from users where users.id = chamados.id_usuario) as sobrenome_usuario,
        (select users.email from users where users.id = chamados.id_usuario) as email_usuario,
        (select setor.descricao from users inner join setor on setor.id = users.id_setor where users.id = chamados.id_usuario) as setor_usuario,
        chamados.id_responsavel,
        users.nome as nome_responsavel,
        users.sobrenome as sobrenome_responsavel,
        users.email as email_responsavel,
        categoria.descricao as descricao_categoria,
        anexos_chamados.path_anexo
    FROM 
        chamados left join 
        categoria  on chamados.id_categoria = categoria.id 
        left join anexos_chamados on anexos_chamados.id_chamado = chamados.id
        left join users on chamados.id_responsavel = users.id
    WHERE chamados.id = 11;


SELECT 
                CASE 
                    WHEN status_chamado IN ('Em andamento', 'Pendente', 'Aguardando Feedback') THEN 'Em andamento'
                    WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
                    ELSE 'Aberto'
                END AS status,
                COUNT(*) AS total
            FROM 
                chamados
			WHERE
				id_usuario = 2
            GROUP BY 
                CASE 
                    WHEN status_chamado IN ('Em andamento', 'Pendente', 'Aguardando Feedback') THEN 'Em andamento'
                    WHEN status_chamado IN ('Fechado', 'Rejeitado') THEN 'Fechado'
                    ELSE 'Aberto'
                END;
