insert into setor (descricao) values(
	'T.I'
);

insert into cargo (descricao) values(
	'analista de sistema'
);

insert into users(
	nome,
    sobrenome,
    email,
    username,
    password_user,
    id_setor,
    id_cargo,
    nivel_acesso,
    data_cadastro
) values(
	'Lucas',
    'Schupchek de Jesus',
    'lucasschuchek@gmail.com',
    'lucas',
    'lucas123',
    1,
    1,
    'admin',
    '2024-03-16 17:28:00'
);

insert into users(
	nome,
    sobrenome,
    email,
    username,
    id_setor,
    id_cargo,
    nivel_acesso,
    data_cadastro
) values(
	'usuario',
    'teste',
    'teste@gmail.com',
    'teste',
    1,
    1,
    'default',	
    '2024-03-16 17:28:00'
);

insert into chamados(
	titulo,
    descricao,
    status_chamado,
    data_cadastro,
    id_usuario
) values(
	'impressora não imprime',
    'a impressora está comendo folhas e não imprimindo',
    'aberto',
    '2024-03-16 17:42:00',
    2
);

INSERT INTO categoria (descricao) VALUES
    ('Internet'),
    ('Rede'),
    ('Hardware'),
    ('Sistema'),
    ('Impressora')
;

use dbapichamados;

select * from users;

select * from chamados;
select * from anexos_chamados;

select * from cargo;

select * from categoria;

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
    users.nome as nome_responsavel,
    users.sobrenome as sobrenome_responsavel,
    categoria.descricao as descricao_categoria,
    anexos_chamados.path_anexo
 FROM 
	 chamados left join 
	 categoria  on chamados.id_categoria = categoria.id 
	left join anexos_chamados on anexos_chamados.id_chamado = chamados.id
    left join users on chamados.id_responsavel = users.id
 WHERE id_usuario = 2;
 
 select 
	users.nome,
	users.sobrenome,
    users.email,
    setor.descricao
from users inner join setor on users.id_setor = setor.id;

use dbapichamados;
select * from users;

 select 
	users.nome,
	users.sobrenome,
    users.email,
    users.nivel_acesso,
    setor.descricao as setor,
    cargo.descricao as cargo
from users inner join setor on users.id_setor = setor.id
inner join cargo on users.id_cargo = cargo.id;

use dbapichamados;
select * from users;