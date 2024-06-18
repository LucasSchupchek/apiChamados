const setorService = require('../services/setorService');

async function buscarTodos(req, res){
    let json = { error: '', result: { data: [], totalItems: 0 } };
    let setores = await setorService.buscarTodos();

    json.result.data = setores.map(setor => ({
        id: setor.id,
        descricao: setor.descricao,
        localizacao: setor.localizacao,
        ativo: setor.ativo
    }));
    json.result.totalItems = setores.length; // Ajustar conforme a paginação se necessário
    res.json(json);
}

async function buscarAtivos(req, res){
    let json = { error: '', result: { data: [], totalItems: 0 } };
    let setores = await setorService.buscarAtivos();

    json.result.data = setores.map(setor => ({
        id: setor.id,
        descricao: setor.descricao,
        localizacao: setor.localizacao,
        ativo: setor.ativo
    }));
    json.result.totalItems = setores.length; // Ajustar conforme a paginação se necessário
    res.json(json);
}

async function buscarSetor(req, res){
    let json = {error: '', result:{}};
    const codigo = req.params.id;
    const setor = await setorService.buscarSetor(codigo);

    if(setor){
        json.result = setor;
    }

    res.json(json)
    
};

async function cadastraSetor(req, res){
    let json = {error: '', result:{}};
    const descricao = req.body.descricao;
    const localizacao = req.body.localizacao;

    if(descricao){
        const setorId = await setorService.cadastraSetor(descricao, localizacao);
        json.result = setorId
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)

}

async function alteraSetor(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;
    const descricao = req.body.descricao;
    const localizacao = req.body.localizacao;

    if(id && descricao){
        json.result = await setorService.alteraSetor(id, descricao, localizacao);
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)
}

async function ativaInativa(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;
    const param = req.query.ativo;

    if(id && param){
        json.result = await setorService.ativaInativa(id, param);
    }else{
        json.error = 'Id ou param ativo nao informado';
    }
    res.json(json)
}

async function excluirSetor(req, res){
    let json = {error: '', result:{}};
    
    await setorService.excluirSetor(req.params.id);
    res.json(json)
}

module.exports = {
    ativaInativa,
    buscarTodos,
    buscarAtivos,
    buscarSetor,
    cadastraSetor,
    alteraSetor,
    excluirSetor
}