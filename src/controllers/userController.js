const userService = require('../services/userService');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const s3Service = require('../config/s3Storage');

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

async function responsaveis(req, res){
    let json = {error: '', result:{ data: []}};

    try {
        const { results, totalPages } = await userService.responsaveis();
        json.result.data = results;
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
    let profile_path = null;

    // Verificação de campos obrigatórios
    if (!nome || !sobrenome || !email || !username || !password || !setor || !cargo || !acesso) {
        json.error = 'Campos inválidos';
        return res.status(400).json(json); // Retorna um erro 400 com a mensagem
    }

    console.log(req)
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
                const uploadedFile = await s3Service.uploadFile(file.path, process.env.AWS_BUCKET_NAME_PROFILE, nomeArquivo, {
                    ContentType: contentType
                });
                // Adiciona o caminho do arquivo aos anexos
                profile_path = uploadedFile.Location;

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
        const userId = await userService.cadastraUser(nome, sobrenome, email, username, password, setor, cargo, acesso, profile_path);
        json.result = userId;
        res.json(json);
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        json.error = 'Erro interno ao cadastrar usuário';
        res.status(500).json(json); // Retorna um erro 500 para erro interno do servidor
    }
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

async function alteraUser(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;
    let profile_path = null;
    const { nome, sobrenome, email, username, setor, cargo, nivel_acesso } = req.body;
    console.log('campossss '+ nome, sobrenome, email, username, setor, cargo, nivel_acesso)

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
                const uploadedFile = await s3Service.uploadFile(file.path, process.env.AWS_BUCKET_NAME_PROFILE, nomeArquivo, {
                    ContentType: contentType
                });
                // Adiciona o caminho do arquivo aos anexos
                profile_path = uploadedFile.Location;

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
        const updatedUser = await userService.alteraUser(id, nome, sobrenome, email, username, setor, cargo, nivel_acesso, profile_path);
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
    responsaveis,
    buscarTodos,
    buscarUser,
    cadastraUser,
    alteraUser,
    ativaInativa,
    excluirUser
}