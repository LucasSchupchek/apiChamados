const loginService = require('../services/loginService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
 
async function login(req, res) {
  try {
      let json = { error: '', result: {} };

      const user = req.body.user;
      const password = req.body.password;

      if (user && password) {
          const login = await loginService.login(user, password);

          if (login.aceito === true) {

              const SECRET = process.env.SEGREDO_JWT;
              const token = jwt.sign({ userId: login.id, nivel_acesso: login.nivel_acesso }, SECRET, { expiresIn: 3000 });
              json.result = {
                  auth: true,
                  token,
                  expiresIn: 3000,
                  user: {
                      id: login.id,
                      nome: login.nome,
                      sobrenome: login.sobrenome,
                      permission: login.nivel_acesso
                  },
                  ProfilePath: login.ProfilePath
              }
              res.status(200).json(json);
          } else {
              json.error = "usuário ou senha inválido ou usuário inativo";
              res.status(401).json(json);
          }
      } else {
          json.error = "Campos inválidos";
          res.status(400).json(json);
      }
  } catch (error) {
      res.status(500).json({ error: "Erro no serviço, contate o suporte" });
  }
}


async function verify(req, res){
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
  
    //lembrar de enviar para o service validar a chave secreta
    //validar a data de expiração do token.

    try {
      // Verificar se o token é válido
      const decoded = jwt.verify(token, process.env.SEGREDO_JWT);
      
      //verifica se o token é válido
      if (!decoded.userId || !decoded.nivel_acesso) {
        throw new Error('Token inválido');
      }

      // Verificar se o token não expirou
      if (decoded.exp <= Math.floor(Date.now() / 1000)) {
        throw new Error('Token expirado');
      }
      return res.status(200).json({ message: 'Token válido' });
    } catch (err) {
      // Ocorreu um erro ao verificar o token
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expirado' });
      }
      return res.status(401).json({ error: 'Token inválido' });
    }
  }

module.exports = {
    login,
    verify
}