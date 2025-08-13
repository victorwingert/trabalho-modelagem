# DumBloco - Sistema de Gestão de Condomínios

![Status](https://img.shields.io/badge/status-Em%20Desenvolvimento-yellow)
![Licença](https://img.shields.io/badge/licen%C3%A7a-MIT-blue)

## 📖 Descrição

O **DumBloco** é um sistema de gestão de condomínios desenvolvido como parte do projeto de modelagem de dados. A aplicação visa centralizar e otimizar a administração de condomínios, oferecendo funcionalidades para gerenciamento de moradores, funcionários, notícias, serviços e muito mais.

A arquitetura do projeto é dividida em:

* **`Server`**: Uma API RESTful construída com Node.js e Express, responsável por toda a lógica de negócio e comunicação com o banco de dados.
* **`Client`**: Uma interface de usuário moderna e reativa, desenvolvida com React, TypeScript e Vite.

## ✨ Funcionalidades

O sistema conta com diversos módulos para uma gestão completa:

* 🔐 **Autenticação de Usuários:** Sistema de login seguro com JSON Web Tokens (JWT) e diferentes níveis de acesso (Morador, Funcionário, Proprietário, Síndico, Admin).
* 👤 **Gestão de Moradores e Proprietários:** CRUD completo para gerenciar moradores e proprietários, com visualização em tabelas interativas.
* 👥 **Gestão de Funcionários:** Cadastro e controle de funcionários do condomínio.
* 🏢 **Gestão de Blocos e Apartamentos:** Controle de blocos e unidades do condomínio.
* 📰 **Mural de Notícias:** Publicação e visualização de notícias e comunicados importantes.
* 📦 **Controle de Produtos:** Gerenciamento de estoque de produtos do condomínio.
* 🛠️ **Pedidos de Serviço:** Abertura e acompanhamento de solicitações de serviços e manutenções.

## 🚀 Tecnologias Utilizadas

### Backend (`/server`)

* **Node.js**
* **Express.js:** Para a construção da API REST.
* **Sequelize:** ORM para interação com o banco de dados.
* **Microsoft SQL Server (MSSQL):** Banco de dados utilizado, com configurações prontas para o Azure SQL.
* **Bcrypt:** Para criptografia de senhas.
* **JSON Web Token (JWT):** Para autenticação e gerenciamento de sessões.
* **Dotenv:** Para gerenciamento de variáveis de ambiente.

### Frontend (`/client/DumBloco`)

* **React** com **TypeScript**.
* **Vite:** Como ferramenta de build e servidor de desenvolvimento.
* **React Router DOM:** Para gerenciamento de rotas na aplicação.
* **Tailwind CSS:** Para estilização rápida e moderna.
* **Shadcn/ui:** Componentes de UI personalizáveis.

## 📁 Estrutura do Projeto

O projeto está organizado em uma estrutura monorepo com duas pastas principais:

```
/
├── client/DumBloco/   # Contém todo o código do frontend React
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── config/
│       ├── pages/
│       └── ...
├── server/            # Contém todo o código do backend Node.js
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   └── server.js      # Ponto de entrada da API
└── README.md
```

## ⚙️ Como Executar

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

* Node.js (versão 18 ou superior)
* NPM ou Yarn
* Uma instância do Microsoft SQL Server

### 1. Configuração do Backend

```bash
# Navegue até a pasta do servidor
cd server

# Instale as dependências
npm install
```

Crie um arquivo `.env` na raiz da pasta `/server` e preencha com as suas credenciais do banco de dados, seguindo o exemplo abaixo:

```env
# Credenciais do Banco de Dados
DB_NAME=seu_banco_de_dados
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_HOST=seu_servidor_sql
DB_PORT=1433 # Porta padrão do SQL Server

# Chave secreta para o JWT
JWT_SECRET=sua_chave_secreta_super_segura
```

Após configurar o `.env`, execute o servidor:

```bash
# Inicia o servidor em modo de desenvolvimento (com nodemon)
npm run dev

# Ou inicie em modo de produção
npm start
```

O servidor estará rodando em `http://localhost:3001`.

### 2. Configuração do Frontend

```bash
# Navegue até a pasta do cliente
cd client/DumBloco

# Instale as dependências
npm install
```

Após a instalação, inicie a aplicação React:

```bash
# Inicia o servidor de desenvolvimento do Vite
npm run dev
```

A aplicação frontend estará disponível em `http://localhost:5173` (ou outra porta indicada pelo Vite).
