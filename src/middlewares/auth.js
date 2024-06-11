const jwt = require('jsonwebtoken');

function validarToken(req, res, next) {
    // Verificar se o endpoint é o de login
    if (req.path === '/login') {
        // Se for o endpoint de login, passa para a próxima função de rota
        return next();
    }

    // Verificar se o header Authorization está presente na requisição
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }

    // Extrair o token do header Authorization (Bearer token)
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token de autenticação malformatado' });
    }

    try {
        // Verificar se o token é válido
        const decoded = jwt.verify(token, process.env.SEGREDO_JWT);
        
        // Verificar se o token não expirou
        if (decoded.exp <= Math.floor(Date.now() / 1000)) {
            throw new Error('Token expirado');
        }

        // Adiciona os dados decodificados do token ao objeto de requisição para que possam ser acessados posteriormente
        req.user = decoded;

        // Passa para a próxima função de rota
        next();
    } catch (err) {
        // Ocorreu um erro ao verificar o token
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(401).json({ error: 'Token inválido' });
    }
}

module.exports = validarToken;
