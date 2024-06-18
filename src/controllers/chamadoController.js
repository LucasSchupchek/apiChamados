const chamadoService = require('../services/chamadoService');
const path = require('path');
const fs = require('fs');
const s3Service = require('../config/s3Storage');
const { tokenDecoded } = require('../utils/utils');
const { formatarData } = require('../utils/utils');

async function meusChamados(req, res) {

    let json = { error: '', result: [] };
    const userId = tokenDecoded(req).userId;
    const page = req.query.page || 1; // Página atual (padrão: 1)
    const limit = req.query.limit || 20; // Limite de itens por página (padrão: 20)
    
    const filtroAvancado = {
        categoria: req.query.categoria,
        responsavel: req.query.responsavel,
        status: req.query.status
    };

    const dataInicial = req.query.dataInicial;
    const dataFinal = req.query.dataFinal;

    try {
        let chamados = await chamadoService.meusChamados(userId, page, limit, filtroAvancado, dataInicial, dataFinal);

        // Criar um mapa para agrupar os chamados pelo ID
        const chamadosMap = new Map();
        chamados.forEach(chamado => {
            if (!chamadosMap.has(chamado.id)) {
                let responsavel = `${chamado.nome_responsavel} ${chamado.sobrenome_responsavel}`;
                if (chamado.nome_responsavel == null) {
                    responsavel = "";
                }

                chamadosMap.set(chamado.id, {
                    id: chamado.id,
                    titulo: chamado.titulo,
                    descricao: chamado.descricao,
                    status: chamado.status_chamado,
                    data_cadastro: formatarData(chamado.data_cadastro),
                    data_update: formatarData(chamado.data_update),
                    data_fechamento: formatarData(chamado.data_fechamento),
                    descricao_categoria: chamado.descricao_categoria,
                    id_usuario: chamado.id_usuario,
                    usuario: `${chamado.nome_usuario} ${chamado.sobrenome_usuario}`,
                    email_usuario: chamado.email_usuario,
                    email_responsavel: chamado?.email_responsavel,
                    setor_usuario: chamado.setor_usuario,
                    responsavel: responsavel,
                    anexos: []
                });
            }
            // Adiciona o anexo ao array de anexos
            if (chamado.path_anexo) {
                chamadosMap.get(chamado.id).anexos.push(chamado.path_anexo);
            }
        });

        // Adiciona os valores do mapa ao resultado final
        for (const chamado of chamadosMap.values()) {
            json.result.push(chamado);
        }

    } catch (error) {
        json.error = 'Erro ao buscar chamados';
    }

    res.json(json);
};


async function buscarTodos(req, res) {
    let json = { error: '', result: [] };
    const page = req.query.page || 1; // Página atual (padrão: 1)
    const limit = req.query.limit || 20; // Limite de itens por página (padrão: 20)
    const filtroAvancado = {
        categoria: req.query.categoria,
        responsavel: req.query.responsavel,
        status: req.query.status
    };

    const dataInicial = req.query.dataInicial;
    const dataFinal = req.query.dataFinal;

    let chamados = await chamadoService.buscarTodos(page, limit, filtroAvancado, dataInicial, dataFinal);

    // Criar um mapa para agrupar os chamados pelo ID
    const chamadosMap = new Map();
    chamados.forEach(chamado => {
        if (!chamadosMap.has(chamado.id)) {
            let responsavel = `${chamado.nome_responsavel}  ${chamado.sobrenome_responsavel}`
            if(chamado.nome_responsavel == null){
                responsavel = "";
            }

            chamadosMap.set(chamado.id, {
                id: chamado.id,
                titulo: chamado.titulo,
                descricao: chamado.descricao,
                status: chamado.status_chamado,
                data_cadastro: formatarData(chamado.data_cadastro),
                data_update: formatarData(chamado.data_update),
                data_fechamento: formatarData(chamado.data_fechamento),
                descricao_categoria: chamado.descricao_categoria,
                id_usuario: chamado.id_usuario,
                usuario: `${chamado.nome_usuario} ${chamado.sobrenome_usuario}`,
                email_usuario: chamado.email_usuario,
                id_responsavel: chamado?.id_responsavel,
                email_responsavel: chamado?.email_responsavel,
                setor_usuario: chamado.setor_usuario,
                responsavel: responsavel,
                anexos: []
            });
        }
        // Adiciona o anexo ao array de anexos
        if (chamado.path_anexo) {
            chamadosMap.get(chamado.id).anexos.push(chamado.path_anexo);
        }
    });

    // Adiciona os valores do mapa ao resultado final
    for (const chamado of chamadosMap.values()) {
        json.result.push(chamado);
    }

    res.json(json);
};

async function listChamados(req, res) {
    let json = { error: '', result: [] };
    const page = req.query.page || 1; // Página atual (padrão: 1)
    const limit = req.query.limit || 20; // Limite de itens por página (padrão: 20)

    try {
        let chamados = await chamadoService.listChamados(page, limit);

        // Criar um mapa para agrupar os chamados pelo ID
        const chamadosMap = new Map();
        chamados.forEach(chamado => {
            if (!chamadosMap.has(chamado.id)) {
                let responsavel = `${chamado.nome_responsavel} ${chamado.sobrenome_responsavel}`;
                if (chamado.nome_responsavel == null) {
                    responsavel = "";
                }

                chamadosMap.set(chamado.id, {
                    id: chamado.id,
                    titulo: chamado.titulo,
                    descricao: chamado.descricao,
                    status: chamado.status_chamado,
                    data_cadastro: formatarData(chamado.data_cadastro),
                    data_update: formatarData(chamado.data_update),
                    data_fechamento: formatarData(chamado.data_fechamento),
                    id_usuario: chamado.id_usuario
                });
            }
        });

        // Adiciona os valores do mapa ao resultado final
        for (const chamado of chamadosMap.values()) {
            json.result.push(chamado);
        }

        res.json(json);
    } catch (error) {
        json.error = 'Erro ao carregar chamados';
        res.json(json);
    }
}

