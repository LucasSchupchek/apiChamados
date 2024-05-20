create database dbApiChamados;
use dbApiChamados;

create table setor(
	id int primary key auto_increment,
    descricao varchar(100)
);

create table cargo(
	id int primary key auto_increment,
    descricao varchar(100)
);

create table users(
	id int primary key auto_increment,
    nome varchar(50),
    sobrenome varchar(255),
    email varchar(65),
    username varchar(45),
    password_user varchar(50),
    id_setor int,
    id_cargo int,
    nivel_acesso varchar(50),
    data_cadastro datetime,
    CONSTRAINT fk_setor FOREIGN KEY (id_setor) REFERENCES setor (id),
    CONSTRAINT fk_cargo FOREIGN KEY (id_cargo) REFERENCES cargo (id)
);

create table categoria(
	id int primary key auto_increment,
    descricao varchar(100)
);

create table chamados(
	id int primary key auto_increment,
    titulo varchar(50),
    id_categoria int,
    descricao_categoria varchar(65),
    descricao varchar(255),
    status_chamado varchar(50),
    data_cadastro datetime,
    data_update datetime,
    data_fechamento datetime,
    id_usuario int,
    id_responsavel int,
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES users (id),
    CONSTRAINT fk_responsavel FOREIGN KEY (id_responsavel) REFERENCES users (id),
    CONSTRAINT fk_categoria_chamado FOREIGN KEY (id_categoria) REFERENCES categoria (id)
);

create table anexos_chamados(
	id int primary key auto_increment,
    id_chamado int,
	path_anexo varchar(255),
    CONSTRAINT fk_chamado FOREIGN KEY (id_chamado) REFERENCES chamados (id)
);

create table comentarios_chamado(
	id int primary key auto_increment,
    id_chamado int,
    id_usuario int,
    data_inclusao datetime,
    path_anexo varchar(255),
    descricao varchar(255),
    CONSTRAINT fk_comentario_chamado FOREIGN KEY (id_chamado) REFERENCES chamados (id),
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (id_usuario) REFERENCES users (id)
);

Alter table chamados DROP COLUMN descricao_categoria;

alter table chamados add motivo_negacao varchar(100) after status_chamado;

alter table setor add localizacao varchar(100) after descricao;
alter table setor add ativo boolean after localizacao;
alter table cargo add ativo boolean after descricao;
alter table categoria add color varchar(50) after descricao;
alter table categoria add ativo boolean after color;

use dbapichamados;
select * from categoria;

select 
                        users.nome,
                        users.sobrenome,
                        users.email,
                        users.username,
                        users.nivel_acesso,
                        users.ativo,
                        setor.descricao as setor,
                        cargo.descricao as cargo
                    from users inner join setor on users.id_setor = setor.id
                    inner join cargo on users.id_cargo = cargo.id