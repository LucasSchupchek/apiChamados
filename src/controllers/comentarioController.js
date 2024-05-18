const comentarioService = require('../services/comentarioService');

async function buscarComentarios(req, res){
    let json = {error: '', result:{}};

    const codigoChamado = req.params.id;

    const comentario = await comentarioService.buscarComentario(codigoChamado);

    if(comentario){
        json.result = comentario;
    }

    res.json(json)
    
};

async function cadastraComentario(req, res){
    let json = {error: '', result:{}};

    const id_chamado = req.body.id_chamado;
    const id_usuario = req.body.id_usuario;
    const descricao = req.body.email;
    const anexo = req.body.anexo;

    const path_anexo = "teste/por/enquanto.anexo";

    if(id_chamado && id_usuario && descricao){
        const comentarioId = await comentarioService.cadastraComentario(id_chamado, id_usuario, descricao, path_anexo);
        json.result = comentarioId
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)

}

async function alteraComentario(req, res){
    let json = {error: '', result:{}};

    const id_comentario = req.params.id_comentario;
    const id_usuario = req.body.id_usuario;
    const descricao = req.body.descricao;
    const anexo = req.body.anexo;

    const path_anexo = "teste/por/enquanto.anexo";


    if(id_comentario && id_usuario && descricao){
        json.result = await comentarioService.alteraComentario(id_comentario, id_usuario, descricao, path_anexo);
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)
}

async function excluirComentario(req, res){
    let json = {error: '', result:{}};
    
    await comentarioService.excluirComentario(req.params.id);
    res.json(json)
}

module.exports = {
    buscarComentarios,
    cadastraComentario,
    alteraComentario,
    excluirComentario
}