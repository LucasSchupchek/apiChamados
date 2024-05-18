const setorService = require('../services/setorService');

async function buscarTodos(req, res){
    let json = {error: '', result:[]};
    let setores = await setorService.buscarTodos();

    setores.forEach(setor =>{
        json.result.push({
            id: setor.id,
            descricao: setor.descricao
        })
    })
    res.json(json)
};

async function buscarSetor(req, res){
    let json = {error: '', result:{}};

    console.log(req)
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

    if(descricao){
        const setorId = await setorService.cadastraSetor(descricao);
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

    if(id && descricao){
        json.result = await setorService.alteraSetor(id, descricao);
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)
}

async function excluirSetor(req, res){
    let json = {error: '', result:{}};
    
    await setorService.excluirSetor(req.params.id);
    res.json(json)
}

module.exports = {
    buscarTodos,
    buscarSetor,
    cadastraSetor,
    alteraSetor,
    excluirSetor
}