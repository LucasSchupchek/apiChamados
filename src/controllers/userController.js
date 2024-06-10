const userService = require('../services/userService');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const s3Service = require('../config/s3Storage');
const bcrypt = require('bcrypt');

async function buscarTodos(req, res){
    let json = {error: '', result:{ data: [], totalItems: 0 }};

    try {
        const users = await userService.buscarTodos();
        json.result.data = users.results;
        json.result.totalItems = users.length;
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

async function cadastraUser(req, res) {
    let json = { error: '', result: {} };

    const { nome, sobrenome, email, username, password, setor, cargo, acesso } = req.body;
    let profile_path = 'https://arquiveschamados.s3.sa-east-1.amazonaws.com/profile_photos/1_g09N-jl7JtVjVZGcd-vL2g.jpg';

    // Verificação de campos obrigatórios
    if (!nome || !sobrenome || !email || !username || !password || !setor || !cargo || !acesso) {
        json.error = 'Campos inválidos';
        return res.status(400).json(json); // Retorna um erro 400 com a mensagem
    }

    console.log(req);
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            try {
                // Gera um nome único baseado no timestamp atual
                const timestamp = Date.now();
                const extensao = path.extname(file.originalname);
                const nomeArquivo = `${timestamp}${extensao}`;
                
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
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userId = await userService.cadastraUser(nome, sobrenome, email, username, hashedPassword, setor, cargo, acesso, profile_path);
        json.result = userId;
        res.json(json);
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);

        if (error.message === 'Email ou username já cadastrado') {
            json.error = 'Email ou username já cadastrado';
            res.status(400).json(json); // Retorna um erro 400 para duplicidade de email ou username
        } else {
            json.error = 'Erro interno ao cadastrar usuário';
            res.status(500).json(json); // Retorna um erro 500 para erro interno do servidor
        }
    }
}

async function alteraSenha(req, res) {
    let json = {error: '', result:{}};

    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;

    try {
        const user = await userService.buscarUser(id);

        if (!user) {
            json.error = 'Usuário não encontrado';
            return res.status(404).json(json);
        }

        // Verifica se a senha atual está correta
        const isMatch = await bcrypt.compare(currentPassword, user.password_user);
        if (!isMatch) {
            json.error = 'Senha atual incorreta';
            return res.status(400).json(json);
        }

        // Criptografa a nova senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Atualiza a senha no banco de dados
        await userService.alteraSenha(id, hashedPassword);

        json.result = 'Senha atualizada com sucesso';
        res.json(json);
    } catch (error) {
        console.error('Erro ao alterar a senha:', error);
        json.error = 'Erro interno ao alterar a senha';
        res.status(500).json(json);
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

async function alteraProfile(req, res){
    let json = {error: '', result:{}};

    const id = req.params.id;
    let profile_path = null;
    const { nome, sobrenome, email } = req.body;
    console.log('campossss '+ nome, sobrenome, email)

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
        const updatedUser = await userService.alteraProfile(id, nome, sobrenome, email, profile_path);
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
    excluirUser,
    alteraSenha,
    alteraProfile
}