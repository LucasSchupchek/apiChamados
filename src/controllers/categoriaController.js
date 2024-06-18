const categoriaService = require('../services/categoriaService');

async function buscarTodos(req, res){
    let json = { error: '', result: { data: [], totalItems: 0 } };
    let categorias = await categoriaService.buscarTodos();

    json.result.data = categorias.map(categoria => ({
        id: categoria.id,
        descricao: categoria.descricao,
        color: categoria.color,
        ativo: categoria.ativo
    }));
    json.result.totalItems = categorias.length; // Ajustar conforme a paginação se necessário
    res.json(json);
}

async function buscarAtivos(req, res){
    let json = { error: '', result: { data: [], totalItems: 0 } };
    let categorias = await categoriaService.buscarAtivos();

    json.result.data = categorias.map(categoria => ({
        id: categoria.id,
        descricao: categoria.descricao,
        color: categoria.color,
        ativo: categoria.ativo
    }));
    json.result.totalItems = categorias.length; // Ajustar conforme a paginação se necessário
    res.json(json);
}

async function buscarCategoria(req, res){
    let json = {error: '', result:{}};

    const codigo = req.params.id;
    const categoria = await categoriaService.buscarCategoria(codigo);

    if(categoria){
        json.result = categoria;
    }

    res.json(json)
    
};

async function cadastraCategoria(req, res){
    let json = {error: '', result:{}};

    const descricao = req.body.descricao;
    const color = req.body.cor;

    if(descricao){
        const categoriaId = await categoriaService.cadastraCategoria(descricao, color);
        json.result = categoriaId
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)

}

async function alteraCategoria(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;

    const descricao = req.body.descricao;
    const color = req.body.cor;

    if(id && descricao){
        json.result = await categoriaService.alteraCategoria(id, descricao, color);
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
        json.result = await categoriaService.ativaInativa(id, param);
    }else{
        json.error = 'Id ou param ativo nao informado';
    }
    res.json(json)
}

async function excluirCategoria(req, res){
    let json = {error: '', result:{}};
    
    await categoriaService.excluirCategoria(req.params.id);
    res.json(json)
}

module.exports = {
    ativaInativa,
    buscarAtivos,
    buscarTodos,
    buscarCategoria,
    cadastraCategoria,
    alteraCategoria,
    excluirCategoria
}