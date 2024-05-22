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

    
    select * from chamados;