async function buscarChamado(req, res){
    let json = {error: '', result:{}};

    const codigo = req.params.id;
    let chamados = await chamadoService.buscarChamado(codigo);
    // Criar um mapa para agrupar os chamados pelo ID
    const chamadosMap = new Map();
    chamados.forEach(chamado => {
        if (!chamadosMap.has(chamado.id)) {
            let responsavel = `${chamado.nome_responsavel}  ${chamado.sobrenome_responsavel}`
            if(chamado.nome_responsavel == null){
                responsavel = "";
            }

            chamadosMap.set(chamado.id, {
                id: chamado.id,
                titulo: chamado.titulo,
                descricao: chamado.descricao,
                status: chamado.status_chamado,
                data_cadastro: formatarData(chamado.data_cadastro),
                data_update: formatarData(chamado.data_update),
                data_fechamento: formatarData(chamado.data_fechamento),
                descricao_categoria: chamado.descricao_categoria,
                id_usuario: chamado.id_usuario,
                usuario: `${chamado.nome_usuario} ${chamado.sobrenome_usuario}`,
                id_responsavel: chamado?.id_responsavel,
                email_usuario: chamado.email_usuario,
                email_responsavel: chamado?.email_responsavel,
                setor_usuario: chamado.setor_usuario,
                responsavel: responsavel,
                anexos: []
            });
        }
        // Adiciona o anexo ao array de anexos
        if (chamado.path_anexo) {
            chamadosMap.get(chamado.id).anexos.push(chamado.path_anexo);
        }
    });

    // Adiciona os valores do mapa ao resultado final
    for (const chamado of chamadosMap.values()) {
        json.result = chamado;
    }

    res.json(json);
};

async function cadastraChamado(req, res) {
    let json = { error: '', result: {} };

    const { titulo, descricao, categoria } = req.body;
    const status = 'aberto';
    const id_usuario = tokenDecoded(req).userId; //irá ser obtido a partir do jwt token presente no header
    const anexos = [];

    if (titulo && descricao) {
        // Verifica se há arquivos anexados na requisição
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    // Gera um nome único baseado no timestamp atual
                    const timestamp = Date.now();
                    const extensao = path.extname(file.originalname);
                    const nomeArquivo = `${timestamp}${extensao}`;
                    // const filePath = path.resolve(__dirname, './uploads', nomeArquivo);
                    
                    // Obtém o tipo de conteúdo com base na extensão do arquivo
                    const contentType = getContentType(extensao);
                    
                    // Upload do arquivo para o Amazon S3
                    const uploadedFile = await s3Service.uploadFile(file.path, process.env.AWS_BUCKET_NAME, nomeArquivo, {
                        ContentType: contentType
                    });
                    // Adiciona o caminho do arquivo aos anexos
                    anexos.push(uploadedFile.Location);

                    // Remover o arquivo temporário após o upload
                    fs.unlinkSync(file.path);
                } catch (error) {
                    console.error('Erro ao fazer upload do arquivo:', error);
                    // json.error = 'Erro ao fazer upload do arquivo';
                    // return res.json(json);
                }
            }
        }

        try {
            // Chama o serviço para cadastrar o chamado com os anexos
            const chamadoId = await chamadoService.cadastraChamado(titulo, descricao, status, id_usuario, categoria, anexos);
            json.result = chamadoId;
            json.result['anexos'] = anexos;
        } catch (error) {
            json.error = error.message;
        }
    } else {
        json.error = 'Campos inválidos';
    }
    res.json(json);
}

// Função para obter o tipo de conteúdo com base na extensão do arquivo
function getContentType(extensao) {
    switch (extensao.toLowerCase()) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.pdf':
            return 'application/pdf';
        case '.doc':
            return 'application/msword';
        case '.docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        // Adicione mais casos conforme necessário para outros tipos de arquivos
        default:
            return 'application/octet-stream'; // Tipo de conteúdo genérico
    }
}



async function alteraChamado(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;

    const titulo = req.body.titulo;
    const descricao = req.body.descricao;

    if(id && titulo && descricao){
        json.result = await chamadoService.alteraChamado(id, titulo, descricao);
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)
}

async function atribuirChamado(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;
    const id_responsavel = tokenDecoded(req).userId;

    if(id){
        json.result = await chamadoService.atribuirChamado(id, id_responsavel);
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)
}

async function rejeitaChamado(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;
    const id_responsavel = tokenDecoded(req).userId;
    const motivo = req.body.motivo

    if(id){
        json.result = await chamadoService.rejeitaChamado(id, id_responsavel, motivo);
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)
}

async function atualizaStatus(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;
    const status = req.body.status;

    if(id){
        json.result = await chamadoService.atualizaStatus(id, status);
    }else{
        json.error = 'Capos inválidos';
    }
    res.json(json)
}

async function excluirChamado(req, res){
    let json = {error: '', result:{}};
    
    await chamadoService.excluirChamado(req.params.id);
    res.json(json)
}

module.exports = {
    meusChamados,
    buscarTodos,
    listChamados,
    buscarChamado,
    cadastraChamado,
    alteraChamado,
    atribuirChamado,
    rejeitaChamado,
    atualizaStatus,
    excluirChamado
}