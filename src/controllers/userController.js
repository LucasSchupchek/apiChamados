const userService = require('../services/userService');
const crypto = require('crypto');

async function buscarTodos(req, res){
    let json = {error: '', result:{ data: [], totalPages: 0 }};
    const page = req.query.page || 1; // Página atual (padrão: 1)
    const limit = req.query.limit || 20; // Limite de itens por página (padrão: 20)

    try {
        const { results, totalPages } = await userService.buscarTodos(page, limit);
        json.result.data = results;
        json.result.totalPages = totalPages;
        res.json(json);
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        json.error = 'Erro interno ao buscar usuários';
        res.status(500).json(json);
    }
};

async function buscarUser(req, res){
    let json = {error: '', result:{}};

    const codigo = req.params.id;
    const user = await userService.buscarUser(codigo);

    if(user){
        json.result = user;
    }

    res.json(json)
    
};

async function cadastraUser(req, res){
    let json = { error: '', result: {} };

    const { nome, sobrenome, email, password, setor, cargo, acesso } = req.body;
    const username = email; // assumindo que o username é o email

    // Verificação de campos obrigatórios
    if (!nome || !sobrenome || !email || !username || !password || !setor || !cargo || !acesso) {
        json.error = 'Campos inválidos';
        return res.status(400).json(json); // Retorna um erro 400 com a mensagem
    }

    try {
        const userId = await userService.cadastraUser(nome, sobrenome, email, username, password, setor, cargo, acesso);
        json.result = userId;
        res.json(json);
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        json.error = 'Erro interno ao cadastrar usuário';
        res.status(500).json(json); // Retorna um erro 500 para erro interno do servidor
    }
}

async function alteraUser(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;

    const { nome, sobrenome, email, username, setor, cargo, nivel_acesso } = req.body;
    console.log('campossss '+ nome, sobrenome, email, username, setor, cargo, nivel_acesso)

    try {
        const updatedUser = await userService.alteraUser(id, nome, sobrenome, email, username, setor, cargo, nivel_acesso);
        json.result = updatedUser;
        res.json(json);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        json.error = 'Erro interno ao atualizar usuário';
        res.status(500).json(json);
    }
}


async function ativaInativa(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;
    const param = req.query.ativo;

    if(id && param){
        json.result = await userService.ativaInativa(id, param);
    }else{
        json.error = 'Id ou param ativo nao informado';
    }
    res.json(json)
}

async function excluirUser(req, res){
    let json = {error: '', result:{}};
    
    await userService.excluirUser(req.params.id);
    res.json(json)
}

module.exports = {
    buscarTodos,
    buscarUser,
    cadastraUser,
    alteraUser,
    ativaInativa,
    excluirUser
}