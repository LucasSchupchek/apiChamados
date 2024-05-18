#####################
install dependencies
npm install node --save -y
npm install exprexx, cors, mysql, dotenv, body-parser, multer, jsonwebtoken

#####################
caso tenha erro na conexão com o banco de dbApiChamados
utilize a query abaixo

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345';

Onde rootcomo seu usuário localhostcomo seu URL e passwordcomo sua senha

Em seguida, execute esta consulta para atualizar os privilégios:

flush privileges;

Tente conectar-se usando o nó depois de fazer isso.

Se isso não funcionar, tente sem @'localhost'peça.

####################
variaveis.env -> adicione aqui suas credenciais do banco de dados mysql
pasta db -> arquivo de create database e querys para popular o banco com dados para testes