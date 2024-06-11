# API de Chamados

Bem-vindo ao repositório da API de Chamados. Esta API serve como backend para um sistema de gestão de chamados. A seguir, você encontrará instruções sobre como instalar, configurar e executar a API localmente.

## Índice

- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Execução](#execução)
- [Rotas da API](#rotas-da-api)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Pré-requisitos

Antes de começar, certifique-se de ter os seguintes softwares instalados em seu ambiente:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Instalação

1. Clone este repositório em sua máquina local:
    ```bash
    git clone https://github.com/LucasSchupchek/apiChamados.git
    cd apiChamados
    ```

2. Instale as dependências do projeto:
    ```bash
    npm install
    ```

    ou, se você estiver usando yarn:
    ```bash
    yarn install
    ```

## Configuração

1. Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis de ambiente (como exemplo):

    ```bash
    PORT=3000
    DB_HOST=localhost
    DB_USER=seu_usuario
    DB_PASS=sua_senha
    DB_NAME=nome_do_banco

    SEGREDO_JWT=segredo_jwt

    AWS_ACCESSKEY=sua_accesskey_aws
    AWS_SECRETACESSKEY=sua_secretaccesskey_aws
    AWS_REGION=aws_region
    AWS_BUCKET_NAME=bucket_aws_anexos
    AWS_BUCKET_NAME_PROFILE=bucket_aws_profile_photos
    ```

    Certifique-se de preencher as variáveis de ambiente com os valores corretos para sua configuração local.

2. Configure o banco de dados:
    - Certifique-se de que o banco de dados esteja rodando e acessível com as credenciais fornecidas no arquivo `.env`.

## Execução

Para iniciar o servidor da API, utilize o comando:

```bash
npm start
