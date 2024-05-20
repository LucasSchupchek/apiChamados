const cargoService = require('../services/cargoService');

async function buscarTodos(req, res){
    let json = { error: '', result: { data: [], totalItems: 0 } };
    let cargos = await cargoService.buscarTodos();

    json.result.data = cargos.map(setor => ({
        id: setor.id,
        descricao: setor.descricao,
        ativo: setor.ativo
    }));
    json.result.totalItems = cargos.length; // Ajustar conforme a paginação se necessário
    res.json(json);
}

async function buscarCargo(req, res){
    let json = {error: '', result:{}};

    console.log(req)
    const codigo = req.params.id;
    const cargo = await cargoService.buscarCargo(codigo);

    if(cargo){
        json.result = cargo;
    }

    res.json(json)
    
};

async function cadastraCargo(req, res){
    let json = {error: '', result:{}};
    const descricao = req.body.descricao;

    if(descricao){
        const cargoId = await cargoService.cadastraCargo(descricao);
        json.result = cargoId
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)

}

async function alteraCargo(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;

    const descricao = req.body.descricao;

    if(id && descricao){
        json.result = await cargoService.alteraCargo(id, descricao);
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
        json.result = await cargoService.ativaInativa(id, param);
    }else{
        json.error = 'Id ou param ativo nao informado';
    }
    res.json(json)
}

async function excluirCargo(req, res){
    let json = {error: '', result:{}};
    
    await cargoService.excluirCargo(req.params.id);
    res.json(json)
}

module.exports = {
    buscarTodos,
    ativaInativa,
    buscarCargo,
    cadastraCargo,
    alteraCargo,
    excluirCargo
}