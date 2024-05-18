const categoriaService = require('../services/categoriaService');

async function buscarTodos(req, res){
    let json = {error: '', result:[]};
    // const verify = await auth.verify(req, res);

    let categorias = await categoriaService.buscarTodos();

    categorias.forEach(categoria =>{
        json.result.push({
            id: categoria.id,
            descricao: categoria.descricao
        })
    })
    res.json(json)
};

async function buscarCategoria(req, res){
    let json = {error: '', result:{}};

    console.log(req)
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

    if(descricao){
        const categoriaId = await categoriaService.cadastraCategoria(descricao);
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

    if(id && descricao){
        json.result = await categoriaService.alteraCategoria(id, descricao);
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)
}

async function excluirCategoria(req, res){
    let json = {error: '', result:{}};
    
    await categoriaService.excluirCategoria(req.params.id);
    res.json(json)
}

module.exports = {
    buscarTodos,
    buscarCategoria,
    cadastraCategoria,
    alteraCategoria,
    excluirCategoria
}