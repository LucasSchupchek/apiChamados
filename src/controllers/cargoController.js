const cargoService = require('../services/cargoService');

async function buscarTodos(req, res){
    let json = {error: '', result:[]};
    let cargos = await cargoService.buscarTodos();

    cargos.forEach(cargo =>{
        json.result.push({
            id: cargo.id,
            descricao: cargo.descricao
        })
    })
    res.json(json)
};

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

async function excluirCargo(req, res){
    let json = {error: '', result:{}};
    
    await cargoService.excluirCargo(req.params.id);
    res.json(json)
}

module.exports = {
    buscarTodos,
    buscarCargo,
    cadastraCargo,
    alteraCargo,
    excluirCargo
}