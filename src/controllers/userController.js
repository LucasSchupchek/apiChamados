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
    let json = {error: '', result:{}};

    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;
    const username = req.body.email;
    const password = req.body.password;
    const setor = req.body.setor;
    const cargo = req.body.cargo;
    const acesso = req.body.acesso;

    if(nome && sobrenome && email && username && password && setor && cargo && acesso){
        const userId = await userService.cadastraUser(nome, sobrenome, email, username, password, setor, cargo, acesso);
        json.result = userId
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)

}

async function alteraUser(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;

    const nome = req.body.nome;
    const sobrenome = req.body.sobrenome;
    const email = req.body.email;
    const username = req.body.email;
    const password = req.body.password;
    const setor = req.body.setor;
    const cargo = req.body.cargo;
    const acesso = req.body.acesso;

    if(nome && sobrenome && email && username && password && setor && cargo && acesso){
        json.result = await userService.alteraUser(id, nome, email, username, password, setor, cargo, acesso);
    }else{
        json.error = 'Capos inválidos';
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
    excluirUser
}