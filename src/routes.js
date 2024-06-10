//dependências
const express = require('express');
const router = express.Router();
const validarToken = require('./middlewares/auth');

//controladores
const chamadoController = require('./controllers/chamadoController');
const loginController = require('./controllers/loginController');
const setorController = require('./controllers/setorContoller');
const cargoController = require('./controllers/cargoController');
const userController = require('./controllers/userController');
const comentarioController = require('./controllers/comentarioController');
const chatController = require('./controllers/chatController');
const categoriaController = require('./controllers/categoriaController');
const dashboardController = require('./controllers/dashboardController');

//Rotas

router.post('/login', loginController.login);
router.get('/verify', loginController.verify);

// Middleware para validar token JWT em todas as rotas, exceto a de login
router.use(validarToken);

router.get('/meusChamados', chamadoController.meusChamados);
router.get('/chamados', chamadoController.buscarTodos);
router.get('/chamados/list', chamadoController.listChamados);
router.get('/chamado/:id', chamadoController.buscarChamado);
router.post('/chamado', chamadoController.cadastraChamado);
router.put('/chamado/:id', chamadoController.alteraChamado);
router.put('/atribuirChamado/:id', chamadoController.atribuirChamado);
router.put('/rejeitaChamado/:id', chamadoController.rejeitaChamado);
router.put('/atualizaStatus/:id', chamadoController.atualizaStatus);
router.delete('/chamado/:id', chamadoController.excluirChamado);

router.get('/categorias', categoriaController.buscarTodos);
router.get('/categoria/:id', categoriaController.buscarCategoria);
router.post('/categoria', categoriaController.cadastraCategoria);
router.put('/categoria/:id', categoriaController.alteraCategoria);
router.put('/categoriaAtivo/:id', categoriaController.ativaInativa);
router.delete('/categoria/:id', categoriaController.excluirCategoria);

router.get('/comentario/:id', comentarioController.buscarComentarios);
router.post('/comentario', comentarioController.cadastraComentario);
router.put('/comentario/:id', comentarioController.alteraComentario);
router.delete('/comentario/:id', comentarioController.excluirComentario);

router.get('/chat', chatController.getChatMessages);

router.get('/setores', setorController.buscarTodos);
router.get('/setor/:id', setorController.buscarSetor);
router.post('/setor', setorController.cadastraSetor);
router.put('/setor/:id', setorController.alteraSetor);
router.put('/setorAtivo/:id', setorController.ativaInativa);
router.delete('/setor/:id', setorController.excluirSetor);

router.get('/cargos', cargoController.buscarTodos);
router.get('/cargo/:id', cargoController.buscarCargo);
router.post('/cargo', cargoController.cadastraCargo);
router.put('/cargo/:id', cargoController.alteraCargo);
router.put('/cargoAtivo/:id', cargoController.ativaInativa);
router.delete('/cargo/:id', cargoController.excluirCargo);

router.get('/users', userController.buscarTodos);
router.get('/users/responsaveis', userController.responsaveis);
router.get('/user/:id', userController.buscarUser);
router.post('/user', userController.cadastraUser);
router.put('/user/:id', userController.alteraUser);
router.put('/user/:id/profile', userController.alteraProfile);
router.put('/userAtivo/:id', userController.ativaInativa);
router.delete('/user/:id', userController.excluirUser);

router.put('/user/:id/password', userController.alteraSenha);

router.get('/dashboard/chamadosCategoria', dashboardController.chamadosCategorias);
router.get('/dashboard/chamadosSetor', dashboardController.chamadosSetor);
router.get('/dashboard/abertosFechados', dashboardController.abertosFechados);
router.get('/dashboard/abertosFechadosUsuario', dashboardController.abertosFechadosUsuario);

module.exports = router;